import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { ItemsEntity } from "../entities/items.entity";
import { ItemsRepoInterface } from "./items-repo-interface";
import { CommonIdReqModal, CommonRequestAttrs, ItemsModelDto, MaterialReqModel } from "@xpparel/shared-models";
import { MaterialTypeEntity } from "../../material-type/entities/material-type.entity";
import { ItemDimensionsEntity } from "../entities/item-dimensions.entity";
import { BoxMapEntity } from "../../packing-spec/entities/box-map.entity";

@Injectable()
export class ItemsRepo extends BaseAbstractRepository<ItemsEntity> implements ItemsRepoInterface {
  constructor(
    @InjectRepository(ItemsEntity)
    private readonly itemEntity: Repository<ItemsEntity>,
  ) {
    super(itemEntity);
  }

  async getALLItems(unitCode: string, companyCode: string, category: string, itemsId: number[]): Promise<ItemsModelDto[]> {
    const query = this.itemEntity.createQueryBuilder('item')
      .select(`item.*,CONCAT (mt.code,'-',mt.desc) as materialTypeDesc,dm.length as length,dm.width as width,dm.height as height`)
      .leftJoin(MaterialTypeEntity, 'mt', 'item.materialType=mt.id')
      .leftJoin(ItemDimensionsEntity, 'dm', 'dm.id=item.dimensionsId')
      .orderBy('item.created_at', 'DESC')
      .where(`item.company_code='${companyCode}' and item.unit_code='${unitCode}' `)
    if (category)
      query.andWhere(`item.category='${category}'`)
    if (itemsId.length)
      query.andWhere(`item.id IN (${itemsId})`)

    return await query.getRawMany()

  };



  async getUnMappedItemsToSpecByPo(bomItems: number[]): Promise<ItemsModelDto[]> {
    const query = await this.itemEntity.createQueryBuilder('i')
      .select(`i.*,dm.length as length,dm.width as width,dm.height as height`)
      .leftJoin(BoxMapEntity, 'bx', 'bx.item_id = i.id')
      .leftJoin(ItemDimensionsEntity, 'dm', 'dm.id=i.dimensionsId')
      .where(`bx.item_id NOT IN (${bomItems})`)
      .groupBy('i.id')
      .getRawMany()
    return query.map(rec => new ItemsModelDto(rec.id, rec.code, rec.desc, rec.length, rec.width, rec.height, rec.category, undefined, undefined, undefined, undefined))
  }

}