import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { LayerMeterageRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketLayEntity } from "../entity/po-docket-lay.entity";
import { PoDocketLayItemEntity } from "../entity/po-docket-lay-item.entity";
import moment from "moment";

@Injectable()
export class PoDocketLayItemRepository extends Repository<PoDocketLayItemEntity> {
  constructor(private dataSource: DataSource) {
    super(PoDocketLayItemEntity, dataSource.createEntityManager());
  }


  async getTotalEndBitsRepo(unitCode: string, companyCode: string, date: string): Promise<{totalEndBits : number}> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const query = await this.createQueryBuilder('po')
      .select('SUM(po.end_bits) AS totalEndBits')
      .where('po.started_date_time BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('po.unitCode = :unitCode', { unitCode })
      .andWhere('po.companyCode = :companyCode', { companyCode })
      .getRawOne();

    return query;
  }

}

