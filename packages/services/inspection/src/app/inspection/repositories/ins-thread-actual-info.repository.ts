import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsThreadEntity } from "../../entities/ins-thread.entity";


@Injectable()
export class InsThreadRepo extends Repository<InsThreadEntity> {
    constructor(private dataSource: DataSource) {
        super(InsThreadEntity, dataSource.createEntityManager());
    }
}