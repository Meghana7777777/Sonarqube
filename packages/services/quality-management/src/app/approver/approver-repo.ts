import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ApproverEntity } from "./entites/approver.entity";

@Injectable()
export class ApproverRepository extends Repository<ApproverEntity> {
    constructor(private dataSource: DataSource) {
        super(ApproverEntity, dataSource.createEntityManager());
    }
}