import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoLineEntity } from "../entities/po-line-entity";
import { PoSubLineEntity } from "../entities/po-sub-line-entity";
import { ProductSubLineFeaturesEntity } from "../entities/product-sub-line-features-entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { MoPoSubLineResp } from "./query-response/mo-po-sub-line.resp";

@Injectable()
export class PoLineRepository extends Repository<PoLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoLineEntity, dataSource.createEntityManager());
    }

    async getProcessingOrderFeatures(processingSerial: number, moId?: number, moLineId?: number, poLineId?: number,
        moPslId?: number) {
        const query = await this.createQueryBuilder('pl')
            .select(`GROUP_CONCAT(DISTINCT pl.mo_number) AS moNumber,GROUP_CONCAT(DISTINCT pl.mo_line_number) AS     moLineNumber
                ,GROUP_CONCAT(pslf.destination) AS destination,GROUP_CONCAT(pslf.delivery_date) AS planDeliveryDate
                ,GROUP_CONCAT(pslf.plan_prod_date) AS planProductionDate,GROUP_CONCAT(pslf.plan_cut_date) AS planCutDate,GROUP_CONCAT(pslf.style_name) AS styleName
                ,GROUP_CONCAT(pslf.style_description) AS styleDescription,GROUP_CONCAT(pslf.business_head) AS businessHead,GROUP_CONCAT(pslf.mo_creation_date) AS moCreationDate
                ,GROUP_CONCAT(pslf.mo_closed_date) AS moClosedDate,GROUP_CONCAT(pslf.ex_factory_date) AS exFactoryDate,GROUP_CONCAT(pslf.schedule) AS schedule,
                GROUP_CONCAT(z_feature) AS zFeature,GROUP_CONCAT(pslf.style_code) AS styleCode,GROUP_CONCAT(pslf.customer_code) AS customerCode,pslf.oq_type AS oqType`)
            .leftJoin(PoSubLineEntity, 'psl', 'psl.processing_serial = pl.processing_serial  AND psl.po_line_id = pl.id')
            .leftJoin(ProductSubLineFeaturesEntity, 'pslf', 'pslf.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .where(`pl.processing_serial = ${processingSerial}`)
            .groupBy('pl.id,psl.id,pslf.id');
        if (moId) {
            query.andWhere(`pl.mo_id = ${moId}`)
        }
        if (moLineId) {
            query.andWhere(`pl.mo_line_id = ${moLineId}`)
        }
        
        if (moPslId) {
            query.andWhere(`psl.mo_product_sub_line_id = ${moPslId}`)
        }

        return await query.getRawMany();
    }

    async getPSLTotalOrdQtyForMoNumbers(moNumbers: string[], unitCode: string, companyCode: String) {
        console.log(moNumbers)
        const query = await this.createQueryBuilder('psl')
            .select('SUM(posl.quantity) as quantity,posl.mo_product_sub_line_id as poslId')
            .leftJoin(PoSubLineEntity, 'posl', 'posl.po_line_id = psl.id')
            .where('psl.mo_number IN (:...moNumbers)', { moNumbers })
            .andWhere(`posl.company_code = '${companyCode}' and posl.unit_code = '${unitCode}'`)
            .groupBy('posl.mo_product_sub_line_id')
            .getRawMany();
        return query
    }


    async getMoWiseSubLineIdsForGivenPo(processingType: ProcessTypeEnum, processingSerial: number, unitCode: string, companyCode: string): Promise<MoPoSubLineResp[]> {
        return await this.createQueryBuilder('po_line')
            .select('po_line.mo_number, posl.mo_product_sub_line_id, posl.quantity')
            .leftJoin(PoSubLineEntity, 'posl', 'posl.po_line_id = po_line.id')
            .where(`po_line.unit_code = '${unitCode}' AND po_line.company_code = '${companyCode}' AND posl.is_active = true and po_line.processing_serial = ${processingSerial} AND po_line.process_type = '${processingType}'`)
            .groupBy('po_line.mo_number, posl.mo_product_sub_line_id')
            .getRawMany()
    }

    async getMoInfoForGivenPo(poRec: any): Promise<any[]> {
        console.log(poRec, 'poRec repo')
        const moInfoRecords = await this
            .createQueryBuilder("poLine")
            .select("poLine.moId", "moId")
            .addSelect(["poLine.moNumber as moNumber", "poLine.poId as poId"])
            .where("poLine.poId = :poId", { poId: poRec.id })
            .groupBy("poLine.moId")
            .getRawMany();
        return moInfoRecords
    }





}