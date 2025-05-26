import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OnFloorRollsEntity } from "../entity/on-floor-rolls.entity";
import { OnFloorConsumedQtyQueryResponse } from "./query-response/on-floor-consumed-qty.query.response";

@Injectable()
export class OnFloorRollsRepository extends Repository<OnFloorRollsEntity> {
    constructor(private dataSource: DataSource) {
        super(OnFloorRollsEntity, dataSource.createEntityManager());
    }


    async getOnFloorRollsTotalConsumedQty(companyCode: string, unitCode: string, rollIds: number[]): Promise<OnFloorConsumedQtyQueryResponse[]> {
        const query = this.createQueryBuilder('ofr')
        .select(` SUM(consumed_quantity) as consumed_qty, roll_barcode, roll_id `)
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND roll_id IN (:...rollIds)`, { rollIds: rollIds })
        .groupBy('roll_id');
        const result: OnFloorConsumedQtyQueryResponse[] = await query.getRawMany();
        return result;
    }
}

