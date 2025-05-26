import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestLineEntity } from "../po-wh-request-line-entity";
import { PoWhRequestLineHistoryEntity } from "../po-wh-request-line-history-entity";

@Injectable()
export class PoWhRequestLineHistoryRepository extends Repository<PoWhRequestLineHistoryEntity> {
    constructor( dataSource: DataSource ) {
        super(PoWhRequestLineHistoryEntity, dataSource.createEntityManager());
    }


}

