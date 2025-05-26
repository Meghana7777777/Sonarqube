import { DataSource, Repository } from "typeorm";
import { WarehouseUnitmappingEntity } from "../warehouse-unitmapping-entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WarehouseUnitmappingRepository extends Repository<WarehouseUnitmappingEntity> {
    constructor (
        @InjectRepository(WarehouseUnitmappingEntity)
        private repo: Repository<WarehouseUnitmappingEntity>,
        private dataSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
    
}