import { Injectable } from "@nestjs/common";
import { DistinctPLItemCategoriesModel, PhItemCategoryEnum } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { ItemInfoQryResp } from "./query-response/item-info.qry.resp";

@Injectable()
export class PhItemsRepo extends Repository<PhItemsEntity> {
  constructor(dataSource: DataSource) {
    super(PhItemsEntity, dataSource.createEntityManager());
  }

  async getItemInfoByLotNumber(lotNumber: string, unitCode: string, companyCode: string): Promise<ItemInfoQryResp> {
    return await this.createQueryBuilder('ph_items')
      .select('item_description, item_code')
      .leftJoin('ph_items.phLinesId', 'ph_line')
      .where(`ph_line.lot_number = '${lotNumber}' AND ph_line.unit_code = '${unitCode}' AND ph_line.company_code = '${companyCode}'`)
      .getRawOne();
  }

  async getDistinctItemCategories(phId: number): Promise<DistinctPLItemCategoriesModel[]> {
    const queryBuilder = this.createQueryBuilder('i')
      .select(`DISTINCT item_category AS itemCategory `)
      .leftJoin(PhItemLinesEntity, 'pl', 'pl.ph_items_id = i.id')
      .where(`pl.ph_id=${phId}`)
    const result = await queryBuilder.getRawMany();
    return result;
  }

  async getDistinctItemInfoByCategory(item_category: string, unitCode: string, companyCode: string): Promise<ItemInfoQryResp[]> {
    const result = await this.createQueryBuilder('i')
      .select(['DISTINCT i.itemCode AS item_code', 'i.itemDescription AS item_description'])
      .where('i.itemCategory = :item_category', { item_category })
      .andWhere('i.unitCode = :unitCode', { unitCode })
      .andWhere('i.companyCode = :companyCode', { companyCode })
      .getRawMany<ItemInfoQryResp>();
    return result;
  }


  async getDistinctItemStyles(companyCode: string, unitCode: string): Promise<string[]> {
    const data = await this.createQueryBuilder("item")
      .select("DISTINCT item.itemStyle", "itemStyle")
      .where("item.companyCode = :companyCode", { companyCode })
      .andWhere("item.unitCode = :unitCode", { unitCode })
      .getRawMany();

    return data.map(row => row.itemStyle);
  }

  async getLotsForStyle(styleCodes: string[], unitCode: string, companyCode: string): Promise<string[]> {
    const data = await this.createQueryBuilder('pit')
      .leftJoin('ph_lines', 'pl', 'pit.ph_lines_id = pl.id')
      .select('DISTINCT pl.lot_number', 'lot_number')
      .where('pit.item_style IN (:...styleCodes)', { styleCodes })
      .andWhere('pit.unit_code = :unitCode', { unitCode })
      .andWhere('pit.company_code = :companyCode', { companyCode })
      .getRawMany();

    return data.map(row => row.lot_number);
  }

  async getItemCodesForLot(lots: string[],unitCode: string,companyCode: string): Promise<string[]> {
    const data = await this.createQueryBuilder('pi')
      .leftJoin('ph_lines', 'pl', 'pl.id = pi.ph_lines_id')
      .select('DISTINCT pi.item_code', 'item_code')
      .where('pl.lot_number IN (:...lots)', { lots })
      .andWhere('pi.unit_code = :unitCode', { unitCode })
      .andWhere('pi.company_code = :companyCode', { companyCode })
      .getRawMany();
    return data?.map(row => row.item_code);
  }

}