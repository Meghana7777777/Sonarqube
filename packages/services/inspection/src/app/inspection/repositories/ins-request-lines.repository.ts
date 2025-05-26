import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsRequestLinesEntity } from "../../entities/ins_request_lines.entity";

@Injectable()
export class InsRequestLinesRepository extends Repository<InsRequestLinesEntity> {
    constructor(private dataSource: DataSource) {
        super(InsRequestLinesEntity, dataSource.createEntityManager());
    }
}