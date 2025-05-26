import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoRatioFabricEntity } from "../entity/po-ratio-fabric.entity";
import { PoRatioLineEntity } from "../entity/po-ratio-line.entity";

@Injectable()
export class PoRatioFabricRepository extends Repository<PoRatioFabricEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioFabricEntity, dataSource.createEntityManager());
    }

    async getRatioIdsForPoAndItemCode(poSerial: number, itemCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        const ratioIds: number[] = [];
        const ratioIdsQuery : {ratio_id: number}[] = await this.createQueryBuilder('rf')
        .select(' DISTINCT rl.po_ratio_id as ratio_id ')
        .leftJoin(PoRatioLineEntity, 'rl', 'rl.company_code = rf.company_code AND rl.unit_code = rf.unit_code AND rl.id = rf.po_ratio_line_id')
        .where(` rf.company_code = '${companyCode}' AND  rf.unit_code = '${unitCode}' AND rf.item_code = '${itemCode}' AND rf.po_serial = ${poSerial} `)
        .getRawMany();
        ratioIdsQuery.forEach(r => {
            ratioIds.push(r.ratio_id);
        });
        return ratioIds;
    }

    async getRatioLineIdsForPoAndItemCode(poSerial: number, itemCode: string, companyCode: string, unitCode: string): Promise<number[]> {
        const ratioLineIds: number[] = [];
        const ratioLeineIdsQuery : {po_ratio_line_id: number}[] = await this.createQueryBuilder('rf')
        .select(' DISTINCT po_ratio_line_id as po_ratio_line_id ')
        .where(` rf.company_code = '${companyCode}' AND  rf.unit_code = '${unitCode}' AND rf.item_code = '${itemCode}' AND rf.po_serial = ${poSerial} `)
        .getRawMany();
        ratioLeineIdsQuery.forEach(r => {
            ratioLineIds.push(r.po_ratio_line_id);
        });
        return ratioLineIds;
    }
}
