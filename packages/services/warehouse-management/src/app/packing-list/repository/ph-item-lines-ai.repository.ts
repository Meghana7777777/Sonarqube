import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemLinesAIEntity } from "../entities/ph-item-lines-ai.entity";
import { MaterialConsumptionEnum, RequestTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class PhItemLinesAiRepo extends Repository<PhItemLinesAIEntity> {
    constructor(dataSource: DataSource) {
        super(PhItemLinesAIEntity, dataSource.createEntityManager());
    }

    async getAllocatedAndIssuedQtyForGivenDate(date: string, unitCode: string, companyCode: string): Promise<{
        qty: number,
        request_type: MaterialConsumptionEnum
    }[]> {
        const qtyInfo: {
            qty: number,
            request_type: MaterialConsumptionEnum
        }[] = await this.createQueryBuilder('item_line_ai')
            .select('sum(consumed_quantity)as qty, request_type')
            .where(`date(consumed_on) = '${date}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .groupBy('request_type')
            .getRawMany();
        return qtyInfo;
    }
}