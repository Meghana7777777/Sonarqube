import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { LayerMeterageRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { MrnItemEntity } from "../entity/mrn-item.entity";
import moment from "moment";

@Injectable()
export class MrnItemRepository extends Repository<MrnItemEntity> {
    constructor(private dataSource: DataSource) {
        super(MrnItemEntity, dataSource.createEntityManager());
    }


    async getTotalRequestedQuantityTodayRepo(unitCode: string, companyCode: string, date: string): Promise<{totalRequestedQuantityToday :number, totalRequestedRequest :number, }> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const query = await this.createQueryBuilder('mrn')
            .select('SUM(mrn.requested_quantity) AS totalRequestedQuantityToday, count(distinct mrn.mrn_id) AS totalRequestedRequest')
            .where('mrn.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('mrn.unit_code = :unitCode', {     unitCode })
            .andWhere('mrn.company_code = :companyCode', { companyCode })
            .getRawOne();
        return query;
    }


}

