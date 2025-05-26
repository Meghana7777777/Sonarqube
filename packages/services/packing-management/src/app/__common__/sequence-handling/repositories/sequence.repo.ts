import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SequenceEntity } from "../entities/sequence";

@Injectable()
export class SequenceRepo extends Repository<SequenceEntity> {
    constructor(private dataSource: DataSource) {
        super(SequenceEntity, dataSource.createEntityManager());
    }
}