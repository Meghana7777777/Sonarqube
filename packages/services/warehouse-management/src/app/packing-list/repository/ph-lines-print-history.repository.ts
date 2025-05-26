import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhLinesHistoryEntity } from "../entities/ph-lines-print-history.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";

@Injectable()
export class PhLinesPrintHistoryRepo extends Repository<PhLinesHistoryEntity>{
    constructor(dataSource: DataSource) {
        super(PhLinesHistoryEntity, dataSource.createEntityManager());
    }
}