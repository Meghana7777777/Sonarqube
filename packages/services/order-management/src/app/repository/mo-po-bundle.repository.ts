
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";
import { PlannedBundleModel, ProcessTypeEnum, SI_MoProductRmModel } from "@xpparel/shared-models";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { MoPoBundleEntity } from "../entity/mo-po-bundle.entity";

@Injectable()
export class MoPoBundleRepository extends Repository<MoPoBundleEntity> {
  constructor(private dataSource: DataSource) {
    super(MoPoBundleEntity, dataSource.createEntityManager());
  }

  async getMoPlannedBundles(moNumber: string): Promise<PlannedBundleModel[]> {
    const query = await this.createQueryBuilder('b')
      .select(['s.product_name AS product_name', 's.fg_color AS fg_color', 's.size AS size','s.style_code AS style_code', 's.destination AS destination', 's.delivery_date AS delivery_date', 's.plan_prod_date AS plan_prod_date', 'b.quantity AS quantity', 'COUNT(*) AS no_of_bundles', "GROUP_CONCAT(b.bundle_number ORDER BY b.bundle_number SEPARATOR ',') AS bundle_numbers", 'b.proc_type AS processTypeEnum', 's.mo_number AS mo_code'])
      .leftJoin('mo_product_sub_line', 's', 's.id = b.mo_product_sub_line_id')
      .where('s.mo_number = :moNumber', { moNumber })
      .groupBy('s.product_name, s.fg_color, s.size, b.quantity, b.proc_type, s.mo_number')
      .orderBy('b.quantity', 'ASC')
      .getRawMany();

    return query.map(row => ({ ...row, bundle_numbers: row.bundle_numbers?.split(',') ?? [] }));
  }

}