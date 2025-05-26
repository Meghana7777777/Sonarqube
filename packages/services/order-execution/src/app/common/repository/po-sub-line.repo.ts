import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoSubLineEntity } from "../entities/po-sub-line-entity";
import { MC_ProductSubLineQtyModel, PO_StyleInfoModel, ProcessTypeEnum, ProductInfoModel, StyleProductCodeFgColor } from "@xpparel/shared-models";
import { ProductSubLineFeaturesEntity } from "../entities/product-sub-line-features-entity";
import { ProdColorSizeQtyResponse } from "./query-response/prod-color-size-qty.qry-resp";
import { PoLineEntity } from "../entities/po-line-entity";
import { ProductRefQryRes } from "./query-response/product-ref.qry.res";
import { PoSizeQtysQueryResponse } from "./query-response/po-size-qtys.query.response";

@Injectable()
export class PoSubLineRepository extends Repository<PoSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoSubLineEntity, dataSource.createEntityManager());
    }



    async getDistinctStyles(unitCode: string, companyCode: string): Promise<PO_StyleInfoModel[]> {
        return await this.createQueryBuilder('psl')
            .select('psl_f.style_code as styleCode, psl_f.style_name as styleName, psl_f.style_description as styleDescription')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .groupBy('psl_f.style_code, psl_f.style_name, psl_f.style_description')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true`)
            .getRawMany()
    }


    async getDistinctProductInfoForGivenStyle(styleCode: string, unitCode: string, companyCode: string): Promise<ProductInfoModel[]> {
        return await this.createQueryBuilder('psl')
            .select('psl_f.product_code as productCode, psl.product_type as productType, psl.product_name as productName')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .groupBy('psl_f.product_code, psl.product_type, psl.product_name')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl_f.is_active = true and psl_f.style_code = '${styleCode}'`)
            .getRawMany()
    }

    async getDistinctPoInfoForGivenStyleAndProduct(styleCode: string, productCode: string, unitCode: string, companyCode: string): Promise<number[]> {
        const qryResp: { processing_serial: number }[] = await this.createQueryBuilder('psl')
            .select('psl.processing_serial')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .groupBy('processing_serial')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true and psl_f.style_code = '${styleCode}' and psl_f.product_code = '${productCode}'`)
            .getRawMany()

        return qryResp.map(serial => Number(serial.processing_serial))
    }

    async getStyleProductCodeFgColorForPo(processingType: ProcessTypeEnum, processingSerial: number, unitCode: string, companyCode: string): Promise<StyleProductCodeFgColor[]> {
        //NOTE : fg_color added is select and group by 
        return await this.createQueryBuilder('psl')
            .select('psl.style_code as styleCode, psl.product_code as productCode, psl.product_name as productName, psl.product_type as productType,psl.fg_color as fgColor')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .groupBy('psl.style_code, psl.product_code, psl.product_name, psl.product_type,psl.fg_color')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true and psl.processing_serial = ${processingSerial} AND psl.process_type = '${processingType}'`)
            .getRawMany()
    }


    async getMoStyleProductCodeFgColorForPo(processingType: ProcessTypeEnum, processingSerial: number, unitCode: string, companyCode: string): Promise<StyleProductCodeFgColor[]> {
        return await this.createQueryBuilder('psl')
            .select('psl.style_code as styleCode, psl.product_code as productCode, psl.product_name as productName, psl.product_type as productType')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .groupBy('psl.style_code, psl.product_code, psl.product_name, psl.product_type')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true and psl.processing_serial = ${processingSerial} AND psl.process_type = '${processingType}'`)
            .getRawMany()
    }


    async getStyleProductFgColorPoQtyForPo(processingType: ProcessTypeEnum, processingSerial: number, unitCode: string, companyCode: string): Promise<ProdColorSizeQtyResponse[]> {
        return await this.createQueryBuilder('psl')
            .select('psl.style_code as styleCode, psl.product_code as productCode, psl.fg_color as fgColor, psl.size as size, SUM(psl.quantity)')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true and psl.processing_serial = ${processingSerial} AND psl.process_type = '${processingType}'`)
            .groupBy('psl.style_code, psl.product_code, psl.fg_color, psl.size')
            .getRawMany();
    }


    async getDistinctSizesForPoProductCodeAndFgColor(processingType: ProcessTypeEnum, processingSerial: number, productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<ProdColorSizeQtyResponse[]> {
        console.log(productCode, 'product code')
        return await this.createQueryBuilder('psl')
            .select('DISTINCT psl.size')
            .leftJoin(ProductSubLineFeaturesEntity, 'psl_f', 'psl_f.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .where(`psl.unit_code = '${unitCode}' AND psl.company_code = '${companyCode}' AND psl.is_active = true and psl.processing_serial = ${processingSerial} AND psl.process_type = '${processingType}'`)
            .andWhere(`psl_f.product_code = '${productCode}' AND psl_f.fg_color = '${fgColor}'`)
            .getRawMany();
        // cehck if this is correct or not regarding psl_f  columns 
    }


    async getSubLineWiseQuantitiesForPo(processingSerial: number, productRef: string, fgColor: string, size: string): Promise<MC_ProductSubLineQtyModel[]> {
        return await this.createQueryBuilder('subLine')
            .select('subLine.moProductSubLineId', 'moProductSubLineId')
            .addSelect('SUM(subLine.quantity)', 'quantity')
            .where('subLine.processingSerial = :processingSerial', { processingSerial })
            .andWhere('subLine.fgColor = :fgColor', { fgColor })
            .andWhere('subLine.size = :size', { size })
            .andWhere('subLine.productRef = :productRef', { productRef })
            .groupBy('subLine.moProductSubLineId')
            .orderBy('id')
            .getRawMany();
    }

    async getDistincProductsForPoLine(processingSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<ProductRefQryRes[]> {
        return await this.createQueryBuilder('psl')
            .select('DISTINCT psl.product_ref  as productRef,psl.product_code as productCode,psl.product_name as productName,psl.product_type as productType')
            .where('psl.processing_serial = :processingSerial', { processingSerial })
            .andWhere('psl.po_line_id = :poLineId', { poLineId })
            .andWhere('psl.company_code = :companyCode', { companyCode })
            .andWhere('psl.unit_code = :unitCode', { unitCode })
            .getRawMany();

    }

    async getPoSizeWiseQtys(poSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<PoSizeQtysQueryResponse[]> {
        return await this.createQueryBuilder('psl')
            .select('psl.size, quantity, oq_type, psl.id')
            .leftJoin(ProductSubLineFeaturesEntity, 'feat', 'feat.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .where(`psl.processing_serial = ${poSerial} AND po_line_id = ${poLineId} AND psl.company_code = '${companyCode}' AND psl.unit_code = '${unitCode}' `)
            .getRawMany();
    }



}