import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsConfigEntity } from "../entity/ins-config.entity";

@Injectable()
export class InsTypesRepo extends Repository<InsConfigEntity> {
    constructor(dataSource: DataSource) {
        super(InsConfigEntity, dataSource.createEntityManager());
    }
}