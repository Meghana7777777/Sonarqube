import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, INV_C_InvOutAllocIdRequest, INV_R_InvOutAllocationInfoAndBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesModel, PTS_C_TranLogIdRequest, PKMS_C_ReadyToPackFgsRequest } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { DataSource, In, Not } from "typeorm";
import { InvReceivingRepository } from "../entity/repository/inv-receiving.repository";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { Injectable } from "@nestjs/common";
import { OpSequenceRefRepository } from "../entity/repository/op-sequence-ref.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { OpSequenceOpgEntity } from "../entity/op-sequence-opg.entity";
import { OpSequenceOpsRepository } from "../entity/repository/op-sequence-ops.repository";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { PreIntegrationServicePKMS, ProcessingJobsService, SewingJobGenMOService } from "@xpparel/shared-services";

@Injectable()
export class OpReportingHelperService {

    constructor(
        private oslRepo: OslInfoRepository,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private opSeqRefRepo: OpSequenceRefRepository,
        private opSeqOpsRepo: OpSequenceOpsRepository,
        private fgBundleRepo: FgBundleRepository,
        private spsRepService: ProcessingJobsService,
        private pkmsService: PreIntegrationServicePKMS
    ) {
        
    }

    async getPslPropsForPslId(pslId: number, companyCode: string, unitCode: string): Promise<OslInfoEntity> {
        return await this.oslRepo.findOne({where: {companyCode: companyCode, unitCode: unitCode, oslId: pslId}});
    }

    async randomFgNumberForBundleBarcode(barcodeNumber: string, isActual: boolean): Promise<number> {
        const fgBunRec = isActual ? await this.fgBundleRepo.findOne({select: ['fgNumber', 'oslId'], where: {abBarcode: barcodeNumber}}) : await this.fgBundleRepo.findOne({select: ['fgNumber', 'oslId'], where: {bundleBarcode: barcodeNumber}});
        const randomFg = fgBunRec?.fgNumber;
        return randomFg;
    }

    async getOpSeqRefIdForMoProdColor(companyCode: string, unitCode: string, moNo: string, prodCode: string, fgColor: string): Promise<number> {
        const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNo, fgColor: fgColor, prodCode: prodCode }});
        if(!refRec) {
            throw new ErrorResponse(0, `Op sequence ref record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        return refRec.id;
    }


    async getOpGroupRecForMoProdColorOp(companyCode: string, unitCode: string, moNo: string, prodCode: string, fgColor: string, opCode: string): Promise<OpSequenceOpgEntity> {
        const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNo, fgColor: fgColor, prodCode: prodCode }});
        if(!refRec) {
            throw new ErrorResponse(0, `Op sequence ref record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        const opSeqRefId = refRec.id;
        const opCodeRec = await this.opSeqOpsRepo.findOne({select: ['opGroup'], where: {companyCode, unitCode, opSeqRefId: opSeqRefId, opCode: opCode}});
        if(!refRec) {
            throw new ErrorResponse(0, `Operation : ${opCode} record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        // now get the op group for the op code based on the mo number and the product code and color
        const opRec = await this.opSeqOpgRepo.findOne({select: ['id', 'opGroup', 'procType', 'preOpGroups', 'opGroupOrder', 'opSeqRefId', 'spFgSku', 'pFgSku', 'subProcName', 'nextOpGroups'], where: { companyCode: companyCode, unitCode: unitCode, opGroup: opCodeRec.opGroup, moNo, opSeqRefId: opSeqRefId }});
        return opRec;
    }

    async getOpGroupRecsForMoProdColor(companyCode: string, unitCode: string, moNo: string, prodCode: string, fgColor: string, procTypes: ProcessTypeEnum[]): Promise<OpSequenceOpgEntity[]> {
        const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNo, fgColor: fgColor, prodCode: prodCode }});
        if(!refRec) {
            throw new ErrorResponse(0, `Op sequence ref record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        const opSeqRefId = refRec.id;
        let opgRecs: OpSequenceOpgEntity[] = [];
        if(procTypes.length > 0) {
            opgRecs = await this.opSeqOpgRepo.find({select: ['opGroup', 'procType', 'preOpGroups', 'opGroupOrder', 'opSeqRefId', 'spFgSku', 'pFgSku', 'opCodes', 'routingGroup'], where: { companyCode: companyCode, unitCode: unitCode, opSeqRefId: opSeqRefId, procType: In(procTypes) }});
        } else {
            opgRecs = await this.opSeqOpgRepo.find({select: ['opGroup', 'procType', 'preOpGroups', 'opGroupOrder', 'opSeqRefId', 'spFgSku', 'pFgSku', 'opCodes', 'routingGroup'], where: { companyCode: companyCode, unitCode: unitCode, opSeqRefId: opSeqRefId }});
        }
        return opgRecs;
    }

    async getOpGroupRecsForMoProdColorAndRg(companyCode: string, unitCode: string, moNo: string, prodCode: string, fgColor: string, rg: string): Promise<OpSequenceOpgEntity[]> {
        const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNo, fgColor: fgColor, prodCode: prodCode }});
        if(!refRec) {
            throw new ErrorResponse(0, `Op sequence ref record not found for mo : ${moNo} , product : ${prodCode} and color : ${fgColor}`);
        }
        const opSeqRefId = refRec.id;
        let opgRecs: OpSequenceOpgEntity[] = [];
        opgRecs = await this.opSeqOpgRepo.find({select: ['opGroup', 'procType', 'preOpGroups', 'opGroupOrder', 'opSeqRefId', 'spFgSku', 'pFgSku', 'opCodes', 'routingGroup'], where: { companyCode: companyCode, unitCode: unitCode, opSeqRefId: opSeqRefId, routingGroup: rg }});
        return opgRecs;
    }

    // This function needs the try catch block as if theres an exception in the API call, the accurate return response will be mis interpreted during barcode scanning
    async sendTranIdRefToSps(tranIds: number[], companyCode: string, unitCode: string, username: string): Promise<boolean> {
        try {
            const m1 = new PTS_C_TranLogIdRequest(username, unitCode, companyCode, 0, tranIds);
            await this.spsRepService.updateJobRepQtysByTransId(m1);
            return true;
        } catch (err) {
            return false;
        }
    }

    async sendTranIdFgsToPkms(tranId: number, fgs: number[], pslId: number, companyCode: string, unitCode: string, username: string): Promise<boolean> {
        try {
            const m1 = new PKMS_C_ReadyToPackFgsRequest(username, unitCode, companyCode, 0, tranId, fgs, pslId);
            await this.pkmsService.logReadyToPackFgs(m1);
            return true;
        } catch (err) {
            return false;
        }
    }
}



