import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhBarcodePrintHistoryEntity } from "../entities/ph-bar-code-print-history.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
@Injectable()
export class PhBarcodePrintHistoryRepo extends Repository<PhBarcodePrintHistoryEntity>{
    constructor(dataSource: DataSource) {
        super(PhBarcodePrintHistoryEntity, dataSource.createEntityManager());
    }
}