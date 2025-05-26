import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpProcTypeEntity } from "../entity/mo-op-proc-type.entity";

@Injectable()
export class MoOpProcessTypeRepository extends Repository<MoOpProcTypeEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpProcTypeEntity, dataSource.createEntityManager());
    }

}




