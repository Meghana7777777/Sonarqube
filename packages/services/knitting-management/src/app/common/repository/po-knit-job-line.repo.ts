import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobLineEntity } from "../entities/po-knit-job-line-entity";

@Injectable()
export class PoKnitJobLineRepository extends Repository<PoKnitJobLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobLineEntity, dataSource.createEntityManager());
    }

}