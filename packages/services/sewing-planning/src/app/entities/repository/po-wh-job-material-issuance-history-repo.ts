import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhJobMaterialIssuanceEntity } from "../po-wh-job-material-issuance-entity";
import { PoWhJobMaterialIssuanceHistoryEntity } from "../po-wh-job-material-issuance-history-entity";

@Injectable()
export class PoWhJobMaterialIssuanceHistoryRepository extends Repository<PoWhJobMaterialIssuanceHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhJobMaterialIssuanceHistoryEntity, dataSource.createEntityManager());
    }
}
