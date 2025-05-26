import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketLayEntity } from "../entity/po-docket-lay.entity";
import { PoDocketLayItemEntity } from "../entity/po-docket-lay-item.entity";
import { PoDocketLayDowntimeEntity } from "../entity/po-docket-lay-downtime.entity";

@Injectable()
export class PoDocketLayDowntimeRepository extends Repository<PoDocketLayDowntimeEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketLayDowntimeEntity, dataSource.createEntityManager());
    }
    
    
    async getLastDownTimeRecordForLayId(layId: number, unitCode: string, companyCode: string): Promise<PoDocketLayDowntimeEntity> {
        return await this.createQueryBuilder('lay_down_time')
        .where(`po_docket_lay_id = '${layId}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        .orderBy('created_at', 'DESC')
        .limit(0)
        .getOne();
    }

}

