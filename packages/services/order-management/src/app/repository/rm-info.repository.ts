import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { SI_MoProductRmModel, SI_MoRmModel } from "@xpparel/shared-models";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";

@Injectable()
export class RawMaterialInfoRepository extends Repository<RmInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(RmInfoEntity, dataSource.createEntityManager());
  }

  async getMoRmByManufacturingOrderNo(moNumber: string, unitCode: string, companyCode: string): Promise<SI_MoRmModel[]> {
    const query = await this.createQueryBuilder('rmInfo')
      .select('item_code as itemCode,item_desc as itemDesc,SUM(consumption) as avgCons,item_color as itemColor,sequence as seq')
      .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND mo_number = '${moNumber}'`)
      .groupBy('item_code,item_desc,item_color,sequence')
      .getRawMany();

    return query;
  }

  //helper methods for getOrderInfoByManufacturingOrderProductCodeFgColor

  async getMoRmByManufacturingOrderNoProductCodeFgColor(moNumber: string, productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<SI_MoRmModel[]> {
    const query = await this.createQueryBuilder('rmInfo')
      .select('item_code as itemCode,item_desc as itemDesc,SUM(consumption) as avgCons,item_color as itemColor,sequence as seq')
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = rmInfo.company_code AND moPsl.unit_code = rmInfo.unit_code AND moPsl.mo_number = rmInfo.mo_number")
      .where(` rmInfo.company_code = '${companyCode}' AND rmInfo.unit_code = '${unitCode}' AND rmInfo.mo_number = '${moNumber}' AND moPsl.product_code='${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .groupBy('item_code,item_desc,item_color,sequence')
      .getRawMany();
    return query;
  }

  async getMoRmByPslIds(moNumber: string,pslIds:number[], unitCode: string, companyCode: string): Promise<SI_MoRmModel[]> {
    const query = await this.createQueryBuilder('rmInfo')
      .select('item_code as itemCode,item_desc as itemDesc,SUM(consumption) as avgCons,item_color as itemColor,sequence as seq')
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = rmInfo.company_code AND moPsl.unit_code = rmInfo.unit_code AND moPsl.mo_number = rmInfo.mo_number")
      .where(` rmInfo.company_code = '${companyCode}' AND rmInfo.unit_code = '${unitCode}' AND rmInfo.mo_number = '${moNumber}' AND moPsl.id IN (${pslIds.join(',')})`)
      .groupBy('item_code,item_desc,item_color,sequence')
      .getRawMany();

    return query;
  }
}
