import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, INV_C_InvOutAllocIdRequest, INV_R_InvOutAllocationInfoAndBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesModel, PTS_C_BundleReportingRequest, FixedOpCodeEnum, PTS_R_TranLogIdInfoResponse, PTS_C_TranLogIdRequest, PTS_R_TranLogIdInfoModel, PTS_C_QmsBarcodeNumberRequest, PTS_R_QmsBarcodeInfoResponse, PTS_R_QmsBarcodeInfoModel, BarcodeAttributes, PTS_R_QmsBarcodeInfoOpGroupsModel, PTS_C_OperatorIdRequest, PTS_R_BundleScanResponse, PTS_R_BundleScanModel, JobBarcodeTypeEnum, MoProductColorReq, MoOpSequenceInfoResponse, MoOpSequenceInfoModel, MoPslIdProcessTypeReq, MoOperationReportedQtyInfoModel, MoOperationReportedQtyInfoResponse, PTS_C_ProcTypeBundleBarcodeRequest, PTS_R_ProcTypeBundleCompletedQtyResponse, PTS_R_ProcTypeBundleBarcodeCompletedQtyModel, PTS_R_BundleBarcodeOutputQtyModel } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { DataSource, In, Not } from "typeorm";
import { InvReceivingRepository } from "../entity/repository/inv-receiving.repository";
import { BundleTransRepository } from "../entity/repository/bundle-trans.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { OpReportingHelperService } from "./op-reporting-helper.service";
import { BundleTransEntity } from "../entity/bundle-trans.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { Injectable } from "@nestjs/common";
import { OpSequenceRefRepository } from "../entity/repository/op-sequence-ref.repository";
import { OperatorActivityEntity } from "../entity/operator-activity.entity";
import { OperatorActivityRepository } from "../entity/repository/operator-activity.repository";
import { OpSequenceOpgEntity } from "../entity/op-sequence-opg.entity";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { MoActualBundleRepository } from "../entity/repository/mo-actual-bundle.repository";
import { MoActualBundleSProcRepository } from "../entity/repository/mo-actual-bundle-sproc.repository";

@Injectable()
export class OpReportingInfoService {

    constructor(
        private oslRepo: OslInfoRepository,
        private opSeqRefRepo: OpSequenceRefRepository,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private bunTranLogRepo: BundleTransRepository,
        private operatorLogRepo: OperatorActivityRepository,
        private repHelperService: OpReportingHelperService,
        private moActualBundleRepo: MoActualBundleRepository,
        private moActBundleSProcRepo: MoActualBundleSProcRepository
    ) {

    }

