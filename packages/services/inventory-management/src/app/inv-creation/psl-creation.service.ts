import { GlobalResponseObject, KMS_C_KnitOrderBundlingConfirmationIdRequest, ProcessTypeEnum, SI_MoNumberRequest } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { InvInHelperService } from "./inv-in-helper.service";
import { InvInRequestItemRepository } from "../entity/repository/inv-in-request-item.repository";
import { InvInRequestRepository } from "../entity/repository/inv-in-request.repository";
import { InvInRequestBundleRepository } from "../entity/repository/inv-in-request-bundle.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { InvInRequestEntity, InvInRequestStatus } from "../entity/inv.in.request.entity";
import { InvInRequestItemEntity } from "../entity/inv.in.request.item.entity";
import { InvBarcodeLevelEnum, InvInRequestBundleEntity } from "../entity/inv.in.request.bundle.entity";
import { PslInfoRepository } from "../entity/repository/psl-info.repository";
import { PslInfoEntity } from "../entity/psl-info.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PslCreationService {

    constructor(
        private dataSource: DataSource,
        private helperService: InvInHelperService,
        private invInReqRepo: InvInRequestRepository,
        private invInReqLine: InvInRequestItemRepository,
        private invInReqBarcode: InvInRequestBundleRepository,
        private pslRepo: PslInfoRepository,

    ) {
        
    }
    
// {
//   "username": "admin",
//   "unitCode": "NORLANKA",
//   "companyCode": "NORLANKA",
//   "moNumber": "ML0001",
//   "iNeedMoSubLines": true
// }

    // End Point
    // Called after the MO confirmation in OMS
    async createPslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const oslRecForMo = await this.pslRepo.findOne({select: ['pslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: moNumber}});
            console.log(oslRecForMo);
            if(oslRecForMo) {
                throw new ErrorResponse(0, `PSLs already created for the MO number : ${req.moNumber}`);
            }
            const lines = await this.helperService.getPslPropsForMoNumber(req.moNumber, companyCode, unitCode);
            const pslEnts: PslInfoEntity[] = [];
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
                        oslInfoEnt.delDate = oslInfo.delDate;
                        oslInfoEnt.destination = oslInfo.destination;
                        oslInfoEnt.refNumber = oslInfo.refNo;
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
                        pslEnts.push(oslInfoEnt);
                    });
                });
            })
            
            await this.pslRepo.insert(pslEnts);
            return new GlobalResponseObject(true, 0, 'PSL info for the saved successfully')
        } catch (error) {
            throw error;
        }
    }
    // End Point    
    // called after the MO deletion in OMS
    async deletePslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const oslInfoRecs = await this.pslRepo.find({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, moNo: moNumber }});
            if(oslInfoRecs.length == 0) {
                throw new ErrorResponse(0, `No psl refs found for the MO : ${req.moNumber}`);
            }
            // pre validations to be in place
            await this.pslRepo.delete({ companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber });
            return new GlobalResponseObject(true, 0, 'PSL info deleted for the MO');
        } catch (error) {
            throw error;
        }
    }

}



