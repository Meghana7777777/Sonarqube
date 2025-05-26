
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BankRequestLineEntity } from "../entity/bank-request-line.entity";

@Injectable()
export class BankRequestLineRepository extends Repository<BankRequestLineEntity> {
    constructor(private dataSource: DataSource) {
        super(BankRequestLineEntity, dataSource.createEntityManager());
    }
}

