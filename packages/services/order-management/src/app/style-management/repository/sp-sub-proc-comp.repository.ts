
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SPSubProcessBomEntity } from "../entity/sp-sub-proc-bom.entity";
import { SpSubProcessComponentEntity } from "../entity/sp-sub-proc-comp.entity";

@Injectable()
export class SPSubProcessComponentRepository extends Repository<SpSubProcessComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(SpSubProcessComponentEntity, dataSource.createEntityManager());
    }
}




