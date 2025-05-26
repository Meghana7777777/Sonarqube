import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoBundlingEntity } from "../entity/po-bundling.entity";

@Injectable()
export class PoBundlingRepository extends Repository<PoBundlingEntity> {
    constructor(private dataSource: DataSource) {
        super(PoBundlingEntity, dataSource.createEntityManager());
    }
}
