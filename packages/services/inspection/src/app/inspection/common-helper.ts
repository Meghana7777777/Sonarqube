import { InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsPhIdRequest } from "@xpparel/shared-models";

import { InspectionHelperService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsRequestEntity } from "../entities/ins-request.entity";

@Injectable()
export class InsCommonHelPerSedrvice {
     constructor(
            private dataSource: DataSource,
            private inspectionHelperService: InspectionHelperService,
        ) { }
    async checkAndUpdateInventory(manager: GenericTransactionManager, phId: string, userName: string, unitCode: string, companyCode: string
    ) {
        const completed = await manager.getRepository(InsRequestEntity).find({ where: { refIdL1: phId } });
        const allPass = completed.every(item => item.finalInspectionStatus == InsInspectionFinalInSpectionStatusEnum.PASS && item.insActivityStatus == InsInspectionActivityStatusEnum.COMPLETED);
        if (allPass) {
            const phidReq = new InsPhIdRequest(userName, unitCode, companyCode, 0, [phId]);
            await this.inspectionHelperService.updateShowInInventory(phidReq);
        }
    }
}