import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { WareHouseRepoInterface } from "./warehouse.repo.interface";
import { FGMWareHouseEntity } from "../entities/fg-m-warehouse.entity";


@Injectable()
export class WareHouseRepo extends BaseAbstractRepository<FGMWareHouseEntity> implements WareHouseRepoInterface
{
  constructor(
    @InjectRepository(FGMWareHouseEntity)
    private readonly whEntity: Repository<FGMWareHouseEntity>,
  ) {
    super(whEntity);
  }
}