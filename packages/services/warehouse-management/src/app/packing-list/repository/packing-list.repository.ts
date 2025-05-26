import { Injectable } from "@nestjs/common";
import { GrnStatusEnum, PackListLoadingStatus, PhBatchLotRollRequest, PhItemCategoryEnum, PhLinesGrnStatusEnum } from "@xpparel/shared-models";
import { getChartData, PlInfo, SupplierData, SupplierWiseInfoResponse } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { PackingListEntity } from "../entities/packing-list.entity";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { PhLinesEntity } from "../entities/ph-lines.entity";
import { BatchLotItemQtyResp } from "./query-response/batch-lot-item-qty.qry.resp";
import { ItemLineInfoQueryResp } from "./query-response/item-line-info.qry.resp";
import { PackingListSummaryQueryResp } from "./query-response/packing-list-summary.qry.resp";
import { SupplierAndPLQryResp } from "./query-response/supplier-pl-info.qry.resp";

import { PhGrnEntity } from "../../grn/entities/ph-grn.entity";
import { GrnInfoQryResp } from "./query-response/grn-info.qry.response";


@Injectable()
export class PackingListRepo extends Repository<PackingListEntity> {
    constructor(dataSource: DataSource) {
        super(PackingListEntity, dataSource.createEntityManager());
    }

    /**
     * QUERY TO GET PACKING LIST BATCH, LOT , ITEM NO AND QTY AGAINST TO SUPPLIER CODE
     * @param supplierCode SUPPLIER PO CODE
     * @param unitCode UNIT CODE
     * @param companyCode COMPANY CODE
     * @returns GROUP BY BATCH, LOT , ITEM NO AND ITS QTY
    */
    async getPackingListIdRelatedQuantitiesForSPOCode(supplierCode: string, unitCode: string, companyCode: string): Promise<BatchLotItemQtyResp[]> {
        const queryRes = await this.createQueryBuilder('packing_list')
            .select('packing_list.id as packing_list_id, ph_line.batch_number, ph_line.lot_number,  item_code, SUM(ph_item_lines.s_quantity), packing_list.grn_status')
            .leftJoin(PhLinesEntity, 'ph_line', 'ph_line.ph_id = packing_list.id AND  ph_line.unit_code = packing_list.unit_code AND ph_line.company_code = packing_list.company_code')
            .leftJoin(PhItemsEntity, 'ph_line_items', 'ph_line_items.ph_lines_id = ph_line.id AND  ph_line_items.unit_code = ph_line.unit_code AND ph_line_items.company_code = ph_line.company_code')
            .leftJoin(PhItemLinesEntity, 'ph_item_lines', 'ph_item_lines.ph_items_id = ph_line_items.id AND  ph_item_lines.unit_code = ph_line_items.unit_code AND ph_item_lines.company_code = ph_line_items.company_code')
            .where(`packing_list.supplier_code = '${supplierCode}' AND packing_list.unit_code = '${unitCode}' AND packing_list.company_code = '${companyCode}'`)
            .groupBy('packing_list.id, ph_line.batch_number, ph_line.lot_number,  item_code, packing_list.grn_status')
            .getRawMany();

        console.log(queryRes)
        return queryRes;
    }

