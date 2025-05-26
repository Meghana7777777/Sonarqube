import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestMaterialHistoryEntity } from "../entities/po-wh-request-material-history-entity";

@Injectable()
export class PoWhRequestMaterialHistoryRepository extends Repository<PoWhRequestMaterialHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestMaterialHistoryEntity, dataSource.createEntityManager());
    }
}