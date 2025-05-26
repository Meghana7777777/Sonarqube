import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobEntity } from "../entities/po-knit-job-entity";

@Injectable()
export class PoKnitJobRepository extends Repository<PoKnitJobEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobEntity, dataSource.createEntityManager());
    }

}