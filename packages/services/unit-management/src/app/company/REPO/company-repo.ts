import { Injectable } from "@nestjs/common";
import { CompanyEntity } from "../company-entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CompanyRepository extends Repository<CompanyEntity> {
    constructor(
        @InjectRepository(CompanyEntity)
        private repo: Repository<CompanyEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    
}