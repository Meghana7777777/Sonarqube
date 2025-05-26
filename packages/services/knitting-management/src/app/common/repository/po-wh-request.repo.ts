import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhRequestEntity } from "../entities/po-wh-request-entity";

@Injectable()
export class PoWhRequestRepository extends Repository<PoWhRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhRequestEntity, dataSource.createEntityManager());
    }
}