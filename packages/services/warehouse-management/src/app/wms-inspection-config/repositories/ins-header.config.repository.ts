import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsConfigHeaderEntity } from "../entities/ins-header-config.entity";

@Injectable()
export class InsHeaderConfigRepo extends Repository<InsConfigHeaderEntity> {
    constructor(dataSource: DataSource) {
        super(InsConfigHeaderEntity, dataSource.createEntityManager());
    }
}