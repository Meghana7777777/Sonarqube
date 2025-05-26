
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequenceEntity } from "../entity/op-sequence.entity";


@Injectable()
export class OpSequenceRepository extends Repository<OpSequenceEntity> {
    constructor(private dataSource: DataSource) {
        super(OpSequenceEntity, dataSource.createEntityManager());
    }
}



