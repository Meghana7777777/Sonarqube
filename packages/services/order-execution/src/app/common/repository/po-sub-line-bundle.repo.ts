import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSerialsEntity } from "../entities/po-serials-entity";
import { PoSubLineBundleEntity } from "../entities/po-sub-line-bundle.entity";
import { ProductSubLineFeaturesEntity } from "../entities/product-sub-line-features-entity";

@Injectable()
export class PoSubLineBundleRepository extends Repository<PoSubLineBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(PoSubLineBundleEntity, dataSource.createEntityManager());
    }


    async getAccumulatedColSizeQtysForPslIdsAndProcSerial(procSerial: number, pslIds: number[], companyCode: string, unitCode: string): Promise<AccumulatedColSizeWiseQtysForPslIdsProcSerialQueryResponse[]> {
        const query = this.createQueryBuilder('bun')
        .select(`psl.fg_color, psl.size, count(bun.bundle_number) as total_bundles, SUM(bun.quantity) as qty, SUM(if(confirmation_id > 0, 1, 0)) as confirmed_bundles, SUM(if(confirmation_id > 0, bun.finalized_quantity, 0)) as confirmed_qty`)
        .where(`bun.company_code = '${companyCode}' and bun.unit_code = '${unitCode}' AND bun.processing_serial = ${procSerial} AND bun.mo_product_sub_line_id IN(:...psls)`, {psls: pslIds})
        .leftJoin(ProductSubLineFeaturesEntity, 'psl', 'psl.company_code = bun.company_code AND psl.unit_code = bun.unit_code AND psl.mo_product_sub_line_id = bun.mo_product_sub_line_id')
        .groupBy(`psl.fg_color, psl.size`);
        const result: AccumulatedColSizeWiseQtysForPslIdsProcSerialQueryResponse[] = await query.getRawMany();
        return result;
    }
}

export interface AccumulatedColSizeWiseQtysForPslIdsProcSerialQueryResponse {
    fg_color: string;
    size: string;
    total_bundles: number;
    qty: number;
    confirmed_bundles: number;
    confirmed_qty: number;
}