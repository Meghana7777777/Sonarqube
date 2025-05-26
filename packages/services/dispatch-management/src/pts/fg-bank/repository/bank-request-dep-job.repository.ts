
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BankRequestDepJobEntity } from "../entity/bank-request-dep-job.entity";

@Injectable()
export class BankRequestDepJobRepository extends Repository<BankRequestDepJobEntity> {
    constructor(private dataSource: DataSource) {
        super(BankRequestDepJobEntity, dataSource.createEntityManager());
    }
}

