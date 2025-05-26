import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestLineEntity } from "../entities/po-wh-request-line-entity";
import { KG_ItemWiseMaterialRequirementModel, ProcessTypeEnum } from "@xpparel/shared-models";
import { PoWhRequestLineHistoryEntity } from "../entities/po-wh-request-line-history.entity";

@Injectable()
export class PoWhRequestLineHistoryRepository extends Repository<PoWhRequestLineHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestLineHistoryEntity, dataSource.createEntityManager());
    }
}