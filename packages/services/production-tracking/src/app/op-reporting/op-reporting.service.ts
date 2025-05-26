import { GlobalResponseObject, ProcessTypeEnum, PTS_C_BundleReportingRequest, FixedOpCodeEnum, PTS_C_BundleReversalRequest, PTS_R_BundleScanResponse, PTS_R_BundleScanModel, JobBarcodeTypeEnum, PtsExtSystemNamesEnum, P_LocationCodeRequest, IpsBarcodeDetailsForQualityResultsResponse, IpsBarcodeQualityResultsModel } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { DataSource, In, Not, Raw } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { BundleTransRepository } from "../entity/repository/bundle-trans.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { OpReportingHelperService } from "./op-reporting-helper.service";
import { BundleTransEntity } from "../entity/bundle-trans.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { OperatorActivityEntity } from "../entity/operator-activity.entity";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { TranLogFgEntity } from "../entity/tran-log-fg.entity";
import { OpReportingPublishService } from "./op-reporting-publish.service";
import { PTS_C_QmsInspectionLogRequest } from "@xpparel/shared-services";
import { QMSTransLogEntity } from "../entity/qms-trans-log.entity";
import { QMSTransLogRepository } from "../entity/repository/qms-trans-log.repository";
import { TranLogFgRepository } from "../entity/repository/tran-log-fg.repository";
import { MoActualBundleSProcRepository } from "../entity/repository/mo-actual-bundle-sproc.repository";

@Injectable()
export class OpReportingService {

    constructor(
        private dataSource: DataSource,
        private fgOpDepRepo: FgOpDepRepository,
        private fgBundleRepo: FgBundleRepository,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private bunTranLogRepo: BundleTransRepository,
        private repHelperService: OpReportingHelperService,
        @Inject(forwardRef(() => OpReportingPublishService)) private opPublishService: OpReportingPublishService,
        private qmsTransLogRepo: QMSTransLogRepository,
        private tranLogFgRepo: TranLogFgRepository,
        private moActBundleSProcRepo: MoActualBundleSProcRepository
    ) {

    }

