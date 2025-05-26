import { SI_MoNumberRequest, SI_MoLineInfoModel, PO_C_PoSerialPslIdsRequest, MO_R_OslBundlesModel } from "@xpparel/shared-models";
import { CutOrderService, OrderCreationService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PslHelperService {

    constructor(
       private omsMoInfoService: OrderCreationService,
        private oesPoService: CutOrderService,
    ) {
        
    }

    async getPslBundlesForPoSerial(poSerial: number,  companyCode: string, unitCode: string): Promise<MO_R_OslBundlesModel[]> {
        const m1 = new PO_C_PoSerialPslIdsRequest(null, unitCode, companyCode, 0, poSerial, []);
        const res = await this.oesPoService.getPslBundlesForPoSerial(m1);
        if(!res.status) {
          throw new ErrorResponse(0, `OES Says : ${res.internalMessage}`);
        }
        if(!res.data[0]) {
          throw new ErrorResponse(0, `Bundles does not exist for the po serial : ${poSerial}`);
        }
        return res.data[0].bundles;
    }

      
    async getOslPropsForMoNumber(moNo: string, companyCode: string, unitCode: string): Promise<SI_MoLineInfoModel[]>{
        const req = new SI_MoNumberRequest(null, companyCode, unitCode, 0, moNo, 0, false, false, true, false, true, false, false, false, false, true, true);
        const moInfoRes = await this.omsMoInfoService.getOrderInfoByManufacturingOrderNo(req);
        if(!moInfoRes.status) {
            throw new ErrorResponse(0, `Oms says : ${moInfoRes.internalMessage}`)
        }
        const lineInfo: SI_MoLineInfoModel[] = [];
        moInfoRes.data.forEach(r => {
            r.moLineModel.forEach(l => {
                lineInfo.push(l);
            })
        });
        if(lineInfo.length == 0) {
            throw new ErrorResponse(0, `No product sub lines are received from the OMS for the payload : ${JSON.stringify(req)} `);
        }
        return lineInfo;
    }
}

