import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutStatusEnum, LayerMeterageRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketLayEntity } from "../entity/po-docket-lay.entity";
import { PoDocketLayItemEntity } from "../entity/po-docket-lay-item.entity";
import { DocketCutPliesQueryResponse } from "./query-response/docket-cut-plies.query.reponse";
import { DocketLayPliesQueryResponse } from "./query-response/docket-lay-plies.query.reponse";
import moment from "moment";

@Injectable()
export class PoDocketLayRepository extends Repository<PoDocketLayEntity> {
  constructor(private dataSource: DataSource) {
    super(PoDocketLayEntity, dataSource.createEntityManager());
  }

  async getCutReportedPliesPerDocketOfGivenDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<DocketCutPliesQueryResponse[]> {
    return await this.createQueryBuilder('lay')
      .select(` lay.docket_group, SUM(lay_roll.layed_plies) as reported_plies, lay.id as lay_id`)
      .leftJoin(PoDocketLayItemEntity, 'lay_roll', 'lay_roll.company_code = lay.company_code AND lay_roll.unit_code = lay.unit_code AND lay_roll.po_docket_lay_id = lay.id ')
      .where(` lay.company_code = '${companyCode}' AND lay.unit_code = '${unitCode}' AND lay.cut_status = '${CutStatusEnum.COMPLETED}' AND lay.docket_group IN (:...docs) `, { docs: docketGroups })
      .groupBy(`lay.docket_group`)
      .getRawMany();
  }

  async getLayReportedPliesPerDocketOfGivenDocketGroups(docketGroups: string[], companyCode: string, unitCode: string): Promise<DocketLayPliesQueryResponse[]> {
    return await this.createQueryBuilder('lay')
      .select(` lay.docket_group, SUM(lay_roll.layed_plies) as layed_plies, lay.id as lay_id`)
      .leftJoin(PoDocketLayItemEntity, 'lay_roll', 'lay_roll.company_code = lay.company_code AND lay_roll.unit_code = lay.unit_code AND lay_roll.po_docket_lay_id = lay.id ')
      .where(` lay.company_code = '${companyCode}' AND lay.unit_code = '${unitCode}' AND lay.docket_group IN (:...docs) `, { docs: docketGroups })
      .groupBy(`lay.docket_group`)
      .getRawMany();
  }


  async getTotalLayedMeterageTodayRepo(unitCode: string, companyCode: string, date: string): Promise<{reqNumber: string, docGroup: string}[]> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const query = await this.createQueryBuilder('po')
      .select(['po.request_number AS reqNumber, po.docket_group AS docGroup'])
      .where('po.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('po.unitCode = :unitCode', { unitCode })
      .andWhere('po.companyCode = :companyCode', { companyCode })
      .groupBy(`po.request_number`)
      .getRawMany();
    return query;
  }


}

