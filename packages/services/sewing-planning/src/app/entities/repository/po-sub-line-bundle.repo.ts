import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSubLineBundleEntity } from "../po-sub-line-bundle.entity";


@Injectable()
export class PoSubLineBundleRepository extends Repository<PoSubLineBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(PoSubLineBundleEntity, dataSource.createEntityManager());
    }


    async getMaxBundleQtyForGivenSubLineIds(subLineIds: number[], companyCode: string, unitCode: string) {
        const maxBunQtyResp : {maxBunQty: number} = await this.createQueryBuilder('line_bundle')
        .select('MAX(quantity) as maxBunQty')
         .where("line_bundle.mo_product_sub_line_id IN (:...moProductSubLineIds)", { moProductSubLineIds: subLineIds })
         .andWhere(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true`)
        .getRawOne();
        return maxBunQtyResp.maxBunQty ?? 0;
    }
}
