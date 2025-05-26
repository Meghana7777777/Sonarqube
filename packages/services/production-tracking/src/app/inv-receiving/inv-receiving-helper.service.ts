import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, INV_C_InvOutAllocIdRequest, INV_R_InvOutAllocationInfoAndBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesModel } from "@xpparel/shared-models";

import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgEntity } from "../entity/fg.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { DataSource, In, Not } from "typeorm";
import { InvReceivingRepository } from "../entity/repository/inv-receiving.repository";
import { Injectable } from "@nestjs/common";
import { InvIssuanceService } from "@xpparel/shared-services";

@Injectable()
export class InvReceivingHelperService {

    constructor(
        private dataSource: DataSource,
        private fgRepo: FgRepository,
        private fgOpDepRepo: FgOpDepRepository,
        private oslRepo: OslInfoRepository,
        private invReceivingRepo: InvReceivingRepository,
        private invIssuanceExtService: InvIssuanceService
    ) {
        
    }

    async getBundlesIssuedForAnAllocationIdFromInvSystem(req: INV_C_InvOutAllocIdRequest): Promise<INV_R_InvOutAllocationInfoAndBundlesModel> {
        // getAllocatedInventoryForAllocationId
        const res: INV_R_InvOutAllocationInfoAndBundlesResponse = await this.invIssuanceExtService.getAllocatedInventoryForAllocationId(req);
        if(!res.status) {
            throw new ErrorResponse(0, `INS says : ${res.internalMessage}`);
        }
        return res?.data[0];
    }
}



