import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsRequestRevisionEntity } from "../../entities/ins-request-revision.entity";


@Injectable()
export class InsRequestRevisionRepo extends Repository<InsRequestRevisionEntity>{
    constructor(private dataSource: DataSource) {
        super(InsRequestRevisionEntity, dataSource.createEntityManager());
    }
}