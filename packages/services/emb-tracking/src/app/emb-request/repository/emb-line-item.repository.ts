import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbHeaderEntity } from "../entity/emb-header.entity";
import { EmbLineItemEntity } from "../entity/emb-line-item.entity";
import { SizeQtyQueryResponse } from "./query-response/size-qty.query.response";

@Injectable()
export class EmbLineItemRepository extends Repository<EmbLineItemEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbLineItemEntity, dataSource.createEntityManager());
    }

    async getEmbLineQtyForEmbLineId(poSerial: number, embLineId: number, companyCode: string, unitCode: string): Promise<SizeQtyQueryResponse[]> {
        const records = await this.createQueryBuilder('line')
        .select(` SUM(quantity) as quantity, size, count(1) as bundle_count `)
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND po_serial = ${poSerial} AND emb_line_id = ${embLineId} AND is_active = true`)
        .groupBy(` size `)
        .getRawMany();
        // type cast the SUM() to numbers
        records.forEach(r => {
            r.bundle_count = Number(r.bundle_count);
            r.quantity = Number(r.quantity);
        });
        return records;
    }

}

