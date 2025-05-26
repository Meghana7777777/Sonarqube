import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigMasterAttributesMappingEntity } from "../entity/config-master-attributes-entity";

@Injectable()
export class ConfigMasterAttributesMappingRepository extends Repository<ConfigMasterAttributesMappingEntity> {
    constructor(
        @InjectRepository(ConfigMasterAttributesMappingEntity)
        private repo: Repository<ConfigMasterAttributesMappingEntity>,
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }




}