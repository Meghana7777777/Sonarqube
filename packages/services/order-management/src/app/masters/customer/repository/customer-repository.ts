import { Injectable } from "@nestjs/common";
import { CustomerEntity } from "../entity/customer-entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {


    constructor(
        @InjectRepository(CustomerEntity) 
        private repo: Repository<CustomerEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
 
}

