import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { Sequence } from "../entity/sequence";

@Injectable()
export class SequenceRepo extends Repository<Sequence> {
    constructor(private dataSource: DataSource) {
        super(Sequence, dataSource.createEntityManager());
    }

}