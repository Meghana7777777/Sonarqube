import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocketGroupResponseModel, LayerMeterageRequest, LayMeterageResponse, PoDocketGroupRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketMaterialRequestEntity } from "../entity/po-docket-material-request.entity";
import { PoDocketMaterialEntity } from "../entity/po-docket-material.entity";

@Injectable()
export class PoDocketMaterialRepository extends Repository<PoDocketMaterialEntity> {
  constructor(private dataSource: DataSource) {
    super(PoDocketMaterialEntity, dataSource.createEntityManager());
  }

  async getAllocatedQtyForDocketGroup(docketGroup: string, unitCode: string, companyCode: string): Promise<number> {
    const allocQtyInfo: { requested_quantity: number } = await this.createQueryBuilder('po_doc_material')
      .select('sum(requested_quantity) as requested_quantity')
      .where(`docket_group = '${docketGroup}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
      .getRawOne();
    return allocQtyInfo ? Number(allocQtyInfo.requested_quantity) : 0;
  }

  async getTotalMaterialAllocatedDocketsToday(unitCode: string, companyCode: string, date: string): Promise<number> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const nonMrnRequest = 0;
    const result = await this.createQueryBuilder('pdmr')
      .select('COUNT(DISTINCT pdmr.docket_group) as count')
      .where('pdmr.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('pdmr.mrn_id = :mrnId', { mrnId: nonMrnRequest })
      .andWhere('unit_code = :unitCode', { unitCode })
      .andWhere('company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.count ?? 0;

  }

  async getTotalMaterialAllocatedDocketsTodayInfo(unitCode: string, companyCode: string, date: string): Promise<number> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const nonMrnRequest = 0;
    const result = await this.createQueryBuilder('pdmr')
      .select('sum(requested_quantity) as allocationQty')
      .where('pdmr.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('pdmr.mrn_id = :mrnId', { mrnId: nonMrnRequest })
      .andWhere('unit_code = :unitCode', { unitCode })
      .andWhere('company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.allocationQty ?? 0;

  }

  
  async getTotalMaterialAllocatedDocketsTodayInfoRolls(unitCode: string, companyCode: string, date: string): Promise<number> {
    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const nonMrnRequest = 0;
    const result = await this.createQueryBuilder('pdmr')
      .select('count(*) as allocationRolls')
      .where('pdmr.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('pdmr.mrn_id = :mrnId', { mrnId: nonMrnRequest })
      .andWhere('unit_code = :unitCode', { unitCode })
      .andWhere('company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.allocationRolls ?? 0;

  }



  async getTotalLayedMeterageRepo(unitCode: string, companyCode: string, docketGroup: string, requestNumber: number): Promise<{requestedQuantity:number}> {
    const result = await this.createQueryBuilder('pdm')
      .select('SUM(pdm.requested_quantity)', 'rqty')
      .where('pdm.docket_group IN (:docketGroups)', { docketGroups: docketGroup })
      .andWhere('pdm.request_number IN (:request_number)', { request_number: requestNumber })
      .andWhere('pdm.unit_code = :unitCode', { unitCode })
      .andWhere('pdm.company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.rqty ?? 0;
  }


  async getRequesteedQtybyRequestNumber(unitCode: string, companyCode: string, requestNumber: string[]): Promise<number> {
    const result = await this.createQueryBuilder('pdm')
      .select('SUM(pdm.requested_quantity)', 'rqty')
      .andWhere('pdm.request_number IN (:request_number)', { request_number: requestNumber })
      .andWhere('pdm.unit_code = :unitCode', { unitCode })
      .andWhere('pdm.company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.rqty ?? 0;
  }

  async getTotalMeterageofRequestsRepo(unitCode: string, companyCode: string, requestNumber: string[]): Promise<number> {
    const nonMrnRequest = 0;
    const result = await this.createQueryBuilder('pdm')
      .select('SUM(pdm.requested_quantity)', 'requestedQuantity')
      .andWhere('pdm.request_number IN (:request_number)', { request_number: requestNumber })
      .andWhere('pdm.mrn_id = :mrnId', { mrnId: nonMrnRequest })
      .andWhere('pdm.unit_code = :unitCode', { unitCode })
      .andWhere('pdm.company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.requestedQuantity ?? 0;
  }

  async getTotalRollsofRequestsRepo(unitCode: string, companyCode: string, requestNumber: string[]): Promise<number> {
    const nonMrnRequest = 0;
    const result = await this.createQueryBuilder('pdm')
      .select('count(*)', 'rolls')
      .andWhere('pdm.request_number IN (:request_number)', { request_number: requestNumber })
      .andWhere('pdm.mrn_id = :mrnId', { mrnId: nonMrnRequest })
      .andWhere('pdm.unit_code = :unitCode', { unitCode })
      .andWhere('pdm.company_code = :companyCode', { companyCode })
      .getRawOne();

    return result?.rolls ?? 0;
  }


}

