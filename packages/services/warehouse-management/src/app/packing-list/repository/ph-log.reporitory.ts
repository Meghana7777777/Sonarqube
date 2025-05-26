import { DataSource, Repository } from "typeorm";
import { PhLogEntity } from "../entities/ph-log.entity";
import { Injectable } from "@nestjs/common";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";

@Injectable()
export class PhLogRepo extends Repository<PhLogEntity>{
    constructor(dataSource: DataSource) {
        super(PhLogEntity, dataSource.createEntityManager());
    }
}