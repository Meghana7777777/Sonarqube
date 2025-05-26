import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemIssuanceEntity } from "../entities/ph-item-issuance.entity";
import { PhItemIssuanceQtyResp, PhItemIssuanceQtyResponse } from "./query-response/ph-item-issuance-qty.qry.resp";
import { WhMatRequestHeaderEntity } from "../../material-request-handling/entities/wh-mat-request-header.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";


@Injectable()
export class PhItemIssuanceRepo extends Repository<PhItemIssuanceEntity> {
    constructor(dataSource: DataSource) {
        super(PhItemIssuanceEntity, dataSource.createEntityManager());
    }

    /**
   * @param unitCode UNIT CODE
   * @param companyCode COMPANY CODE
   * @param phItemsId 
   * @returns
  */

    async getItemIssuanceQtyForItemId(unitCode: string, companyCode: string, phItemsId: Number): Promise<PhItemIssuanceQtyResp[]> {
        const issuedQty = await this.createQueryBuilder('ph_item_issuance')
            .select('SUM(ph_item_issuance.issued_quantity) AS issued_quantity, ph_item_issuance.issuing_entity AS issuing_entity')
            .where(`ph_item_issuance.unit_code = '${unitCode}' AND ph_item_issuance.company_code = '${companyCode}' AND ph_item_issuance.ph_item_line_id='${phItemsId}'`)
            .groupBy('ph_item_issuance.issuing_entity')
            .getRawMany();
        return issuedQty;
    };

    async getItemIssuanceQtyForDate(unitCode: string, companyCode: string, date: string): Promise<PhItemIssuanceQtyResponse> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const issuedQty = await this.createQueryBuilder('ph_item_issuance')
            .select('SUM(ph_item_issuance.issued_quantity) AS issuedQty, count(distinct ph_items_id) AS issuedRolls')
            .where(`ph_item_issuance.unit_code = '${unitCode}' AND ph_item_issuance.company_code = '${companyCode}'`)
            .andWhere('ph_item_issuance.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();
        return issuedQty;
    };

    async getIssuedItemsUnderIssuanceId(issuanceId: number, unitCode: string, companyCode: string) {
        const issuedQty: { ext_ref_id: number, item_code: string, issued_quantity: number, ph_item_line_id: number, barcode: string }[] = await this.createQueryBuilder('ph_item_issuance')
            .select('wh.ext_ref_id,pt.item_code,ph_item_issuance.issued_quantity,ph_item_issuance.ph_item_line_id,pil.barcode')
            .leftJoin(WhMatRequestHeaderEntity, 'wh', 'wh.id=ph_item_issuance.wh_req_id')
            .leftJoin(PhItemLinesEntity, 'pil', 'pil.id = ph_item_issuance.ph_item_line_id')
            .leftJoin(PhItemsEntity, 'pt', 'pt.`id`=pil.`ph_items_id`')
            .where(`ph_item_issuance.unit_code = '${unitCode}' AND ph_item_issuance.company_code = '${companyCode}' AND ph_item_issuance.issuance_id='${issuanceId}'`)
            .getRawMany();
        return issuedQty;
    }

    async getDistinctIssuanceIdsByExtRefNo(extRefNo: string, unitCode: string, companyCode: string) {
        const issuedIds: { issuanceId: number }[] = await this.createQueryBuilder('pii')
            .select('DISTINCT pii.issuance_id AS issuanceId')
            .where(`pii.unit_code = '${unitCode}' AND pii.company_code = '${companyCode}' AND pii.ext_req_no = '${extRefNo}'`)
            .getRawMany();
        return issuedIds;
    }
}

