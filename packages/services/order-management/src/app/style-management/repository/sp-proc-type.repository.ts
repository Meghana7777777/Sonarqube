import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SpProcTypeEntity } from "../entity/sp-proc-type.entity";

@Injectable()
export class SPProcessTypeRepository extends Repository<SpProcTypeEntity> {
    constructor(private dataSource: DataSource) {
        super(SpProcTypeEntity, dataSource.createEntityManager());
    }

}




