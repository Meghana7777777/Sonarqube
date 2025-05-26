import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhIssuanceEntity } from "../po-wh-issuance-entity";

@Injectable()
export class PoWhRequestIssuanceRepository extends Repository<PoWhIssuanceEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhIssuanceEntity, dataSource.createEntityManager());
    }
}
