import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSubLineBundleEntity } from "../entity/po-sub-line-bundle.entity";

@Injectable()
export class PoSubLineBundleRepository extends Repository<PoSubLineBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(PoSubLineBundleEntity, dataSource.createEntityManager());
    }

    async getPendingBundlesForBundling(procSerial: number, pslIds: number[], companyCode: string, unitCode: string): Promise<PendingBundlesQueryResponse[]> {
        const query = this.createQueryBuilder('b')
        .select(`b.bundle_number, b.quantity, b.bundled_quantity, b.mo_product_sub_line_id as psl_id, total_abs`)
        .where(`b.company_code = '${companyCode}' and b.unit_code = '${unitCode}' AND b.processing_serial = ${procSerial} AND b.mo_product_sub_line_id IN(:...psls) AND b.bundled_quantity < b.quantity`, {psls: pslIds})
        .orderBy('b.bundle_number');
        return query.getRawMany();
    }
}

export class PendingBundlesQueryResponse {
    bundle_number: string;
    quantity: number;
    bundled_quantity: number;
    psl_id: number;
    total_abs: number;
}
