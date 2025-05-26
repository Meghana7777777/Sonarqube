
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { JobOpEntity } from "../entity/job-op.entity";

@Injectable()
export class JobOpRepository extends Repository<JobOpEntity> {
    constructor(private dataSource: DataSource) {
        super(JobOpEntity, dataSource.createEntityManager());
    }
}