    /**
     * Query to get entire packing list details for supplier po number and phId or batch number or lot number or roll number 
     * @param supplierCode Its mandatory 
     * @param phId not mandatory
     * @param batchNumber  not mandatory
     * @param lotNumber not mandatory
     * @param rollNumber not mandatory
     * @param unitCode mandatory
     * @param companyCode mandatory
     * @returns Gives cascading details packing list header, packing list lines(batch), packing list items(lot), packing list item lines(Rolls)
    */
    async getPackingListEntireDetails(supplierCode: string, unitCode: string, companyCode: string, phId?: number, batchNumber?: string, lotNumber?: string, rollNumber?: string, itemCategory?: PhItemCategoryEnum): Promise<PackingListEntity[]> {
        const query = await this.createQueryBuilder('packing_list')
            .leftJoinAndSelect('packing_list.phLineInfo', 'ph_line')
            .leftJoinAndSelect('ph_line.phItemInfo', 'ph_line_items')
            .leftJoinAndSelect('ph_line_items.phItemLinesInfo', 'ph_item_lines')
            .where(`packing_list.unit_code = '${unitCode}' AND packing_list.company_code = '${companyCode}'`);
        if (supplierCode) {
            query.andWhere(`packing_list.supplier_code = '${supplierCode}'`)
        }
        if (phId) {
            query.andWhere(`packing_list.id = '${phId}'`)
        }
        if (batchNumber) {
            query.andWhere(`ph_line.batch_number = '${batchNumber}'`)
        }
        if (lotNumber) {
            query.andWhere(`ph_line.lot_number = '${lotNumber}'`)
        }
        if (rollNumber) {
            query.andWhere(`ph_item_lines.id = '${rollNumber}'`)
        }
        if (itemCategory) {
            query.andWhere(`ph_line_items.item_category = '${itemCategory}'`)
        }
        return await query.getMany();
    }

    /**
     * Query to get high level packing list summary for a given packing list header Id
     * @param unitCode 
     * @param companyCode 
     * @param phId 
     * @returns 
    */
    async getPackingListSummaryDetails(supplierCode: string, unitCode: string, companyCode: string, from: number, to: number, grnDateFrom: Date, grnDateTo: Date, packListIds: number[]): Promise<PackingListSummaryQueryResp[]> {
        const qry = this.createQueryBuilder('packing_list')
            .select(`packing_list.id,packing_list.pack_list_code,packing_list.pack_list_date, COUNT(DISTINCT ph_line.batch_number)as batch_count, COUNT(DISTINCT ph_line.lot_number)as lot_count,  COUNT(DISTINCT ph_item_lines.id) as roll_count, SUM(ph_item_lines.s_quantity) as s_quantity, ph_item_lines.i_q_uom, packing_list.grn_status AS grn_status, packing_list.inspection_status, packing_list.supplier_code, packing_list.delivery_date, GROUP_CONCAT(DISTINCT po_number) as po_numbers`)
            .leftJoin(PhLinesEntity, 'ph_line', 'ph_line.ph_id = packing_list.id AND  ph_line.unit_code = packing_list.unit_code AND ph_line.company_code = packing_list.company_code')
            .leftJoin(PhItemsEntity, 'ph_line_items', 'ph_line_items.ph_lines_id = ph_line.id AND  ph_line_items.unit_code = ph_line.unit_code AND ph_line_items.company_code = ph_line.company_code')
            .leftJoin(PhItemLinesEntity, 'ph_item_lines', 'ph_item_lines.ph_items_id = ph_line_items.id AND  ph_item_lines.unit_code = ph_line_items.unit_code AND ph_item_lines.company_code = ph_line_items.company_code')
            .where(`packing_list.unit_code = '${unitCode}' AND packing_list.company_code = '${companyCode}'`);
        if (supplierCode) {
            qry.andWhere(`packing_list.supplier_code = '${supplierCode}'`);
        }
        if (grnDateFrom && grnDateTo) {
            qry.andWhere(`packing_list.delivery_date between '${grnDateFrom}' AND '${grnDateTo}'`);
        }
        else {
            qry.andWhere(`packing_list.id IN (:...ids)`, { ids: packListIds });
        }
        qry.limit(to)
            .orderBy('packing_list.delivery_date', 'DESC')
            .groupBy(`packing_list.id`)//, ph_line_items.actual_uom, packing_list.grn_status, packing_list.inspection_status, packing_list.supplier_code, packing_list.delivery_date
        return await qry.getRawMany()

    }

