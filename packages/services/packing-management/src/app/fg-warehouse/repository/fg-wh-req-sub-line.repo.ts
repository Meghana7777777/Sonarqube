import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import {  FgWhReqSubLinesEntity } from "../entity/fg-wh-req-sub-lines.entity";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";

@Injectable()
export class FgWhReqSubLineRepo extends BaseAbstractRepository<FgWhReqSubLinesEntity> {
    constructor(
        @InjectRepository(FgWhReqSubLinesEntity)
        private readonly subEntity: Repository<FgWhReqSubLinesEntity>
    ) {
        super(subEntity);
    }


    async getStatusWiseCartonCount(whReqLineId: number, unitCode: string, companyCode: string): Promise<{
        cartonCount: number;
        status: FgWhRequestStatusEnum
    }[]> {
        return await this.subEntity.createQueryBuilder('wh_req_sub_line')
            .select('COUNT(1) as cartonCount, status')
            .where(`fg_wh_rl_id = ${whReqLineId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .groupBy('status')
            .getRawMany()
    }

    async getPendingAndScannedCounts(fgWhRhId: number) {

        const res = await this.subEntity
            .createQueryBuilder('fgSub')
            .select([
                `SUM(CASE WHEN fgSub.status = '${FgWhRequestStatusEnum.FG_IN}' THEN 1 ELSE 0 END) AS scannedCount`,
                `SUM(CASE WHEN fgSub.status = '${FgWhRequestStatusEnum.OPEN}' THEN 1 ELSE 0 END) AS pendingCount`
            ])
            .where('fgSub.fgWhRhId = :fgWhRhId', { fgWhRhId: fgWhRhId })
            .getRawOne();
    }

}   
