import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories/base.abstract.repository";
import { ConfigLeastAggregatorEntity } from "../entities/config-least-aggregator.entity";
import { ConfigLeastAggregateRepoInterface } from "./config-least-aggregator-repo-interface";

@Injectable()
export class ConfigLeastAggregateRepo extends BaseAbstractRepository<ConfigLeastAggregatorEntity> implements ConfigLeastAggregateRepoInterface {
    constructor(
        @InjectRepository(ConfigLeastAggregatorEntity)
        private readonly cartonAggregateEntity: Repository<ConfigLeastAggregatorEntity>,
    ) {
        super(cartonAggregateEntity);
    }
}