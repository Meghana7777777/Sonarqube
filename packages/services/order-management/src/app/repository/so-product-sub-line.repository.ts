import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { SoProductSubLineEntity } from "../entity/so-product-sub-line.entity";
import { StyleProductCodeFgColorRequest, StyleProductRequest } from "@xpparel/shared-models";

@Injectable()
export class SoProductSubLineRepository extends Repository<SoProductSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(SoProductSubLineEntity, dataSource.createEntityManager());
    }

    /**
     * 
     * @param soNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
     */
    async getStyleProductTypeInfoForSO(soNumber: string, unitCode: string, companyCode: string): Promise<StyleProductRequest[]> {
        return await this.createQueryBuilder('psl')
            .select('style_code as styleCode, product_type as productType')
            .where(`so_number = '${soNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .groupBy('product_type, style_code')
            .getRawMany()
    }

    /**
     * 
     * @param soNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
     */
    async getStyleProductCodeFgColorInfoForSO(soNumber: string, unitCode: string, companyCode: string): Promise<StyleProductCodeFgColorRequest[]> {
        return await this.createQueryBuilder('psl')
            .select('style_code as styleCode, product_code as productCode, fg_color as fgColor')
            .where(`so_number = '${soNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .groupBy('product_code, style_code,fg_color')
            .getRawMany()
    }

}