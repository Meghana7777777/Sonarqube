import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsRequestHistoryEntity } from "../../entities/ins-request-history.entity";


@Injectable()
export class InsRequestHistoryRepo extends Repository<InsRequestHistoryEntity> {
    constructor(private dataSource: DataSource) {
        super(InsRequestHistoryEntity, dataSource.createEntityManager());
    }

   
}