import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhKnitJobMaterialIssuanceEntity } from "../entities/po-wh-job-material-issuance-entity";

@Injectable()
export class PoWhKnitJobMaterialIssuanceRepository extends Repository<PoWhKnitJobMaterialIssuanceEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhKnitJobMaterialIssuanceEntity, dataSource.createEntityManager());
    }
}
