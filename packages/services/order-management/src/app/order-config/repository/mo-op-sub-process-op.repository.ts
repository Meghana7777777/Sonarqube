import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpSubProcessOPEntity } from "../entity/mo-op-sub-process-op.entity";

@Injectable()
export class MoOpSubProcessOpRepository extends Repository<MoOpSubProcessOPEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpSubProcessOPEntity, dataSource.createEntityManager());
    }
}




