 
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequenceRefEntity } from "../op-sequence-ref.entity";


@Injectable()
export class OpSequenceRefRepository extends Repository<OpSequenceRefEntity> {
    constructor(private dataSource: DataSource) {
        super(OpSequenceRefEntity, dataSource.createEntityManager());
    }
}



