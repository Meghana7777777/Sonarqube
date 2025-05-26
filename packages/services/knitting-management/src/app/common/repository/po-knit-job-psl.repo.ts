import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobPslEntity } from "../entities/po-knit-job-psl-entity";

@Injectable()
export class PoKnitJobPslRepository extends Repository<PoKnitJobPslEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobPslEntity, dataSource.createEntityManager());
    }

}