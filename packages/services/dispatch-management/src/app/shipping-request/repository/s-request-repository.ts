
import { createQueryBuilder, DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SRequestEntity } from "../entites/s-request.entity";
import { ShippingDispatchRequest } from "@xpparel/shared-models";
import moment from "moment";

@Injectable()
export class SRequestRepository extends Repository<SRequestEntity> {
  constructor(private dataSource: DataSource) {
    super(SRequestEntity, dataSource.createEntityManager());
  }


  async getAlreadyDispatchedRepo(unitCode: string, companyCode: string, date: string): Promise<number> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const result = await this.createQueryBuilder('s_request')
      .select('COUNT(*)', 'count')
      .where('s_request.updated_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('s_request.current_stage = :stage', { stage: 'DIS' })
      .andWhere('s_request.unit_code = :unitCode', { unitCode })
      .andWhere('s_request.company_code = :companyCode', { companyCode })
      .getRawOne();

    return parseInt(result?.count || '0', 10);
  }

}
