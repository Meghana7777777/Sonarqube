
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BankRequestLineEntity } from "../entity/bank-request-line.entity";
import { BankRequestHeaderEntity } from "../entity/bank-request-header.entity";

@Injectable()
export class BankRequestHeaderRepository extends Repository<BankRequestHeaderEntity> {
    constructor(private dataSource: DataSource) {
        super(BankRequestHeaderEntity, dataSource.createEntityManager());
    }
}