    /**
     * Service to get packing list item information 
     * @param reqModel 
     * @returns 
    */
    async getPackingListItemLineInfo(reqModel: PhBatchLotRollRequest): Promise<ItemLineInfoQueryResp[]> {
        const query = this.createQueryBuilder('packing_list')
            .select('ph_item_lines.id AS roll_id, ph_item_lines.object_type, object_sys_no, s_width, s_length, s_shade, s_sk_length, s_sk_width, s_sk_group, gross_weight, qr_code,  ph_item_lines.i_q_uom,  s_quantity, allocated_quantity, issued_quantity, return_quantity, ph_item_lines.inspection_status, ph_item_lines.grn_status, is_released, inspection_pick, ph_items_id, ph_item_lines.print_status')
            .leftJoin('packing_list.phLineInfo', 'ph_line')
            .leftJoin('ph_line.phItemInfo', 'ph_line_items')
            .leftJoin('ph_line_items.phItemLinesInfo', 'ph_item_lines')
            .where(`packing_list.unit_code = '${reqModel.unitCode}' AND packing_list.company_code = '${reqModel.companyCode}'`);
        if (reqModel.phId) {
            query.andWhere(`packing_list.id = '${reqModel.phId}'`)
        }
        if (reqModel.batchNumber) {
            query.andWhere(`ph_line.batch_number = '${reqModel.batchNumber}'`)
        }
        if (reqModel.lotNumber) {
            query.andWhere(`ph_line.lot_number = '${reqModel.lotNumber}'`)
        }
        if (reqModel.rollNumber) {
            query.andWhere(`ph_item_lines.id = '${reqModel.rollNumber}'`)
        }
        query.groupBy('ph_item_lines.id, ph_item_lines.object_type, object_sys_no, s_width, s_length, s_shade, s_sk_length, s_sk_width, s_sk_group, gross_weight, qr_code,  ph_item_lines.i_q_uom,  s_quantity, allocated_quantity, issued_quantity, return_quantity, ph_item_lines.inspection_status, ph_item_lines.grn_status, is_released, inspection_pick, ph_items_id, ph_item_lines.print_status')
        return await query.getRawMany();
    }

    async checkIsLotExistForSupplier(supplierCode: string, unitCode: string, companyCode: string, lotNumber: string[]) {
        return await this.createQueryBuilder('packing_list')
            .leftJoin('packing_list.phLineInfo', 'ph_line')
            .where(`packing_list.supplier_code = '${supplierCode}' AND packing_list.unit_code = '${unitCode}' AND packing_list.company_code = '${companyCode}'`)
            .andWhere('ph_line.lot_number IN (:...lotNumber)', { lotNumber }).getCount();
    }

