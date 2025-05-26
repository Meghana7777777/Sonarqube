import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UnitsEntity } from "../units-entity";

@Injectable()
export class UnitsRepository extends Repository<UnitsEntity> {
    constructor(
        @InjectRepository(UnitsEntity)
        private repo: Repository<UnitsEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
    
}