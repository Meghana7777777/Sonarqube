import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { ConfigLeastAggregatorEntity } from "../entities/config-least-aggregator.entity";
import { ConfigLeastAggregatorRepoInterface } from "./config-least-aggregator.repo.interface";

@Injectable()
export class ConfigLeastAggregatorRepo extends BaseAbstractRepository<ConfigLeastAggregatorEntity> implements ConfigLeastAggregatorRepoInterface
{
  constructor(
    @InjectRepository(ConfigLeastAggregatorEntity)
    private readonly  polyBagEntity: Repository<ConfigLeastAggregatorEntity>,
  ) {
    super(polyBagEntity);
  }
}