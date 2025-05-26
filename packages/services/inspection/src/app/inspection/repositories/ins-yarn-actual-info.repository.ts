import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsYarnEntity } from "../../entities/ins-yarn.entity";

@Injectable()
export class InsYarnRepo extends Repository<InsYarnEntity> {
    constructor(private dataSource: DataSource) {
        super(InsYarnEntity, dataSource.createEntityManager());
    }
}