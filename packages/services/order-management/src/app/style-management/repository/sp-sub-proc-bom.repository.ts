
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SPSubProcessBomEntity } from "../entity/sp-sub-proc-bom.entity";

@Injectable()
export class SPSubProcessBomRepository extends Repository<SPSubProcessBomEntity> {
    constructor(private dataSource: DataSource) {
        super(SPSubProcessBomEntity, dataSource.createEntityManager());
    }
}