    // ENDPOINT
    // If an OP is given, this will get the op group and always try to perform the first operation. If first operation done, then second operation will be done
    // We only care about the op group always.
    async reportBundleForAnOp(req: PTS_C_BundleReportingRequest): Promise<PTS_R_BundleScanResponse> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, barcode, opCode, operatorId, locationCode, shift, scannedDate, forceReportPartial, rejQty } = req;
            let incomingQty = (req?.incomingQty ? Number(req.incomingQty) : 0) + (req.rejQty ? Number(req.rejQty) : 0);
            // identify the op group of the incoming bundle and the op code
            // identify the proc type based on the bundle and op group
            const randomFgForBundleInfo = await this.getRandomFgAndPslIdForBundle(barcode, companyCode, unitCode, true);
            const pslId = randomFgForBundleInfo.pslId;
            let operationString = '';
            // using this PSL id get the props
            const oslProps = await this.repHelperService.getPslPropsForPslId(pslId, companyCode, unitCode);
            console.log('1');
            const opRec = await this.repHelperService.getOpGroupRecForMoProdColorOp(companyCode, unitCode, oslProps.moNo, oslProps.productCode, oslProps.color, opCode);
            console.log('2');
            const currOpGroup = opRec.opGroup;
            const procType = opRec.procType;
            const preOpGroups = opRec.preOpGroups?.split(',');
            if (preOpGroups.length == 0) {
                throw new ErrorResponse(0, `Pre op group not found for the current op group : ${currOpGroup} and processing type : ${procType}`);
            }
            console.log('A');
            let currProcSerial = 0;
            let currJob = '';
            let finalFgsCanBeScanned = new Set<number>();
            let currOpType: FixedOpCodeEnum;
            const bundleScanQtys = await this.bunTranLogRepo.getGoodAndRejQtyForBundleBarcode(barcode, [currOpGroup], companyCode, unitCode);
            console.log(bundleScanQtys);
            const firstOpInfo = bundleScanQtys.find(r => r.op_code == FixedOpCodeEnum.IN);
            const lastOpInfo = bundleScanQtys.find(r => r.op_code == FixedOpCodeEnum.OUT);
            if (lastOpInfo) {
                throw new ErrorResponse(0, `Bundle : ${barcode} is already reported with Good: ${lastOpInfo.g_qty} and Rej : ${lastOpInfo.r_qty} for the operation group : ${currOpGroup}. You cannot scan the bundle again for the same operation`);
            }
            // We are performing the first operation
            const fgsForBun = await this.getFgNumbersForBundleAndProcType(barcode, procType, companyCode, unitCode, true);
            if (fgsForBun.fgs.length == 0) {
                throw new ErrorResponse(0, `Bundle is not mapped to any Garments. Please contact support team`);
            }
            let finalQtyToScan = fgsForBun.fgs.length;
            if (incomingQty) {
                if (incomingQty > finalQtyToScan) {
                    throw new ErrorResponse(0, `Bundle has only ${finalQtyToScan} pieces. But asking ${incomingQty} to report`);
                }
                // override the final qty to scan based on incoming input
                finalQtyToScan = incomingQty;
            }
            console.log(fgsForBun);
            let refPreOpGroups = [];
            if (firstOpInfo) {
                operationString = 'OUTPUT';
                console.log('SECOND');
                // ------------------------------- LAST OPERATION OF A BUNDLE ------------------------
                if (firstOpInfo.g_qty == 0) {
                    throw new ErrorResponse(0, `Bundle : ${barcode} is reported with Good: ${firstOpInfo.g_qty} and Rej : ${firstOpInfo.r_qty} for the operation group : ${currOpGroup}. You cannot scan the bundle for the last operation without completing the first operation`);
                }
                // Here we again override the final qty can be scanned based on the first operation output qty
                finalQtyToScan = firstOpInfo.g_qty;
                // this means they are performing the second operation
                const currOpOutNotDoneFgs = await this.fgOpDepRepo.find({ select: ['fgNumber'], where: { oslId: pslId, fgNumber: In(fgsForBun.fgs), opCompleted: false, rFromInv: true, procSerial: fgsForBun.procSerial, opGroup: currOpGroup, opCode: FixedOpCodeEnum.OUT } });
                if (currOpOutNotDoneFgs.length == 0) {
                    throw new ErrorResponse(0, `No pending qty found / no inventory is issued for the barcode : ${barcode} op group : ${currOpGroup} and operation : INPUT `);
                }
                // now check how many FGs the first op was already done
                const firstOpDoneFgs = await this.fgOpDepRepo.find({ select: ['fgNumber'], where: { oslId: pslId, fgNumber: In(fgsForBun.fgs), opCompleted: true, rFromInv: true, isRejected: false, procSerial: fgsForBun.procSerial, opGroup: currOpGroup, opCode: FixedOpCodeEnum.IN }, order: { fgNumber: 'ASC' } });
                firstOpDoneFgs.map(r => finalFgsCanBeScanned.add(r.fgNumber));
                const bunTranLog = await this.bunTranLogRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, bundleBarcode: barcode, opGroup: currOpGroup, opCode: FixedOpCodeEnum.IN }, order: { createdAt: 'DESC' } });
                currJob = bunTranLog.currJob;
                currOpType = FixedOpCodeEnum.OUT;
                currProcSerial = bunTranLog.procSerial;
                refPreOpGroups = [currOpGroup];
            } else {
                if (rejQty) {
                    throw new ErrorResponse(0, `You cannot report rejections for the INPUt operation`);
                }
                operationString = 'INPUT';
                console.log('FIRST');
                // ---------------------------------- FIRST OPERATION OF A BUNDLE ----------------------
                // now get all the op groups for the mo + prod + color for the pre op groups. Exclude the knit operation here
                const opRecs = await this.opSeqOpgRepo.find({ select: ['opGroup', 'procType'], where: { companyCode: companyCode, unitCode: unitCode, opSeqRefId: opRec.opSeqRefId, opGroup: In(preOpGroups), 
                    procType: Raw((alias) =>`proc_type NOT IN ('${ProcessTypeEnum.KNIT}', '${ProcessTypeEnum.CUT}')`) } });
                const preOpGroupsExcludingKnit = new Set<string>();
                opRecs.forEach(r => preOpGroupsExcludingKnit.add(r.opGroup));
                console.log(preOpGroupsExcludingKnit);
                // get the curr op info. the FGs has to be received from inventory and the first operation must not be scanned
                const currOpInputNotDoneFgs = await this.fgOpDepRepo.find({ select: ['fgNumber'], where: { oslId: pslId, fgNumber: In(fgsForBun.fgs), opCompleted: false, rFromInv: true, procSerial: fgsForBun.procSerial, opGroup: currOpGroup, opCode: FixedOpCodeEnum.IN }, order: { fgNumber: 'ASC' } });
                if (currOpInputNotDoneFgs.length == 0) {
                    throw new ErrorResponse(0, `No pending qty found / no inventory is issued for the barcode : ${barcode} op group : ${currOpGroup} and operation : INPUT `);
                }
                currOpInputNotDoneFgs.map(r => finalFgsCanBeScanned.add(r.fgNumber));
                // iterate all the pre op groups and check if the operation is already done for the last operation.
                // NOTE: If this is a immediate operation after knit bundling, then the pre op groups will be empty. We hae to go by inventory allocation method
                for (const preOpGroup of preOpGroupsExcludingKnit) {
                    // check for how many FGs the last operation is already done
                    const preOpGroupCompFgs = await this.fgOpDepRepo.find({ select: ['fgNumber'], where: { oslId: pslId, fgNumber: In([...finalFgsCanBeScanned]), opCompleted: true, rFromInv: true, opGroup: preOpGroup, opCode: FixedOpCodeEnum.OUT, isRejected: false }, order: { fgNumber: 'ASC' } });
                    if (preOpGroupCompFgs.length == 0) {
                        throw new ErrorResponse(0, `0 quantity is found from the last operation of the dependent op group: ${preOpGroup}. psl id : ${pslId}. Fgs: ${[...finalFgsCanBeScanned].toString()}`);
                    }
                    // Clear the set here and re add the filtered fgs whose pre op group is done. So at last we will be only left out with the FGs completed for the further verification
                    finalFgsCanBeScanned.clear();
                    preOpGroupCompFgs.forEach(r => finalFgsCanBeScanned.add(r.fgNumber));
                }
                if (finalFgsCanBeScanned.size == 0) {
                    throw new ErrorResponse(0, `0 common quantity found from the all the last operations of the dependent op groups: ${[...preOpGroupsExcludingKnit].toString()} psl id : ${pslId}`);
                }
                // If there's a bundle scan operation being done with partial receiving, we will fail this if the force reporting is not selected
                console.log('************************************************');
                const currJobRec = await this.getJobNumberForBundleAndProcType(barcode, procType, opRec.subProcName, pslId, companyCode, unitCode);
                currProcSerial = fgsForBun.procSerial;
                currJob = currJobRec.job;
                currOpType = FixedOpCodeEnum.IN;
                refPreOpGroups = [...preOpGroupsExcludingKnit];
            }
            if (!currJob) {
                throw new ErrorResponse(0, `The job associated with this bundle : ${barcode} was not properly created in PTS. Please contact support team`);
            }
            if (finalFgsCanBeScanned.size < finalQtyToScan) {
                if (!forceReportPartial) {
                    throw new ErrorResponse(0, `Bundle quantity is : ${fgsForBun.fgs.length}. Asking to report : ${finalQtyToScan}. But only ${finalFgsCanBeScanned.size} quantity found from the all the last operations of the dependent op groups: ${refPreOpGroups.toString()} psl id : ${pslId}`);
                }
            }
            // now finally split the finalFgsCanBeScanned based on incoming scan qty
            const splittedFgs = Array.from(finalFgsCanBeScanned).splice(0, finalQtyToScan);
            const FINALIZED_AVL_QTY = splittedFgs.length;
            // now distribute the splitted FGs into the good and rejection parts
            let goodFgs = [];
            let rejectedFgs = [];
            if (currOpType == FixedOpCodeEnum.IN) {
                goodFgs = splittedFgs;
            } else {
                goodFgs = splittedFgs.splice(0, splittedFgs.length - (rejQty ?? 0));
                rejectedFgs = splittedFgs;
            }
            if (goodFgs.length + rejectedFgs.length > FINALIZED_AVL_QTY) {
                throw new ErrorResponse(0, `Avl qty is only : ${FINALIZED_AVL_QTY}, Trying to report GOOD : ${goodFgs.length}, REJ: ${rejectedFgs.length}`);
            }
            // common updates
            const tranLogEnt = new BundleTransEntity();
            tranLogEnt.companyCode = companyCode;
            tranLogEnt.unitCode = unitCode;
            tranLogEnt.procSerial = currProcSerial;
            tranLogEnt.opCode = currOpType;
            tranLogEnt.opGroup = currOpGroup;
            tranLogEnt.opGroupOrder = opRec.opGroupOrder;
            tranLogEnt.operatorId = operatorId;
            tranLogEnt.createdUser = username;
            tranLogEnt.randomOp = opCode;
            tranLogEnt.bundleBarcode = barcode;
            tranLogEnt.gQty = goodFgs.length;
            tranLogEnt.rQty = rejectedFgs.length;
            tranLogEnt.scannedAt = scannedDate;
            tranLogEnt.shift = shift;
            tranLogEnt.procType = procType;
            tranLogEnt.currJob = currJob;
            tranLogEnt.locationCode = locationCode;
            tranLogEnt.pslId = pslId;
            tranLogEnt.opgId = opRec.id;
            
            const tranLogFgs: TranLogFgEntity[] = [];
            await transManager.startTransaction();
            const savedTran = await transManager.getRepository(BundleTransEntity).save(tranLogEnt);
            goodFgs.forEach(r => {
                const m1 = new TranLogFgEntity();
                m1.tranLogId = savedTran.id;
                m1.fgNumber = r;
                tranLogFgs.push(m1);
            });
            rejectedFgs.forEach(r => {
                const m1 = new TranLogFgEntity();
                m1.tranLogId = savedTran.id;
                m1.fgNumber = r;
                m1.isRej = true;
                tranLogFgs.push(m1);
            });
            const operatorActEnt = new OperatorActivityEntity();
            operatorActEnt.companyCode = companyCode;
            operatorActEnt.unitCode = unitCode;
            operatorActEnt.createdUser = username;
            operatorActEnt.operatorId = operatorId;
            operatorActEnt.bundleBarcode = barcode;
            operatorActEnt.tranLogId = savedTran.id;
            operatorActEnt.opCode = currOpType;
            operatorActEnt.operatorId = operatorId;
            await transManager.getRepository(OperatorActivityEntity).save(operatorActEnt, { reload: false });
            await this.opPublishService.saveTranLogPublishRecord(savedTran.id, PtsExtSystemNamesEnum.SPS, companyCode, unitCode, transManager);
            if(opRec.nextOpGroups?.includes(ProcessTypeEnum.PACK)) {
                await this.opPublishService.saveTranLogPublishRecord(savedTran.id, PtsExtSystemNamesEnum.PKMS, companyCode, unitCode, transManager);
            }
            await transManager.getRepository(TranLogFgEntity).save(tranLogFgs, {reload: false});
            if(goodFgs.length > 0) {
                await transManager.getRepository(FgOpDepEntity).update({oslId: pslId, opGroup: currOpGroup, procSerial: currProcSerial, opCode: currOpType, procType: procType, fgNumber: In(goodFgs) }, {opCompleted: true});
            }
            if(rejectedFgs.length > 0) {
                await transManager.getRepository(FgOpDepEntity).update({oslId: pslId, opGroup: currOpGroup, procSerial: currProcSerial, opCode: currOpType, procType: procType, fgNumber: In(rejectedFgs) }, {opCompleted: true, isRejected: true});
            }
            await transManager.completeTransaction();
            // send an API call to SPS the tran id.
            // await this.repHelperService.sendTranIdRefToSps( [savedTran.id], companyCode, unitCode, username);
            const m2 = new PTS_R_BundleScanModel(barcode, opRec.opGroup, opCode, currOpType, goodFgs.length, rejectedFgs.length, opRec.procType, JobBarcodeTypeEnum.JOB_BUNDLE);
            return new PTS_R_BundleScanResponse(true, 0, `${operationString} for Bundle : ${barcode} is having WIP - ${finalFgsCanBeScanned.size} pieces. GOOD : ${goodFgs.length} REJ : ${rejectedFgs.length} Sub Process : ${currOpGroup}`, m2);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    async reportBundleReversalForAnOp(req: PTS_C_BundleReversalRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, barcode, opCode } = req;
            const randomFgForBundleInfo = await this.getRandomFgAndPslIdForBundle(barcode, companyCode, unitCode, true);
            const pslId = randomFgForBundleInfo.pslId;
            // using this PSL id get the props
            const oslProps = await this.repHelperService.getPslPropsForPslId(pslId, companyCode, unitCode);
            console.log('1');
            const opRec = await this.repHelperService.getOpGroupRecForMoProdColorOp(companyCode, unitCode, oslProps.moNo, oslProps.productCode, oslProps.color, opCode);
            console.log('2');
            const currOpGroup = opRec.opGroup;
            const procType = opRec.procType;
            const nextOpGroups = opRec.nextOpGroups?.split(',');
            if (nextOpGroups.length == 0) {
                throw new ErrorResponse(0, `Post op groups not found for the current op group : ${currOpGroup} and processing type : ${procType}`);
            }
            // get the tran log record from the bundle trans
            const tranRec = await this.bunTranLogRepo.findOne({where: { companyCode, unitCode, bundleBarcode: barcode, opGroup: currOpGroup }, order: {createdAt: 'DESC'}});
            if(!tranRec) {
                throw new ErrorResponse(0, `Bundle record not found in tran log for the barcode : ${barcode} and op group : ${currOpGroup}`);
            }
            const fgsForBun = await this.getFgNumbersForBundleAndProcType(barcode, procType, companyCode, unitCode, true);
            if (fgsForBun.fgs.length == 0) {
                throw new ErrorResponse(0, `Bundle is not mapped to any Garments. Please contact support team`);
            }
            // check if the bundle is output / input operation for reversal
            if(tranRec.opCode == FixedOpCodeEnum.OUT) {
                // check for next op validations
                for(const opg of nextOpGroups) {
                }
            }
            // check if next ops are been scanned for the bundle fgs

            return new GlobalResponseObject(true, 0, 'Bundle : ${} reversal done for pieces');
        } catch (error) {
            throw error;
        }
    }

    async getFgNumbersForBundleAndProcType(barcode: string, processType: ProcessTypeEnum, companyCode: string, unitCode: string, isActual: boolean): Promise<{ fgs: number[], procSerial: number }> {
        const fgRecs = isActual ? await this.fgBundleRepo.find({ select: ['fgNumber', 'procSerial'], where: { abBarcode: barcode, procType: processType } }) :await this.fgBundleRepo.find({ select: ['fgNumber', 'procSerial'], where: { bundleBarcode: barcode, procType: processType } });
        const fgs = fgRecs.map(r => r.fgNumber);
        return { fgs: fgs, procSerial: fgRecs[0].procSerial };
    }

    async getRandomFgAndPslIdForBundle(barcode: string, companyCode: string, unitCode: string, isActual: boolean): Promise<{ fg: number, pslId: number }> {
        const fg = isActual ? await this.fgBundleRepo.findOne({ select: ['fgNumber', 'oslId'], where: { abBarcode: barcode } }) : await this.fgBundleRepo.findOne({ select: ['fgNumber', 'oslId'], where: { bundleBarcode: barcode } });
        if (!fg) {
            throw new ErrorResponse(0, `Bundle info not found for the barcode : ${barcode}`);
        }
        return { fg: fg?.fgNumber, pslId: fg?.oslId };
    }

    async getJobNumberForBundleAndProcType(barcode: string, processType: ProcessTypeEnum, subProcName: string, pslId: number, companyCode: string, unitCode: string): Promise<{ job: string }> {
        const moBundleRec = await this.moActBundleSProcRepo.findOne({ select: ['jobNumber'], where: { abBarcode: barcode, procType: processType, subProc: subProcName, pslId: pslId } });
        console.log(moBundleRec);
        if (!moBundleRec) {
            throw new ErrorResponse(0, `Job number for the Bundle ${barcode} was not found in PTS`);
        }
        return { job: moBundleRec.jobNumber };
    }

    //
    async logQualityReporting(req: PTS_C_QmsInspectionLogRequest): Promise<GlobalResponseObject> {
        const qmsTransEntityArr: QMSTransLogEntity[] = []
        for (const eachRec of req.reasonQtys) {
            const qmsTransEntity = new QMSTransLogEntity()
            qmsTransEntity.companyCode = req.companyCode;
            qmsTransEntity.unitCode = req.unitCode;
            qmsTransEntity.createdUser = req.username;
            qmsTransEntity.dateTime = req.dateTime;
            qmsTransEntity.qualityType = req.qualityType;
            qmsTransEntity.reason = eachRec.reason;
            qmsTransEntity.quantity = eachRec.quantity;
            qmsTransEntity.inspectorName = req.inspectorName;
            qmsTransEntity.qualityReason = req.qualityReason;
            qmsTransEntity.barcode = req.barcode
            qmsTransEntity.barcodeLevel = req.barcodeLevel;
            qmsTransEntity.locationCode = req.locationCode;
            qmsTransEntity.operationCode = req.opCode;
            qmsTransEntity.processType = req.processType;
            qmsTransEntityArr.push(qmsTransEntity);
        }
        await this.qmsTransLogRepo.save(qmsTransEntityArr);
        return new GlobalResponseObject(true, 1, 'Quality reporting logged successfully',);
    }

    async getQualityInfoForGivenLocationCode(req:P_LocationCodeRequest):Promise<IpsBarcodeDetailsForQualityResultsResponse>{
        const { companyCode, unitCode, locationCode } = req;
        const qmsTransLogRes = await this.qmsTransLogRepo.find({where:{companyCode,unitCode,locationCode:In(locationCode)}})
        if(qmsTransLogRes.length === 0){
            return new IpsBarcodeDetailsForQualityResultsResponse(true,1,"No Quality checks found for give location : "+req.locationCode.join(","),[])
        }
        const ipsBarcodeQualityResultsArr:IpsBarcodeQualityResultsModel[] = []
        for(const eachRec of qmsTransLogRes ){
            const obj = new IpsBarcodeQualityResultsModel(eachRec.locationCode,eachRec.barcode,eachRec.barcodeLevel,eachRec.operationCode,eachRec.processType,eachRec.quantity,"")
            ipsBarcodeQualityResultsArr.push(obj)
        }
        return new IpsBarcodeDetailsForQualityResultsResponse(true, 1, "Quality checks found", ipsBarcodeQualityResultsArr)
    }

}

