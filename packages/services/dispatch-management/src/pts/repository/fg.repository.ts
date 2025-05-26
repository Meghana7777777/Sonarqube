
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgEntity } from "../entity/fg.entity";
import { MoInfoEntity } from "../entity/mo-info.entity";

@Injectable()
export class FgRepository extends Repository<FgEntity> {
    constructor(private dataSource: DataSource) {
        super(FgEntity, dataSource.createEntityManager());
    }
}

