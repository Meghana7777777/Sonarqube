
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { JobDepEntity } from "../entity/job-dep.entity";

@Injectable()
export class JobDepRepository extends Repository<JobDepEntity> {
    constructor(private dataSource: DataSource) {
        super(JobDepEntity, dataSource.createEntityManager());
    }

    
}

