import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestEntity } from "../po-wh-request-entity";

@Injectable()
export class PoWhRequestRepository extends Repository<PoWhRequestEntity> {
    constructor( dataSource: DataSource ) {
        super(PoWhRequestEntity, dataSource.createEntityManager());
    }


}

