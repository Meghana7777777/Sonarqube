import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoRatioLineEntity } from "../entity/po-ratio-line.entity";
import { PoRatioFabricEntity } from "../entity/po-ratio-fabric.entity";
import { RatioProdFabQueryResponse } from "./query-response/ratio-prod-fab.query.response";

@Injectable()
export class PoRatioLineRepository extends Repository<PoRatioLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioLineEntity, dataSource.createEntityManager());
    }

    async getRatioIdsForPoAndProductName(poSerial: number, productName: string, companyCode: string, unitCode: string): Promise<number[]> {
        const ratioIds: number[] = [];
        const ratioIdsQuery : {ratio_id: number}[] = await this.createQueryBuilder('rl')
        .select(' DISTINCT rl.po_ratio_id as ratio_id ')
        .where(` rl.company_code = '${companyCode}' AND  rl.unit_code = '${unitCode}' AND rl.product_name = '${productName}' AND rl.po_serial = ${poSerial} `)
        .getRawMany();
        ratioIdsQuery.forEach(r => {
            ratioIds.push(r.ratio_id);
        });
        return ratioIds;
    }

    async getProductNameAndFabsForRatioId(poSerial: number, ratioId: number, companyCode: string, unitCode: string): Promise<RatioProdFabQueryResponse[]> {
        const prodAndFabsResponse : {product_name: string, item_code: string, fg_color: string}[] = await this.createQueryBuilder('rl')
        .select(' rl.product_name, fab.item_code, rl.color as fg_color')
        .leftJoin(PoRatioFabricEntity, 'fab', 'fab.company_code = rl.company_code AND fab.unit_code = rl.unit_code AND fab.po_ratio_line_id = rl.id')
        .where(` rl.company_code = '${companyCode}' AND  rl.unit_code = '${unitCode}' AND rl.po_ratio_id = ${ratioId} AND rl.po_serial = ${poSerial} `)
        .groupBy('rl.product_name, fab.item_code')
        .getRawMany();
        return prodAndFabsResponse;
    }
}
