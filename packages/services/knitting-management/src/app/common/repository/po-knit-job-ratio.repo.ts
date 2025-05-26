import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobRatioEntity } from "../entities/po-knit-job-ratio-entity";
import { PoKnitJobRatioLineEntity } from "../entities/po-knit-job-ratio-line-entity";
import { PoProductEntity } from "../entities/po-product-entity";
import { PoKnitJobRatioSubLineEntity } from "../entities/po-knit-job-ratio-sub-line-entity";
import { ProdColorSizeConStatus } from "./query-response/prod-size-qty-con-status.qry-resp";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class PoKnitJobRatioRepository extends Repository<PoKnitJobRatioEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobRatioEntity, dataSource.createEntityManager());
    }

    /**
     * Repository method to get the knit ratio generated quantity group by knit ration confirmation status
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getKnitTotalKnitRatioQtyForPoAndKGGroupByConStatus(knitGroupCode: string, processingSerial: number, unitCode: string, companyCode: string, processType: ProcessTypeEnum): Promise<ProdColorSizeConStatus[]> {
        return await this.createQueryBuilder('ratio')
            .select('jobs_confirm_status, SUM(ratio_sub_line.quantity)as quantity, po_product.product_code, ratio_sub_line.size, ratio_sub_line.fg_color')
            .leftJoin(PoProductEntity, 'po_product', 'po_product.product_ref = ratio.product_ref AND po_product.company_code = ratio.company_code AND po_product.unit_code = ratio.unit_code AND po_product.processing_serial = ratio.processing_serial ')
            .leftJoin(PoKnitJobRatioLineEntity, 'ratio_line', 'ratio.id = ratio_line.po_knit_job_ratio_id AND ratio_line.company_code = ratio.company_code AND ratio_line.unit_code = ratio.unit_code')
            .leftJoin(PoKnitJobRatioSubLineEntity, 'ratio_sub_line', 'ratio_sub_line.po_knit_job_ratio_line_id = ratio_line.id AND ratio_sub_line.company_code = ratio_line.company_code AND ratio_sub_line.unit_code = ratio_line.unit_code')
            .where(`ratio.processing_serial = '${processingSerial}' AND ratio.unit_code = '${unitCode}' AND ratio.company_code = '${companyCode}' AND ratio.group_code = '${knitGroupCode}' AND ratio.is_active = true AND ratio.process_type = '${processType}'`)
            .groupBy('jobs_confirm_status, po_product.product_code, ratio_sub_line.size, ratio_sub_line.fg_color')
            .getRawMany()
    }

    async getRatioInfoByProductFgColor(processingSerial: number, unitCode: string, companyCode: string, processType: ProcessTypeEnum, productCode: string, fgColor: string): Promise<PoKnitJobRatioEntity[]> {
        return await this.createQueryBuilder('ratio')
        .leftJoin(PoProductEntity, 'po_product', 'po_product.product_ref = ratio.product_ref AND po_product.company_code = ratio.company_code AND po_product.unit_code = ratio.unit_code AND po_product.processing_serial = ratio.processing_serial ')
        .leftJoin(PoKnitJobRatioLineEntity, 'ratio_line', 'ratio.id = ratio_line.po_knit_job_ratio_id AND ratio_line.company_code = ratio.company_code AND ratio_line.unit_code = ratio.unit_code')
        .leftJoin(PoKnitJobRatioSubLineEntity, 'ratio_sub_line', 'ratio_sub_line.po_knit_job_ratio_line_id = ratio_line.id AND ratio_sub_line.company_code = ratio_line.company_code AND ratio_sub_line.unit_code = ratio_line.unit_code')
        .where(`ratio.processing_serial = '${processingSerial}' AND ratio.unit_code = '${unitCode}' AND ratio.company_code = '${companyCode}' AND ratio.is_active = true AND ratio.process_type = '${processType}'`)
        .andWhere(`po_product.product_code = '${productCode}' AND ratio_sub_line.fg_color = '${fgColor}'`)
        .getMany();
    }


    async getKgWiseColorSizeWiseTotalRatioForProcSerialProductRefAndColor(procSerial: number, prodRefs: string[], fgColors: string[], unitCode: string, companyCode: string): Promise<KgProdColorSizeWiseRatioTotalsQueryResponse[]> {
        const query = this.createQueryBuilder('r')
        .select(`r.group_code as knit_group, r.product_ref, rsl.fg_color, rsl.size, SUM(quantity) as total_ratio `)
        .leftJoin(PoKnitJobRatioLineEntity, 'rl', 'r.id = rl.po_knit_job_ratio_id AND rl.company_code = r.company_code AND rl.unit_code = r.unit_code')
        .leftJoin(PoKnitJobRatioSubLineEntity, 'rsl', 'rsl.po_knit_job_ratio_line_id = rl.id AND rsl.company_code = rl.company_code AND rsl.unit_code = rl.unit_code')
        .where(`r.processing_serial = ${procSerial} AND r.unit_code = '${unitCode}' AND r.company_code = '${companyCode}' AND r.is_active = true AND r.process_type = '${ProcessTypeEnum.KNIT}'`);
        if(prodRefs.length) {
            query.andWhere(`r.product_ref IN(:...pRefs)`, {pRefs: prodRefs});
        }
        if(fgColors.length) {
            query.andWhere(`rsl.fg_color IN(:...cols)`, {cols: fgColors});
        }
        query.groupBy(`r.group_code, r.product_ref, rsl.fg_color, rsl.size`);
        return await query.getRawMany();
    }
}

export interface KgProdColorSizeWiseRatioTotalsQueryResponse {
    knit_group: string; // knit group
    product_ref: string; // product ref
    fg_color: string;
    size: string;
    total_ratio: number;
}
