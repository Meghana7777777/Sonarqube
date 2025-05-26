
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoOpSubprocessEntity } from "../entity/mo-op-sub-process.entity";

@Injectable()
export class MoOpSubProcessRepository extends Repository<MoOpSubprocessEntity> {
    constructor(private dataSource: DataSource) {
        super(MoOpSubprocessEntity, dataSource.createEntityManager());
    }
}



