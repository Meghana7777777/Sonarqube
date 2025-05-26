import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhJobMaterialIssuanceEntity } from "../po-wh-job-material-issuance-entity";

@Injectable()
export class PoWhJobMaterialIssuanceRepository extends Repository<PoWhJobMaterialIssuanceEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhJobMaterialIssuanceEntity, dataSource.createEntityManager());
    }
}
