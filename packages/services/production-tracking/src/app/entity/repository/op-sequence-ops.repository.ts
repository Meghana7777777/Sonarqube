 
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequenceOpsEntity } from "../op-sequence-ops.entity";


@Injectable()
export class OpSequenceOpsRepository extends Repository<OpSequenceOpsEntity> {
    constructor(private dataSource: DataSource) {
        super(OpSequenceOpsEntity, dataSource.createEntityManager());
    }
}



