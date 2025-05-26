import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobRatioLineEntity } from "../entities/po-knit-job-ratio-line-entity";

@Injectable()
export class PoKnitJobRatioLineRepository extends Repository<PoKnitJobRatioLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobRatioLineEntity, dataSource.createEntityManager());
    }

}