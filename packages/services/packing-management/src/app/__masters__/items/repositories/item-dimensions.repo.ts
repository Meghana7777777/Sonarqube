import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { ItemDimensionsEntity } from "../entities/item-dimensions.entity";
import { ItemDimensionsRepoInterface } from "./item-dimensions-repo-interface";
import { BoxMapEntity } from "../../packing-spec/entities/box-map.entity";
import { ItemsModelDto } from "@xpparel/shared-models";

@Injectable()
export class ItemDimensionsRepo extends BaseAbstractRepository<ItemDimensionsEntity> implements ItemDimensionsRepoInterface {
  constructor(
    @InjectRepository(ItemDimensionsEntity)
    private readonly itemDimensionsEntity: Repository<ItemDimensionsEntity>,
  ) {
    super(itemDimensionsEntity);
  }


}