    async getPackListsYetToComeSupplierWise(supplierCode: string) {
        const queryData = this.createQueryBuilder('plh')
            .select(`COUNT(plh.pack_list_code) AS packListsCount`)
            .where(`plh.delivery_date IS NOT NULL AND plh.supplier_code = ${supplierCode}`)
        const result = await queryData.getRawMany()
        return result
    }
    /**
     * 
     * @param packingListId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
     */
    async getPackingListNumberById(packingListId: number, unitCode: string, companyCode: string): Promise<string> {
        const packingListCode: { pack_list_code: string } = await this.createQueryBuilder('packing_list')
            .select('pack_list_code')
            .where(`id = ${packingListId} AND unit_Code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
        return packingListCode ? packingListCode.pack_list_code : null;
    }

    async getFabricInwardDetails(startDate: string, endDate: string, unitCode: string, companyCode: string) {
        const queryBuilder = await this.createQueryBuilder('ph')
            .select(`date(pv.in_at) as inwardDate,pv.id AS InWardCode, ph.supplier_code AS supplierCode, ph.delivery_date AS deliveryDate, pimlines.po_number AS poNo, SUM(pimlines.s_quantity) AS rollQty, SUM(pimlines.net_weight) AS netWeight, SUM(pimlines.gross_weight) AS grossWeight, pv.cusdec_no AS cusdecNo, pv.vehicle_number AS vehicalNo,pv.invoice_no as invoiceNo, pv.container_no AS containerNo, pv.in_at AS vehicalArriveDate, DATE(pv.out_at) AS releaseDate, TIME(pv.out_at) AS releaseTime, pv.remarks AS remarks,date(ph.delivery_date) as deliveryDate`)
            .leftJoin(PhItemLinesEntity, 'pimlines', 'pimlines.ph_id = ph.id')
            .where(`date(pv.in_at) between '${startDate}' and '${endDate}' and pv.company_code = '${companyCode}' and pv.unit_code = '${unitCode}'`)
            .groupBy('ph.pack_list_code, ph.supplier_code, ph.delivery_date, pimlines.po_number, pv.cusdec_no, pv.vehicle_number, pv.container_no, pv.in_at, pv.out_at, pv.remarks')
            .orderBy('pv.id')
            .getRawMany();
        return queryBuilder

    }


    /**
     * 
     * @param phId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getSupplierDetailsByPhId(phId: number, uniCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
        return this.createQueryBuilder('plh')
            .select('supplier_name, supplier_code, pack_list_code, delivery_date')
            .where(`id = '${phId}' AND unit_code = '${uniCode}' AND company_code = '${companyCode}'`)
            .getRawOne()
    }


    async getSupplierWiseArrivalDetailsForGivenMonth(month: number, unitCode: string, companyCode: string): Promise<SupplierAndPLQryResp[]> {
        return this.createQueryBuilder('plh')
            .select('id, supplier_name, supplier_code, pack_list_code, delivery_date')
            .where(`MONTH(delivery_date) = ${month} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .groupBy('supplier_name, supplier_code, pack_list_code, delivery_date')
            .getRawMany();
    }

    async getPackListInfo(unitCode: string, companyCode: string): Promise<any> {
        return this.createQueryBuilder('packing_list')
            .select('id as phId, pack_list_code as phCode')
            .where(`unit_Code = '${unitCode}' AND company_code = '${companyCode}' AND is_active=true`)
            .getRawMany();
    }

    async getSupplierWiseInfo(unitCode: string, fromDate: string, toDate: string): Promise<SupplierWiseInfoResponse[]> {
        return await this.createQueryBuilder('packing_list')
            .select('supplier_code ,supplier_name , COUNT(DISTINCT id) as cnt,arrived,GROUP_CONCAT(DISTINCT id) Id')
            .where(`unit_Code = '${unitCode}' AND date(created_at) between '${fromDate}' and '${toDate}'`)
            .groupBy('supplier_code,arrived')
            .getRawMany();
    }

    async getPackListGrnUploadedInfo(unitCode: string, companyCode: string): Promise<number> {
        const result = await this.createQueryBuilder('packing_list')
            .select('COUNT(packing_list.id)', 'cnt') // Use aliasing for clarity
            .where('packing_list.unit_Code = :unitCode', { unitCode })
            .andWhere('packing_list.company_code = :companyCode', { companyCode })
            .andWhere('packing_list.is_active = :isActive', { isActive: true })
            .getRawOne();

        // Return the count or 0 if no result
        return result?.cnt || 0;
    }
    async getPackListGrnUploadedInfoByDate(unitCode: string, companyCode: string, selectedDate: string): Promise<number> {
        // Calculate the start and end of the day for the selectedDate
        const startDate = `${selectedDate} 00:00:00`;
        const endDate = `${selectedDate} 23:59:59`;

        const totPacklistToday: { cnt: number } = await this.createQueryBuilder('packing_list')
            .select(['COUNT(packing_list.id) AS cnt'])
            .where('packing_list.unit_Code = :unitCode', { unitCode })
            .andWhere('packing_list.company_code = :companyCode', { companyCode })
            .andWhere('packing_list.is_active = :isActive', { isActive: true })
            .andWhere('packing_list.createdAt BETWEEN :start AND :end', {
                start: startDate,
                end: endDate,
            })
            .getRawOne();
        return totPacklistToday.cnt;
    }

    async getPackListGrnOpenInfo(unitCode: string, companyCode: string): Promise<GrnInfoQryResp[]> {
        return this.createQueryBuilder('packing_list')
            .select(`packing_list.id as phId, pack_list_code as phCode, pack_list_date,  SUM(IF(ph_item_lines.grn_status = '${PhLinesGrnStatusEnum.DONE}', 1, 0)) AS done_count,SUM(IF(ph_item_lines.grn_status = 'OPEN', 1, 0)) AS open_count, packing_list.updated_user, packing_list.grn_status, IF(pv.status = '${PackListLoadingStatus.UN_LOADING_COMPLETED}', count(ph_item_lines.id),0) as unloaded_roll_count, pv.unload_complete_at, ph_grn.grn_date, packing_list.supplier_name, GROUP_CONCAT(ph_items.item_style) as style`)
            .leftJoin(PhLinesEntity, 'ph_line', 'ph_line.ph_id = packing_list.id AND  ph_line.unit_code = packing_list.unit_code AND ph_line.company_code = packing_list.company_code')
            .leftJoin(PhItemsEntity, 'ph_items', 'ph_items.ph_lines_id = ph_line.id AND  ph_items.unit_code = ph_line.unit_code AND ph_items.company_code = ph_line.company_code')
            .leftJoin(PhItemLinesEntity, 'ph_item_lines', 'ph_item_lines.ph_items_id = ph_items.id AND  ph_item_lines.unit_code = ph_items.unit_code AND ph_item_lines.company_code = ph_items.company_code')
            .leftJoin(PhGrnEntity, 'ph_grn', 'ph_grn.ph_id = packing_list.id AND ph_grn.unit_code = packing_list.unit_code AND ph_grn.company_code = packing_list.company_code')
            .where(`packing_list.unit_Code = '${unitCode}' AND packing_list.company_code = '${companyCode}' AND packing_list.is_active=true AND packing_list.grn_status <> '${GrnStatusEnum.GRN_CONFIRMED}'`)
            .groupBy('packing_list.id')
            .getRawMany();
    }





    async getFabricInwardRepo(unitCode: string, companyCode: string, poNumbersInfo: string[], supplier: string[], startDate: string, endDate: string, itemCodeGroup: boolean) {
        const queryBuilder = this.createQueryBuilder('ph')
            .select(`pv.id AS InWardCode,ph.grn_status AS grnStatus, ph.pack_list_code AS packListCode, ph.supplier_code AS supplierCode, ph.delivery_date AS deliveryDate,plines.invoice_number AS phInvNumber, pimlines.po_number AS poNo, COUNT(pimlines.id) AS rolls, SUM(pimlines.i_quantity) AS packRollQty, SUM(IF(pimlines.grn_status = 'DONE', pimlines.i_quantity, 0)) AS grnQty, SUM(IF(pimlines.grn_status = 'DONE', 1, 0)) AS grnRolls, SUM(pimlines.net_weight) AS netWeight,
        SUM(pimlines.gross_weight) AS grossWeight, pv.cusdec_no AS cusdecNo, pv.vehicle_number AS vehicleNo, pv.invoice_no AS invoiceNo, pv.container_no AS containerNo,pv.in_at AS vehicleInDateAndTime, pv.out_at AS vehicleOutDateAndTime, DATE(pv.out_at) AS releaseDate, TIME(pv.out_at) AS releaseTime, pv.remarks AS remarks, DATE(ph.delivery_date) AS deliveryDate`)
            .leftJoin(PhLinesEntity, 'plines', 'plines.company_code = ph.company_code AND plines.unit_code = ph.unit_code AND plines.ph_id = ph.id')
            .leftJoin(PhItemsEntity, 'pitems', 'pitems.company_code = plines.company_code AND pitems.unit_code = plines.unit_code AND pitems.ph_lines_id = plines.id')
            .leftJoin(PhItemLinesEntity, 'pimlines', 'pimlines.company_code = plines.company_code AND pimlines.unit_code = plines.unit_code AND pimlines.ph_items_id = pitems.id')
            .where(`ph.company_code='${companyCode}' and ph.unit_code='${unitCode}'`)
        if (supplier.length) {
            queryBuilder.andWhere(`ph.supplier_code in (:...supplierCode)`, { supplierCode: supplier })
        }

        if (poNumbersInfo.length) {
            queryBuilder.andWhere(`pimlines.po_number in (:...poData)`, { poData: poNumbersInfo })
        }

        if (startDate && endDate) {
            queryBuilder.andWhere(`Date(pv.in_at) between '${startDate}' and '${endDate}'`)
        }

        if (itemCodeGroup) {
            queryBuilder.groupBy('ph.pack_list_code,pimlines.po_number')
        } else {
            queryBuilder.groupBy('ph.pack_list_code,pimlines.po_number')
        }
        queryBuilder.orderBy('ph.pack_list_code,pimlines.po_number')
        return await queryBuilder.getRawMany();
    }


    async getSupplierWiseDataByPackingListId(phid: number, unitCode: string): Promise<SupplierData[]> {

        const supInfo = await this.createQueryBuilder('packing_list')
            .select('packing_list.pack_list_code, ph_items.item_code as itemCode, ph_items.item_category, packing_list.delivery_date, packing_list.arrived, ph_items.id')
            .leftJoin(PhLinesEntity, 'ph_lines', 'ph_lines.ph_id = packing_list.id')
            .leftJoin(PhItemsEntity, 'ph_items', 'ph_items.ph_lines_id = ph_lines.id')
            .where('packing_list.id = :phid AND packing_list.unit_code = :unitCode AND ph_items.item_category = :itemCategory', {
                phid,
                unitCode,
                itemCategory: 'FABRIC'
            })
            .groupBy('packing_list.pack_list_code, ph_items.item_code')
        //  .getRawMany();
        //   console.log('testing',supInfo.getSql());

        const supInfoQ = await supInfo.getRawMany();

        return supInfoQ;
    }

    async getDeliveryCount(fromDate: string, toDate: string, groupinfo: string): Promise<getChartData[]> {

        let dateFormat: string;

        // Dynamically set the date format based on the group value
        switch (groupinfo) {
            case 'day':
                dateFormat = 'DATE(packing_list.deliveryDate)';
                break;
            case 'week':
                dateFormat = 'WEEK(packing_list.deliveryDate)'; // MySQL uses WEEK()
                break;
            case 'month':
                dateFormat = 'MONTH(packing_list.deliveryDate)';
                break;
            case 'year':
                dateFormat = 'YEAR(packing_list.deliveryDate)';
                break;
            default:
                throw new Error('Invalid group option');
        }

        const queryBuilder = await this
            .createQueryBuilder('packing_list')
            .select(`${dateFormat}`, 'deliveryDate')
            .addSelect('COUNT(*)', 'count')
            .where(`date(delivery_date) between '${fromDate}' and '${toDate}'`)
            .groupBy(`${dateFormat}`)
        console.log(queryBuilder.getSql());
        const result = await queryBuilder.getRawMany();

        return result;
    }


    async getPackingListInfoForPo(poNos: string[]): Promise<PlInfo[]> {
        //console.log(poNo);
        //const poNos = ['PO123', 'PO456', 'PO789'];
        const queryBuilder = await this.createQueryBuilder('ph')
            .select('COUNT(DISTINCT ph.`id`) AS packingListCount,GROUP_CONCAT(DISTINCT ph.`id`) AS plIds, ph.`supplier_name` as supplierName, phil.`po_number` as poNumber ')
            .leftJoin(PhLinesEntity, 'pl', 'pl.`ph_id` = ph.`id` ')
            .leftJoin(PhItemsEntity, 'pii', 'pii.`ph_lines_id` = pl.`id`')
            .leftJoin(PhItemLinesEntity, 'phil', 'phil.`ph_items_id` = pii.`id`')
            //.where('phil.po_number = :poNo', { poNo }) 
            .where('phil.po_number IN (:...poNos)', { poNos })
            .groupBy('phil.`po_number`, ph.`supplier_name`')
            .getRawMany();

        return queryBuilder;
    }

}

