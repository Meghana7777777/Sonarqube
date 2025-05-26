import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemEntity } from "../bom-item-entity";

@Injectable()
export class ItemRepository extends Repository<ItemEntity> {
    constructor(
        @InjectRepository(ItemEntity)
        private repo: Repository<ItemEntity>,
        private dataSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
}