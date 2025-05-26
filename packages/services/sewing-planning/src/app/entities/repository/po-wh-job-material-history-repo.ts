import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhJobMaterialEntity } from "../po-wh-job-material-entity";
import { PoWhJobMaterialHistoryEntity } from "../po-wh-job-material-history-entity";

@Injectable()
export class PoWhJobMaterialHistoryRepository extends Repository<PoWhJobMaterialHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhJobMaterialHistoryEntity, dataSource.createEntityManager());
    }
}