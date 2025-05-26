import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SpOpVersionEntity } from "../entity/sp-op-version.entity";

@Injectable()
export class SPOpVersionRepository extends Repository<SpOpVersionEntity> {
    constructor(private dataSource: DataSource) {
        super(SpOpVersionEntity, dataSource.createEntityManager());
    }

}

