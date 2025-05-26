import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsConfigItemsEntity } from "../entities/pkms-ins-header-config-items";

@Injectable()
export class InsConfigItemRepo extends Repository<InsConfigItemsEntity> {
    constructor(dataSource: DataSource) {
        super(InsConfigItemsEntity, dataSource.createEntityManager());
    }
}