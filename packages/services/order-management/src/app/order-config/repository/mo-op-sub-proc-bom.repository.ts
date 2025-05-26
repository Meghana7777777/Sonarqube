
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpSubProcessBomEntity } from "../entity/mo-op-sub-proc-bom.entity";

@Injectable()
export class MoOpSubProcessBomRepository extends Repository<MoOpSubProcessBomEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpSubProcessBomEntity, dataSource.createEntityManager());
    }
}




