import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestLineEntity } from "../entities/po-wh-request-line-entity";
import { KG_ItemWiseMaterialRequirementModel, KnitJobObjectModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { PoWhRequestMaterialItemEntity } from "../entities/po-wh-request-material-item-entity";

@Injectable()
export class PoWhRequestLineRepository extends Repository<PoWhRequestLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestLineEntity, dataSource.createEntityManager());
    }

    async getObjectDataByJobNumber(jobNumber: string, unitCode: string, companyCode: string): Promise<KnitJobObjectModel[]> {
        return await this.createQueryBuilder("pwrl")
            .select(["pwrl.jobNumber AS jobNumber", "pwrl.requiredQty AS requiredQty", "pwrl.issuedQty AS issuedQty", "pwrl.groupCode AS groupCode", "pwrmi.objectCode AS objectCode", "pwrmi.locationCode AS locationCode"])
            .leftJoin(PoWhRequestMaterialItemEntity, "pwrmi", "pwrmi.po_wh_request_line_id = pwrl.id")
            .where("pwrl.jobNumber = :jobNumber", { jobNumber })
            .andWhere("pwrl.unitCode = :unitCode", { unitCode })
            .andWhere("pwrl.companyCode = :companyCode", { companyCode })
            .getRawMany();
    }

}