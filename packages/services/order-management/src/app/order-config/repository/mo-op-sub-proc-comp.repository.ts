
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpSubProcessBomEntity } from "../entity/mo-op-sub-proc-bom.entity";
import { MoOpSubProcessComponentEntity } from "../entity/mo-op-sub-proc-comp.entity";

@Injectable()
export class MoOpSubProcessComponentRepository extends Repository<MoOpSubProcessComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpSubProcessComponentEntity, dataSource.createEntityManager());
    }
}




