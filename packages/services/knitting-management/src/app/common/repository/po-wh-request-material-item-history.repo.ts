import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestMaterialItemHistoryEntity } from "../entities/po-wh-request-material-item-history-entity";

@Injectable()
export class PoWhRequestMaterialItemHistoryRepository extends Repository<PoWhRequestMaterialItemHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestMaterialItemHistoryEntity, dataSource.createEntityManager());
    }
}