import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoRatioEntity } from "../entity/po-ratio.entity";

@Injectable()
export class PoRatioRepository extends Repository<PoRatioEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioEntity, dataSource.createEntityManager());
    }

    async getMaxRatioCodeForPo(poSerial: number, companyCode: string, unitCode: string): Promise<number> {
        const query: {ratio_code: number} = await this.createQueryBuilder('r')
        .select(` IF( MAX(ratio_code), MAX(ratio_code), 0) as ratio_code`)
        .where(` po_serial = ${poSerial} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
        .getRawOne();
        return query.ratio_code;
    }
}