    // called from SPS
    // ENDPOINT
    async getReportedInfoForTranIds(req: PTS_C_TranLogIdRequest): Promise<PTS_R_TranLogIdInfoResponse> {
        const { companyCode, unitCode, tranIds } = req;
        if (!tranIds) {
            throw new ErrorResponse(0, `No Tran Ids are provided`);
        }
        const recs = await this.bunTranLogRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(tranIds) } });
        if (recs.length == 0) {
            throw new ErrorResponse(0, `No info found for the given Tran Ids. ${req.tranIds?.toString()}`);
        }
        const pslIds = recs.map(r => r.pslId);
        const pslRec = await this.oslRepo.find({ select: ['size', 'color', 'oslId'], where: { companyCode, unitCode, oslId: In(pslIds) } });
        const pslInfoMap = new Map<number, OslInfoEntity>();
        pslRec.forEach(r => {
            pslInfoMap.set(Number(r.oslId), r);
        })
        const opgIds = recs.map(r => r.opgId);
        console.log(opgIds);
        const opgRecs = await this.opSeqOpgRepo.find({ select: ['spFgSku', 'id'], where: { companyCode, unitCode, id: In(opgIds) } });
        const opgInfoMap = new Map<number, OpSequenceOpgEntity>();
        opgRecs.forEach(r => {
            opgInfoMap.set(Number(r.id), r);
        });
        console.log(opgInfoMap);
        const tranLogModels: PTS_R_TranLogIdInfoModel[] = [];
        recs.forEach(r => {
            const opgInfo = opgInfoMap.get(Number(r.opgId));
            const pslInfo = pslInfoMap.get(Number(r.pslId));
            const m1 = new PTS_R_TranLogIdInfoModel(r.id, r.pslId, r.currJob, r.rQty, r.gQty, r.opGroup, r.opCode, r.procSerial, r.procType, opgInfo?.spFgSku, pslInfo.size, pslInfo.color);
            tranLogModels.push(m1);
        });
        return new PTS_R_TranLogIdInfoResponse(true, 0, 'Tran id info retrieved', tranLogModels);
    }

    // called from QMS
    // ENDPOINT
    async getBundleTrackingInfoForBundleBarcode(req: PTS_C_QmsBarcodeNumberRequest): Promise<PTS_R_QmsBarcodeInfoResponse> {
        const { companyCode, unitCode, barcodeNumber } = req;
        if (!barcodeNumber) {
            throw new ErrorResponse(0, `Barcode number was not provided`);
        }
        // check if the barcode exist
        const barcodeRecs = await this.moActualBundleRepo.find({ select: ['abBarcode', 'procType', 'procSerial', 'pslId', 'quantity'], where: { companyCode, unitCode, abBarcode: barcodeNumber } });
        if (barcodeRecs.length == 0) {
            throw new ErrorResponse(0, `Barcode records not found for the barcode : ${barcodeNumber}`);
        }
        const procTypes = new Set<ProcessTypeEnum>();
        barcodeRecs.forEach(r => procTypes.add(r.procType));
        const pslId = barcodeRecs[0].pslId;
        // get random Fg
        const randomFg = await this.repHelperService.randomFgNumberForBundleBarcode(barcodeNumber, true);
        if (!randomFg) {
            throw new ErrorResponse(0, `Fg not found for the barcode : ${barcodeNumber}`);
        }
        const pslProps = await this.repHelperService.getPslPropsForPslId(pslId, companyCode, unitCode);
        // now get the op groups for the fg and osl
        const opgRecs = await this.repHelperService.getOpGroupRecsForMoProdColor(companyCode, unitCode, pslProps.moNo, pslProps.productCode, pslProps.color, [...procTypes]);
        if (opgRecs.length == 0) {
            throw new ErrorResponse(0, `Operation records not found for the barcode : ${barcodeNumber}. Style : ${pslProps.style} , product : ${pslProps.productCode} , MO : ${pslProps.moNo}`);
        }
        const attrModel = new BarcodeAttributes(pslProps.style, pslProps.color, pslProps.productName, pslProps.moNo, pslProps.moLineNo, pslProps.size, pslProps.delDate, null, null);
        const tranRes = await this.bunTranLogRepo.getGoodAndRejQtyForBundleBarcode(barcodeNumber, [], companyCode, unitCode);
        const opsModels: PTS_R_QmsBarcodeInfoOpGroupsModel[] = [];
        for (const opgRec of opgRecs) {
            let bunRec = barcodeRecs.find(r => r.procType == opgRec.procType);
            const moBundleSubProcRec = await this.moActBundleSProcRepo.findOne({ select: ['jobNumber'], where: { abBarcode: bunRec.abBarcode, procType: opgRec.procType, subProc: opgRec.subProcName, pslId: pslId } });
            const repQty = tranRes.find(r => (r.op_group == opgRec.opGroup) && r.op_code == FixedOpCodeEnum.OUT);
            const m2 = new PTS_R_QmsBarcodeInfoOpGroupsModel(opgRec.opGroup, opgRec.opCodes?.split(','), opgRec.pFgSku, bunRec?.quantity, repQty?.g_qty, repQty?.r_qty, moBundleSubProcRec.jobNumber, opgRec.procType);
            opsModels.push(m2);
        }
        const m1 = new PTS_R_QmsBarcodeInfoModel(barcodeNumber, opsModels, attrModel);
        return new PTS_R_QmsBarcodeInfoResponse(true, 0, 'Bundle info retrieved', [m1]);
    }

    // async getBundleTransactionsForBundleBarcode(): Promise<> {

    // }

    async getOperatorLastBundleInfo(req: PTS_C_OperatorIdRequest): Promise<PTS_R_BundleScanResponse> {
        const { companyCode, unitCode, operatorId } = req;
        if (!operatorId) {
            throw new ErrorResponse(0, 'Operator id not provided');
        }
        const lastBundle = await this.operatorLogRepo.findOne({ select: ['tranLogId'], where: { companyCode, unitCode, operatorId: operatorId }, order: { createdAt: 'DESC' } });
        if (!lastBundle) {
            return new PTS_R_BundleScanResponse(true, 0, 'No bundles are logged for this user', null);
        }
        const tranLogInfo = await this.bunTranLogRepo.findOne({where: { companyCode, unitCode, id: lastBundle.tranLogId}});
        if(!tranLogInfo){
            return new PTS_R_BundleScanResponse(true, 0, 'No open bundles for this user', null);
        }
        const m2 = new PTS_R_BundleScanModel(tranLogInfo.bundleBarcode, tranLogInfo.opGroup, tranLogInfo.randomOp, tranLogInfo.opCode, tranLogInfo.gQty, tranLogInfo.rQty, tranLogInfo.procType, JobBarcodeTypeEnum.JOB_BUNDLE);
        return new PTS_R_BundleScanResponse(true, 0, `Bundle for the operator retrieved`, m2);
    }

    async getOpSequenceForGiveMoPRoductFgColor(req: MoProductColorReq): Promise<MoOpSequenceInfoResponse> {
        const opSeqRef = await this.opSeqRefRepo.findOne({ where: { moNo: req.moNumber, prodCode: req.productCode, fgColor: req.fgColor, companyCode: req.companyCode, unitCode: req.companyCode }, select: ['id'] })
        if (!opSeqRef) {
            throw new ErrorResponse(0, `Operation sequence not found for given MO : ${req.moNumber} Product :${req.productCode},Fg Color:${req.fgColor} `)
        }
        const opSeq = await this.opSeqOpgRepo.getOpSeqForOpSeqRefId(opSeqRef.id)
        console.log(opSeq)
        if (opSeq.length === 0) {
            throw new ErrorResponse(0, `Operation sequence not found for given MO : ${req.moNumber} Product :${req.productCode},Fg Color:${req.fgColor} `)
        }
        const groupedMap = new Map<string, { procType: string, opSequence: number, lastOpGroup: string }>();

        // get the last creted op group to bring the quantities only for the last operation for each process type
        for (const row of opSeq) {
            const existing = groupedMap.get(row.procType);
            if (!existing) {
                groupedMap.set(row.procType, row);
            }
        }
        const opSeqGroupedResult = Array.from(groupedMap.values()).reverse();
        let seq = 1
        const moOpSequenceInfoArr: MoOpSequenceInfoModel[] = []

        for (const rec of opSeqGroupedResult) {
            const processType: ProcessTypeEnum = rec.procType as ProcessTypeEnum
            const m1 = new MoOpSequenceInfoModel(processType, seq, rec.lastOpGroup);
            seq += 1
            moOpSequenceInfoArr.push(m1);
        }
        return new MoOpSequenceInfoResponse(true, 0, 'Operation sequence retrieved', moOpSequenceInfoArr);
    }

    async getQtyInfoForGivenPslIdAndProcType(req: MoPslIdProcessTypeReq): Promise<MoOperationReportedQtyInfoResponse> {
        const qtysRes = await this.bunTranLogRepo.getQtyInfoForGivenPslIdAndProcType(req)
        if (qtysRes.length === 0) {
            throw new ErrorResponse(0, `No Qtys found for the given  Processing Type : ${req.processType}`)
        }
        const moOperationReportedQtysArr: MoOperationReportedQtyInfoModel[] = []
        for (const eachRec of qtysRes) {
            const processType = eachRec.processType as ProcessTypeEnum
            const moReportedQtysObj = new MoOperationReportedQtyInfoModel(processType, Number(eachRec.completedQty), Number(eachRec.rejectedQty))
            moOperationReportedQtysArr.push(moReportedQtysObj)
        }
        return new MoOperationReportedQtyInfoResponse(true,1,"data retreived",moOperationReportedQtysArr)
    }

    // called from SPS - to get the output completed bundles for moving to inventory
    async getProcessTypeCompletedQtyForGivenPoProdColBundles(req: PTS_C_ProcTypeBundleBarcodeRequest): Promise<PTS_R_ProcTypeBundleCompletedQtyResponse> {
        const { companyCode, unitCode, procSerial, processType, prodName, fgColor, pslWiseBarcodes } = req;
        if(!pslWiseBarcodes.length) {
            throw new ErrorResponse(0, 'Barcodes are not provided');
        }
        if(!procSerial || !processType || !prodName || !fgColor) {
            throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
        }
        const m1s: PTS_R_ProcTypeBundleBarcodeCompletedQtyModel[] = [];
        const moProdColorOpgLastOpMap = new Map<string, string>(); // mo+prod+color => last op group
        for(const pslBarcodes of pslWiseBarcodes) {
            let lastOpg = '';
            if(!pslBarcodes.bundleBarcodes?.length) {
                continue;
            }
            const pslId = pslBarcodes.pslId;
            const pslProps = await this.repHelperService.getPslPropsForPslId(pslId, companyCode, unitCode);
            const key = pslProps.moNo+''+pslProps.productName+''+pslProps.color;
            if(!moProdColorOpgLastOpMap.has(key)) {
                // get the last op group
                const opgRecs = await this.repHelperService.getOpGroupRecsForMoProdColor(companyCode, unitCode, pslProps.moNo, pslProps.productCode, pslProps.color, [processType]);
                const lastOpg = opgRecs[opgRecs.length-1].opGroup;
                moProdColorOpgLastOpMap.set(key, lastOpg);
            }
            lastOpg = moProdColorOpgLastOpMap.get(key);
            // now get the completed qtys from the bundle trans
            const barcodes = pslBarcodes.bundleBarcodes.map(r => r);
            const scannedBundles = await this.bunTranLogRepo.getGoodAndRejQtyForBundleBarcodesAndFixedOp(barcodes, lastOpg, FixedOpCodeEnum.OUT, companyCode, unitCode);
            const m2s: PTS_R_BundleBarcodeOutputQtyModel[] = [];
            scannedBundles.forEach(r => {
                const m2 = new PTS_R_BundleBarcodeOutputQtyModel(r.barcode, Number(r.g_qty), Number(r.r_qty));
                m2s.push(m2);
            });
            const m1 = new PTS_R_ProcTypeBundleBarcodeCompletedQtyModel(pslId, m2s);
            m1s.push(m1);
        }
        return new PTS_R_ProcTypeBundleCompletedQtyResponse(true, 0, 'Barcode completed quantities retrieved', m1s);
    }
}


