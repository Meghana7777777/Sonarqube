import { GlobalResponseObject, SI_MoNumberRequest } from "@xpparel/shared-models";
import { PslHelperService } from "./psl-helper.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import  moment from 'moment';
import { PslInfoRepository } from "../common/repository/psl-info.repository";
import { PslInfoEntity } from "../common/entity/psl-info.entity";

@Injectable()
export class PslService {

    constructor(
        private datasource: DataSource,
        private pslHelperService: PslHelperService,
        private oslRepo: PslInfoRepository
    ) {
        
    }

    // Called after MO confirmation in OMS
    // Tested
    // ENDPOINT
    // Called after the MO confirmation in OMS
    async createOslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const oslRecForMo = await this.oslRepo.findOne({select: ['pslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber}});
            if(oslRecForMo) {
                throw new ErrorResponse(0, `OSLs already created for the MO number : ${req.moNumber}`);
            }
            const lines = await this.pslHelperService.getOslPropsForMoNumber(req.moNumber, companyCode, unitCode);
            const oslEnts: PslInfoEntity[] = [];
            let fgNo = 0;
            lines.forEach(l => {
                l.moLineProducts.forEach(s => {
                    s.subLines.forEach(r => {
                        const oslInfo = r.moProdSubLineAttrs;
                        const oslInfoEnt = new PslInfoEntity();
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
                        oslInfoEnt.pslId = r.pk;
                        oslInfoEnt.pcd = oslInfo.pcd;
                        oslInfoEnt.productName = oslInfo.prodName;
                        oslInfoEnt.productCode = oslInfo.prodName;
                        oslInfoEnt.size = r.size;
                        oslInfoEnt.moLineNo = l.moLineNo;
                        oslInfoEnt.moNo = moNumber;
                        oslInfoEnt.style = oslInfo.style;
                        oslInfoEnt.vpo = oslInfo.vpo;
                        oslInfoEnt.quantity = oslInfo.qty;
                        oslInfoEnt.fgStartNo = fgNo+1;
                        fgNo += Number(oslInfo.qty);
                        oslInfoEnt.fgEndNo = fgNo;
                        oslEnts.push(oslInfoEnt);
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
            if(!req.moNumber) {
                throw new ErrorResponse(0, 'Mo number is not provided');
            }
            const oslInfoRecs = await this.oslRepo.find({select: ['id', 'pslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber }});
            if(oslInfoRecs.length == 0) {
                throw new ErrorResponse(0, `No osl refs found for the MO : ${req.moNumber}`);
            }
            const pslIds = oslInfoRecs.map(r => r.pslId);
            // pre validations to be in place
            await this.oslRepo.delete({ companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber });
            return new GlobalResponseObject(true, 0, 'OSL info deleted for the MO');
        } catch (error) {
            throw error;
        }
    }

    
}



