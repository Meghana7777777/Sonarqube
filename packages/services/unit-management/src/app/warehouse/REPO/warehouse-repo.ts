import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WarehouseEntity } from "../warehouse-entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WarehouseRepository extends Repository<WarehouseEntity> {
    constructor(
        @InjectRepository(WarehouseEntity)
        private repo: Repository<WarehouseEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
    
}
