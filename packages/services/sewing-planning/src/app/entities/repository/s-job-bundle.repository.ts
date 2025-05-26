import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobBundleEntity } from "../s-job-bundle.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { JobBundlesNotMovedToInvQueryResponse, JobBundlesPslQtysQueryResponse } from "./query-response/inventory-query-response.models";


@Injectable()
export class SJobBundleRepository extends Repository<SJobBundleEntity> {
  constructor(dataSource: DataSource) {
    super(SJobBundleEntity, dataSource.createEntityManager());
  }


  async getUniqueBundlesForPslIds(pslIds: number[], processType: ProcessTypeEnum, companyCode: string, unitCode: string, getInvMoved: boolean, getNotInvMoved: boolean): Promise<JobBundlesNotMovedToInvQueryResponse[]> {
    const query = this.createQueryBuilder('b')
    .select('mo_product_sub_line_id as psl_id, bundle_number, qty, moved_to_inv')
    .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND process_type = '${processType}' `)
    .andWhere(`mo_product_sub_line_id IN(:...psls)`, {psls: pslIds});
    if(getInvMoved && getNotInvMoved) {
      // DO NOTHING
    } else if(getInvMoved) {
      query.andWhere(`moved_to_inv = true`);
    } else if(getNotInvMoved) {
      query.andWhere(`moved_to_inv = false`);
    }
    query.groupBy(`mo_product_sub_line_id, bundle_number`);// we are putting group by since the same bundle can be present multiple times because of op groups
    return await query.getRawMany();
  }

  async getTotalBundleQtyForPslIdsAndProcType(pslIds: number[], processType: ProcessTypeEnum, companyCode: string, unitCode: string, getInvMoved: boolean, getNotInvMoved: boolean): Promise<JobBundlesPslQtysQueryResponse[]> {
    const query = this.createQueryBuilder('b')
    .select('mo_product_sub_line_id as psl_id, count(1) as total_bundles, SUM(qty) as total_qty')
    .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND process_type = '${processType}' `)
    .andWhere(`mo_product_sub_line_id IN(:...psls)`, {psls: pslIds});
    if(getInvMoved && getNotInvMoved) {
      // DO NOTHING
    } else if(getInvMoved) {
      query.andWhere(`moved_to_inv = true`);
    } else if(getNotInvMoved) {
      query.andWhere(`moved_to_inv = false`);
    }
    query.groupBy(`mo_product_sub_line_id`);// we are putting group by since the same bundle can be present multiple times because of op groups
    return await query.getRawMany();
  }
  
}

