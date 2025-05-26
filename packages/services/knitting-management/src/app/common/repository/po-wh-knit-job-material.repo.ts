import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoWhKnitJobMaterialEntity } from "../entities/po-wh-job-material-entity";

@Injectable()
export class PoWhKnitJobMaterialRepository extends Repository<PoWhKnitJobMaterialEntity> {
    constructor(private dataSource: DataSource) {
        super(PoWhKnitJobMaterialEntity, dataSource.createEntityManager());
    }
}