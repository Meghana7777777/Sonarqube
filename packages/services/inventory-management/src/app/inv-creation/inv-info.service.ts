import { INV_C_AvlBundlesForPslRequest, INV_R_ArrangedAvlBundlesForPslModel, INV_R_AvlBundlesForPslModel, INV_R_AvlBundlesForPslResponse } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { InvInHelperService } from "./inv-in-helper.service";
import { InvInRequestItemRepository } from "../entity/repository/inv-in-request-item.repository";
import { InvInRequestRepository } from "../entity/repository/inv-in-request.repository";
import { InvInRequestBundleRepository } from "../entity/repository/inv-in-request-bundle.repository";
import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BundleConsumptionStatusEnum } from "../entity/inv.in.request.bundle.entity";

@Injectable()
export class InvInfoService {

    constructor(
        private dataSource: DataSource,
        private inHelperService: InvInHelperService,
        private invInReqRepo: InvInRequestRepository,
        private invInReqLine: InvInRequestItemRepository,
        private invInReqBarcode: InvInRequestBundleRepository
    ) {
        
    }

    async getAvailableBundlesInvForPslIds(req: INV_C_AvlBundlesForPslRequest): Promise<INV_R_AvlBundlesForPslResponse> {
        const { companyCode, unitCode, requiredPslQtys, procSerial, procType } = req
        if(requiredPslQtys.length == 0) {
            throw new ErrorResponse(0, 'Required PSL quantities not provided');
        }
        const m2s: INV_R_ArrangedAvlBundlesForPslModel[] = [];
        for(const r of requiredPslQtys) {
            const pslId = r.pslId;
            let askingQty = r.askingQty;
            const fgSku = r.fgSku;
            // get the available bundles in inventory for the fg SKU and the PSL id
            const bundles = await this.invInReqBarcode.find({select: ['bundleBarcode', 'inQty', 'orgQty'], where: {companyCode, unitCode, pslId: pslId, itemSku: fgSku, bundleState: BundleConsumptionStatusEnum.OPEN, processType: procType, processingSerial: procSerial }, order: {inQty: 'ASC'}});
            if(bundles.length <= 0) {
                // move to next pslId
                continue;
            }
            
            let arrangedQty = 0;
            const m1s: INV_R_AvlBundlesForPslModel[] = [];
            bundles.forEach(b => {
                b.inQty = Number(b.inQty); // cast to number
                const minQty = Math.min(askingQty, b.inQty);
                if(askingQty >= b.inQty) {
                    const m1 = new INV_R_AvlBundlesForPslModel(b.bundleBarcode, b.inQty);
                    m1s.push(m1);
                    askingQty -=  b.inQty;
                    arrangedQty += b.inQty;
                };
            });
            const m2 = new INV_R_ArrangedAvlBundlesForPslModel(pslId, m1s, r.askingQty, arrangedQty);
            m2s.push(m2);
        }
        return new INV_R_AvlBundlesForPslResponse(true, 0, 'Available bundles retrieved', m2s);
    }
    
    
}

