import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StyleEntity } from "../entity/style-entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class StyleRepository extends Repository<StyleEntity> {


    constructor(
        @InjectRepository(StyleEntity) 
        private repo: Repository<StyleEntity>,
        private datSource: DataSource) {
        super(repo.target, repo.manager, repo.queryRunner);
    }
}