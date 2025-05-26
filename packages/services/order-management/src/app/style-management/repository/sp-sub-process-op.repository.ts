import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SpSubProcessOPEntity } from "../entity/sp-sub-process-op.entity";

@Injectable()
export class SPSubProcessOpRepository extends Repository<SpSubProcessOPEntity> {
    constructor(private dataSource: DataSource) {
        super(SpSubProcessOPEntity, dataSource.createEntityManager());
    }
}




