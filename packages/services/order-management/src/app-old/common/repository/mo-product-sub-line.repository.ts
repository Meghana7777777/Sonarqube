import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";

@Injectable()
export class SoProductSubLineRepository extends Repository<SoProductSubLineEntity> {
  constructor(private dataSource: DataSource) {
    super(SoProductSubLineEntity, dataSource.createEntityManager());
  }

  async getTotalOrderQuantityBySoNumber(soNumber: string): Promise<number> {
    return this.createQueryBuilder('so_product_sub_line')
      .select('SUM(quantity)', 'totalQuantity')
      .where('so_number = :soNumber', { soNumber })
      .getRawOne()
      .then((result) => result.totalQuantity);
  }
}
