import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CutTableIdRequest, DocketGroupResponseModel, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketCutTableEntity } from "../entity/po-docket-cut-table.entity";
import { promises } from "dns";

@Injectable()
export class PoDocketCutTableRepository extends Repository<PoDocketCutTableEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketCutTableEntity, dataSource.createEntityManager());
    }


    async getMaxPriorityForWorkstationId(workstationId: string, companyCode: string, unitCode: string): Promise<number> {
        const maxPriority: { priority: number } = await this.createQueryBuilder('ctp')
            .select(` MAX(priority) as priority`)
            .where(` resource_id = ${workstationId} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
            .getRawOne();
        return Number(maxPriority.priority);
    }

    async getTotalDocketsPlannedToday(unitCode: string, companyCode: string, date: string): Promise<{reqNumber: string, docGroup: string}[]> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const result = await this.createQueryBuilder('pdct')
        .select('pdct.request_number as reqNumber, pdct.docket_group as docGroup')
        .where('pdct.planned_date_time BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('unit_code = :unitCode', { unitCode })
        .andWhere('company_code = :companyCode', { companyCode })
        .groupBy('pdct.request_number')
        .getRawMany();
        return result;
    }

    async getTotalDocketsToday(unitCode: string, companyCode: string, date: string): Promise<{ requestNumber: string }[]> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const result = await this.createQueryBuilder('pdct')
            .select('DISTINCT pdct.request_number as requestNumber')
            .where('pdct.mat_fulfill_date_time BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('unit_code = :unitCode', { unitCode })
            .andWhere('company_code = :companyCode', { companyCode })
            .getRawMany();
        return result;
    }
    async getPlannedDocketRepo(startDate: string,endDate: string,companyCode: string,unitCode: string) {
        const queryBuilder = this.createQueryBuilder('pdct')
          .select(['pdct.remarks AS remark','pdct.request_number AS requestNumber','pdct.resource_desc AS resourceDesc','pdct.planned_date_time AS plannedDateTime','pdct.mat_request_on AS materialRequestOn','pdct.mat_fulfill_date_time AS matFullfillDateTime','pdct.docket_group AS docketGroup',
          ])
          .where('pdct.company_code = :companyCode AND pdct.unit_code = :unitCode AND DATE(pdct.planned_date_time) BETWEEN :startDate AND :endDate',
            {companyCode,unitCode,startDate,endDate})
          .orderBy('pdct.planned_date_time', 'DESC');
      
        return await queryBuilder.getRawMany();
      }

  

}

