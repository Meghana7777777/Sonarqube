
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SpSubprocessEntity } from "../entity/sp-sub-process.entity";

@Injectable()
export class SPSubProcessRepository extends Repository<SpSubprocessEntity> {
    constructor(private dataSource: DataSource) {
        super(SpSubprocessEntity, dataSource.createEntityManager());
    }
}



