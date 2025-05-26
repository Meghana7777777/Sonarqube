import { GlobalResponseObject, PKMS_C_ReadyToPackFgsRequest, PKMSFgConsumptionStatus, PTS_C_TranLogIdPublishAckRequest, PtsExtSystemNamesEnum, SI_MoNumberRequest } from "@xpparel/shared-models";

import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { OpReportingService, OrderCreationService } from "@xpparel/shared-services";
import moment from 'moment';
import { In } from "typeorm";
import { FgEntity } from "./entities/fg.entity";
import { OslInfoEntity } from "./entities/osl-info.entity";
import { FgRepository } from "./repositories/fg.repository";
import { OslInfoRepository } from "./repositories/osl-info.repository";
@Injectable()
export class PKMSFgCreationService {

    constructor(
        private fgRepo: FgRepository,
        private oslRepo: OslInfoRepository,
        private omsMoInfoService: OrderCreationService,
        private ptsService: OpReportingService
    ) {

    }

    // Called after MO confirmation in OMS
    // Tested
    // ENDPOINT
    // Called after the MO confirmation in OMS
    async createOslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const oslRecForMo = await this.oslRepo.findOne({ select: ['oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber } });
            if (oslRecForMo) {
                throw new ErrorResponse(0, `OSLs already created for the MO number : ${req.moNumber}`);
            }
            const omsReq = new SI_MoNumberRequest(null, companyCode, unitCode, 0, req.moNumber, 0, false, false, true, false, true, false, false, false, false, true, true);
            const moInfoRes = await this.omsMoInfoService.getOrderInfoByManufacturingOrderNo(omsReq);
            if (!moInfoRes.status) {
                throw new ErrorResponse(0, `Oms says : ${moInfoRes.internalMessage}`)
            }
            const oslEnts: OslInfoEntity[] = [];
            moInfoRes.data.forEach(r => {
                r.moLineModel.forEach(l => {
                    l.moLineProducts.forEach(s => {
                        s.subLines.forEach(r => {
                            const oslInfo = r.moProdSubLineAttrs;
                            const oslInfoEnt = new OslInfoEntity();
                            oslInfoEnt.createdUser = username;
                            oslInfoEnt.buyerPo = oslInfo.buyerPo;
                            oslInfoEnt.co = oslInfo.co;
                            oslInfoEnt.color = r.color;
                            oslInfoEnt.companyCode = req.companyCode;
                            oslInfoEnt.unitCode = req.unitCode;
                            oslInfoEnt.delDate = moment(oslInfo.delDate).format('YYYY-MM-DD');
                            oslInfoEnt.destination = oslInfo.destination;
                            oslInfoEnt.refNumber = oslInfo.refNo;
                            oslInfoEnt.oqType = r.oqType;
                            oslInfoEnt.oslId = r.pk;
                            oslInfoEnt.pcd = oslInfo.pcd;
                            oslInfoEnt.productName = oslInfo.prodName;
                            oslInfoEnt.productCode = oslInfo.prodName;
                            oslInfoEnt.size = r.size;
                            oslInfoEnt.moLineNo = l.moLineNo;
                            oslInfoEnt.moNo = moNumber;
                            oslInfoEnt.style = oslInfo.style;
                            oslInfoEnt.vpo = oslInfo.vpo;
                            oslInfoEnt.quantity = oslInfo.qty;
                            oslEnts.push(oslInfoEnt);
                        });
                    });
                });
            });
            await this.oslRepo.createQueryBuilder().insert().values(oslEnts).updateEntity(false).execute();
            return new GlobalResponseObject(true, 0, 'OSL info for the saved successfully');
        } catch (error) {
            throw error;
        }
    }

    // Called after MO de confirmation in OMS
    // Tested
    // ENDPOINT
    // called after the MO deletion in OMS
    async deleteOslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username } = req;
            if (!req.moNumber) {
                throw new ErrorResponse(0, 'Mo number is not provided');
            }
            const oslInfoRecs = await this.oslRepo.find({ select: ['id', 'oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber } });
            if (oslInfoRecs.length == 0) {
                throw new ErrorResponse(0, `No osl refs found for the MO : ${req.moNumber}`);
            }
            const pslIds = oslInfoRecs.map(r => r.oslId);
            // pre validations to be in place
            await this.oslRepo.delete({ companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber });
            // delete all the other tables as well
            await this.fgRepo.delete({ oslId: In(pslIds) });
            return new GlobalResponseObject(true, 0, 'OSL info deleted for the MO');
        } catch (error) {
            throw error;
        }
    }

    async logReadyToPackFgs(req: PKMS_C_ReadyToPackFgsRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const oslRec = await this.oslRepo.findOne({ select: ['moLineNo', 'moNo', 'color', 'productCode', 'oqType'], where: { companyCode: companyCode, unitCode: unitCode, oslId: req.pslId } });
        if (!oslRec) {
            throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.pslId}`);
        }
        const countFgs = await this.fgRepo.count({ where: { tranId: req.tranId } });
        if (countFgs) {
            throw new ErrorResponse(956, 'Fgs already saved with given transaction id')
        }
        const fgEnts: FgEntity[] = [];
        for (const fg of req.fgs) {
            const fgEnt = new FgEntity();
            fgEnt.fgNumber = fg;
            fgEnt.oslId = req.pslId;
            fgEnt.tranId = req.tranId;
            fgEnt.fgBarcode = String(req.tranId);
            fgEnt.fgConsumptionStatus = PKMSFgConsumptionStatus.open;
            fgEnts.push(fgEnt);
        }
        await this.fgRepo.save(fgEnts, { reload: false });
        const m1 = new PTS_C_TranLogIdPublishAckRequest(username, unitCode, companyCode, 0, [req.tranId], PtsExtSystemNamesEnum.PKMS);
        await this.ptsService.updateExtSystemAckStatusForTranLogId(m1);
        return new GlobalResponseObject(true, 0, `FGs created for the osl id : ${req.pslId}.`);
    }

}



