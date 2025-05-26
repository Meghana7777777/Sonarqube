import { Injectable } from "@nestjs/common";
import { AttributesMasterEntity } from "../entity/attributes-master-entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AttributesMasterRepository extends Repository<AttributesMasterEntity> {
    constructor(
        @InjectRepository(AttributesMasterEntity)
        private repo: Repository<AttributesMasterEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }




}