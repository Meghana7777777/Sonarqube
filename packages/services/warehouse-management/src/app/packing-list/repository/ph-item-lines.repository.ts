import { Injectable } from "@nestjs/common";
import { InsInspectionStatusEnum, PackListLoadingStatus, PhLinesGrnStatusEnum, Stages } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { PackingListEntity } from "../entities/packing-list.entity";
import { PhItemLinesActualEntity } from "../entities/ph-item-lines-actual.entity";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { PhLinesEntity } from "../entities/ph-lines.entity";
import { GrnRollInfoQryResp } from "./query-response/grn-roll-info.qry.resp";
import { BasicRollInfoQryResp } from "./query-response/roll-basic-info.qry.resp";
import { RollMoAbtractInfoQueryResponse } from "./query-response/roll-mo-abtsract-info.query.response";
import { ManufacturingOrderItemResponse, SupplierAndPLQryResp, TotalRollInformation } from "./query-response/supplier-pl-info.qry.resp";

@Injectable()
export class PhItemLinesRepo extends Repository<PhItemLinesEntity> {
    constructor(dataSource: DataSource) {
        super(PhItemLinesEntity, dataSource.createEntityManager());
    }

    /**
     * Service to get roll grn info for roll Id
     * @param rollId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    // async getPONumbersByPhId(ph_id: number): Promise<string[]> {
    //     try {
    //         const poNumbers = this
    //             .createQueryBuilder("ph_item_lines")
    //             .select("po_number")
    //             .where("ph_id = :ph_id", { ph_id })
    //             .getMany();

    //         return (await poNumbers).map((po) => po.poNumber);
    //     } catch (error) {
    //         console.error("Error fetching PO numbers from DB:", error);
    //         throw new Error("Failed to fetch PO numbers");
    //     }
    // }

    async getPONumbersByPhId(phId: number): Promise<string[]> {
        const poNumbers = await this
            .createQueryBuilder("ph_item_lines")
            .select("distinct po_number")
            .where("ph_id = :phId", { phId })
            .getRawMany();
        return poNumbers.map(po => po.po_number);
    }



    async getGrnRollInfoForRollId(rollId: number, uniCode: string, companyCode: string): Promise<GrnRollInfoQryResp> {
        return await this.createQueryBuilder('ph_line_items')
            .select('ph_line.ph_id, s_length, object_ext_no as roll_number, s_width, s_shade, gsm, measured_width, barcode')
            .leftJoin('ph_line_items.phItemId', 'ph_item')
            .leftJoin('ph_item.phLinesId', 'ph_line')
            .where(`ph_line_items.id = '${rollId}' AND ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne()
    }

    /**
    * Service to get roll grn info for roll Id
    * @param rollId 
    * @param uniCode 
    * @param companyCode 
    * @returns 
   */
    async getBasicRollInfoForRollId(rollId: number, uniCode: string, companyCode: string): Promise<BasicRollInfoQryResp> {
        return await this.createQueryBuilder('ph_line_items')
            .select('barcode, object_ext_no, qr_code, lot_number, s_quantity as quantity, s_width, s_shade')
            // .leftJoin('ph_line_items.phItemId', 'ph_item')
            // .leftJoin('ph_item.phLinesId', 'ph_line')
            .where(`ph_line_items.id = '${rollId}' AND ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne()
    }

    /**
     * REPOSITORY TO GET ROLL ID BY BARCODE
     * @param barcode 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getRollIdByBarcode(barcode: string, uniCode: string, companyCode: string): Promise<number> {
        const qryResp: { roll_id: number } = await this.createQueryBuilder('ph_line_items')
            .select('id as roll_id')
            .where(`barcode = '${barcode}' AND ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne();
        return qryResp ? qryResp.roll_id : null;
    }

    async getRollIdsByBarcodes(barcodes: string[], uniCode: string, companyCode: string): Promise<number[]> {
        const qryResp: { roll_id: number }[] = await this.createQueryBuilder('ph_line_items')
            .select('id as roll_id')
            .where(`ph_line_items.barcode IN(:...barcodes)`, { barcodes })
            .andWhere(`ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawMany();
        return qryResp?.map(item => item.roll_id);
    }

    async getRollIdBarcodesMap(barcodes: string[], uniCode: string, companyCode: string): Promise<Map<string, number>> {
        const qryResp: { roll_id: number, barcode: string }[] = await this.createQueryBuilder('ph_line_items')
            .select('id as roll_id,barcode')
            .where(`ph_line_items.barcode IN(:...barcodes)`, { barcodes })
            .andWhere(`ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawMany();
        const returnMap = new Map()
        qryResp.map(item => returnMap.set(item.barcode, item.roll_id));
        return returnMap;
    }

    /**
     * Repository to get ph item id by ph item line Id
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getPhItemIdByPhItemLineId(rollId: number, unitCode: string, companyCode: string): Promise<number> {
        const itemIdObj: { ph_items_id: number } = await this.createQueryBuilder('ph_line_items')
            .select('ph_items_id')
            .where(`ph_line_items.id = '${rollId}' AND ph_line_items.unit_code = '${unitCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne()
        return itemIdObj ? itemIdObj.ph_items_id : null;
    }

    /**
     * REPOSITORY TO GET ROLL QTY BY ROLL ID
     * @param barcode 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getRollQtyByRollId(rollId: number, uniCode: string, companyCode: string): Promise<number> {
        const qryResp: { quantity: number } = await this.createQueryBuilder('ph_line_items')
            .select('i_quantity as quantity')
            .where(`id = '${rollId}' AND ph_line_items.unit_code = '${uniCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne();
        return qryResp ? qryResp.quantity : null;
    }



    /**
     * Repository to get shade by lot number
     * @param lotNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getShadeByLotNumber(lotNumber: string, unitCode: string, companyCode: string): Promise<string> {
        const qryResp: { shade: string } = await this.createQueryBuilder('ph_line_items')
            .select('s_shade as shade')
            .leftJoin('ph_line_items.phItemId', 'ph_item')
            .leftJoin('ph_item.phLinesId', 'ph_line')
            .where(`ph_line.lot_number = '${lotNumber}' AND ph_line_items.unit_code = '${unitCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne();
        return qryResp ? qryResp.shade : null;
    }

    /**
     * Repository query to get roll count by batch no
     * @param batchNo 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getRollCountByPackListIdOrBatchNoOrLotNo(username: string, unitCode: string, companyCode: string, userId: number, batchNos: string[], packListId: number, lotNos: string[]): Promise<string[]> {
        const queryBuilder = this.createQueryBuilder('ph_line_items')
            .select('DISTINCT id as roll_id')
            .where('unit_code = :unitCode AND company_code = :companyCode', { unitCode, companyCode });

        if (batchNos.length) {
            queryBuilder.andWhere('batch_number IN (:...batchNos)', { batchNos });
        }
        if (lotNos.length) {
            queryBuilder.andWhere('lot_number IN (:...lotNos)', { lotNos });
        }
        if (packListId) {
            queryBuilder.andWhere('pack_list_id = :packListId', { packListId });
        }
        const qryRes: { roll_id: number }[] = await queryBuilder.getRawMany();

        return qryRes.map(res => res.roll_id.toString());
    }



    /**
     * 
     * @param phId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getRollIdsByPhId(phId: number, lotNumber: string, unitCode: string, companyCode: string): Promise<number[]> {
        const qryRes: { roll_id: number }[] = await this.createQueryBuilder('ph_line_items')
            .select('DISTINCT id as roll_id')
            .where(`ph_id = '${phId}' AND lot_number = '${lotNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawMany();
        return qryRes.map(res => res.roll_id);
    }

    /**
     * Repository to get material info for given packing list header Id
     * @param phId 
     * @param lotNumber 
     * @param unitCode 
     * @param companyCode 
    */
    async getMaterialInfoByPhId(phId: number, unitCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
        return await this.createQueryBuilder('ph_line_items')
            .select('count(ph_line_items.id) as no_of_rolls, GROUP_CONCAT(DISTINCT item_code) AS item_code, sum(net_weight)as supplier_given_weight')
            .leftJoin('ph_line_items.phItemId', 'ph_item')
            .where(`ph_id = '${phId}' AND ph_line_items.unit_code = '${unitCode}' AND ph_line_items.company_code = '${companyCode}'`)
            .getRawOne();

    }

    /**
     * Repository to get material info for given packing list header Id
     * @param phId 
     * @param lotNumber 
     * @param unitCode 
     * @param companyCode 
    */
    async getGRNCompletedMaterialInfoByPhId(phId: number, unitCode: string, companyCode: string): Promise<SupplierAndPLQryResp> {
        return await this.createQueryBuilder('ph_line_items')
            .select('count(ph_line_items.id) as no_of_rolls, GROUP_CONCAT(DISTINCT item_code) AS item_code, sum(net_weight)as supplier_given_weight')
            .leftJoin('ph_line_items.phItemId', 'ph_item')
            .where(`ph_id = '${phId}' AND ph_line_items.unit_code = '${unitCode}' AND ph_line_items.company_code = '${companyCode}' AND grn_status = '${PhLinesGrnStatusEnum.DONE}'`)
            .getRawOne();

    }


    /**
     * Repository to get material Stocket for given critieris
     * @param itemCode 
     * @param lotNumber 
     * @param batchNumber 
     * @param unitCode 
     * @param companyCode 
    */
    async getStockInformationAgainstToFilter(companyCode: string, unitCode: string, itemCode: string, batchNumber: string[], lotNumber: string[], poNumber: string[]): Promise<StockInfoQueryResp[]> {
        const query = await this.createQueryBuilder('pil')
            .select(`pil.ph_id AS packListId,pil.id AS objectId,pil.po_number AS poNumber,pil.inspection_pick AS inspectionPick,pil.object_type AS objectType,pil.object_ext_no AS supplierObjectNo,pil.i_quantity AS supQuantity, pil.i_q_uom AS iUom,pil.s_quantity AS intQuantity,pil.i_length AS supLength,pil.i_l_uom AS supLengthUom,pil.s_width AS intWidth,pil.i_w_uom AS supWidthUom, pil.s_length AS intLength,'METER' AS intLengthUom,pil.i_width AS supWidth,'CM' AS intWidthUom,pil.net_weight AS supNetWeight,pil.gross_weight AS supGrossWeight, pil.s_shade AS supShade,pil.gsm AS supGsm,pil.allocated_quantity AS allocatedQuantity,pil.return_quantity AS returnQuantity,pil.issued_quantity AS issuedQuantity, pil.barcode AS objectBarcode,pil.measured_width AS measuredWidth,pil.qr_code AS qrCode,pil.lot_number AS lotNumber,pil.batch_number AS batchNumber,pil.object_seq_no AS objectSequenceNumber, pila.grn_quantity AS objectGrnQuantity, pila.no_of_joins AS objectJoins,pila.a_width AS actWidth,pila.a_length AS actLength,pila.a_shade AS actShade,pila.a_shade_group AS actShadeGroup,pila.a_gsm AS actGsm,pila.a_weight AS actWeight,pt.item_code AS itemCode,pt.item_name AS itemName,pt.item_description AS itemDesc,pt.actual_uom AS supUOM,pt.preferred_uom AS actUom,pt.item_category AS itemCategory,pt.item_color AS itemColor,pt.item_style AS itemStyle,pt.item_size AS itemSize,pls.invoice_number AS invoiceNumber,ph.supplier_code AS supplierCode,ph.supplier_name AS supplierName,ph.description AS description,ph.pack_list_code AS packingListCode,pls.id as phlineId`)
            .leftJoin(PhItemLinesActualEntity, 'pila', 'pila.`company_code` = pil.`company_code` AND pila.`unit_code` = pil.`unit_code` AND pila.`ph_item_lines_id` = pil.`id`')
            .leftJoin(PhItemsEntity, 'pt', 'pt.`id`=pil.`ph_items_id`')
            .leftJoin(PhLinesEntity, 'pls', 'pls.`id`=pt.`ph_lines_id`')
            .leftJoin(PackingListEntity, 'ph', 'ph.`id`=pls.`ph_id`')
            .where(`pil.unit_code = '${unitCode}' AND pil.company_code = '${companyCode}' AND pil.grn_status = '${PhLinesGrnStatusEnum.DONE}' AND pt.item_code = '${itemCode}' AND pil.show_in_inventory=${true}`);
        if (batchNumber.length) {
            query.andWhere(`pil.batch_number IN(:...batchNumber)`, { batchNumber: batchNumber })
        }
        if (lotNumber.length) {
            query.andWhere(`pil.lot_number IN(:...lotNumber)`, { lotNumber: lotNumber })
        }
        if (poNumber.length) {
            query.andWhere(`pil.po_number IN(:...poNumber)`, { poNumber: poNumber })
        }
        return await query.getRawMany();
    }

    async getItemLevelQtyInfo(unitCode: string, companyCode: string, poNumbers: string[], itemCode: string[]): Promise<ManufacturingOrderItemResponse[]> {
        const queryBuilder = this.createQueryBuilder('pimlines')
            .select(`pt.item_code as itemCode, pt.item_name as itemName, pt.item_description as itemDesc, COUNT(pimlines.id) AS rolls, SUM(pimlines.i_quantity) AS packRollQty, SUM(IF(pimlines.grn_status = 'DONE', pimlines.i_quantity, 0)) AS grnQty, SUM(IF(pimlines.grn_status = 'DONE', 1, 0)) AS grnRolls,SUM(pimlines.allocated_quantity) as allocQty,SUM(pimlines.issued_quantity) as issueQty`)
            .leftJoin(PhItemsEntity, 'pt', 'pt.company_code=pimlines.company_code AND pt.unit_code=pimlines.unit_code AND pt.id=pimlines.ph_items_id')
            .where(`pimlines.company_code='${companyCode}' and pimlines.unit_code='${unitCode}' AND pimlines.show_in_inventory=${true} `)
        if (poNumbers.length) {
            queryBuilder.andWhere(`pimlines.po_number in (:...poNumber)`, { poNumber: poNumbers })
        }

        if (itemCode.length) {
            queryBuilder.andWhere(`pt.item_code in (:...itemCode)`, { itemCode: itemCode })
        }
        queryBuilder.groupBy('pt.item_code')
        queryBuilder.orderBy('pt.item_code')
        return await queryBuilder.getRawMany();
    }

    async getStagesForPackingListIds(phIds: string[], unitCode: string): Promise<Stages[]> {
        console.log("phIds:", phIds);
        const query = await this.createQueryBuilder('pil')
            .select('COALESCE(pv.ph_id, pil.ph_id) AS phId,COALESCE(pv.unit_code, pil.unit_code) AS unitCode')
            .addSelect(`
            CASE 
            WHEN pv.ph_id IS NULL THEN 'OPEN'
            WHEN pv.status = :outStatus THEN 'OUT - Security CheckOut'
            WHEN pv.status = :inStatus THEN 'IN - Security CheckIn'
            WHEN pv.status IN (:...unloadingStatuses) THEN CONCAT(pv.status, ' - Vehicle Unloading')
            ELSE 'NOT OUT - Security CheckOut'
           END AS vehicleStatus `)
            .addSelect(`
            CASE 
            WHEN COUNT(pil.ph_id) = 0 THEN 'Inspection Open'  
            WHEN COUNT(CASE WHEN pil.inspection_status = :inspOpen THEN 1 END) = COUNT(pil.ph_id) THEN 'Inspection Open'  
            WHEN COUNT(CASE WHEN pil.inspection_status = :inspCompleted  THEN 1 END) = COUNT(pil.ph_id) THEN 'Inspection Completed'  
            ELSE 'Inspection In Progress'  
            END AS inspectionStatus`)
            .addSelect(`
            CASE 
            WHEN COUNT(pil.ph_id) = 0 THEN 'GRN Open'  
            WHEN COUNT(CASE WHEN pil.grn_status = :grnOpen THEN 1 END) = COUNT(pil.ph_id) THEN 'GRN Open'  
            WHEN COUNT(CASE WHEN pil.grn_status = :grnCompleted THEN 1 END) = COUNT(pil.ph_id) THEN 'GRN Completed'  
            ELSE 'GRN In Progress'  
            END AS grnStatus`)
            .where('pil.ph_id IN (:...phIds)', { phIds })
            .andWhere('pil.unit_code = :unitCode', { unitCode: unitCode })
            .setParameters({
                outStatus: PackListLoadingStatus.OUT,
                inStatus: PackListLoadingStatus.IN,
                unloadingStatuses: [
                    PackListLoadingStatus.UN_LOADING_START,
                    PackListLoadingStatus.UN_LOADING_PAUSED,
                    PackListLoadingStatus.UN_LOADING_COMPLETED
                ],
                inspOpen: InsInspectionStatusEnum.OPEN,
                inspCompleted: InsInspectionStatusEnum.COMPLETED,
                grnOpen: PhLinesGrnStatusEnum.OPEN,
                grnCompleted: PhLinesGrnStatusEnum.DONE
            })
            .groupBy('COALESCE(pv.ph_id, pil.ph_id), COALESCE(pv.unit_code, pil.unit_code)')
            .getRawMany();

        return query;

    }

    async getBatchCodesForExtStyleAndItemCodes(unitCode: string, companyCode: string, poNumbers: string[]): Promise<{ batchNumber: string }[]> {
        console.log(poNumbers, "kkkk")
        const query = this.createQueryBuilder('ph')
            .select('DISTINCT ph.batch_number AS batchNumber')
            .where('ph.po_number IN (:...poNumbers)', { poNumbers })
            .andWhere('ph.unit_code = :unitCode', { unitCode })
            .andWhere('ph.company_code = :companyCode', { companyCode });

        const result = await query.getRawMany();
        return result.map(item => ({ batchNumber: item.batchNumber }));
    }


    async getMoAbstractInfoForRollIds(unitCode: string, companyCode: string, rollIds: number[]): Promise<RollMoAbtractInfoQueryResponse[]> {
        const rawData = await this
            .createQueryBuilder("pl")
            .select([
                "mo.style_code AS style_code",
                "pl.barcode AS barcode",
                "pl.id AS rollId",
                "mo.manufacturing_order_code AS manufacturing_order_code"
            ])
            .leftJoin("manufacturing_order_items", "si", "si.gmt_po = pl.po_number AND si.company_code = pl.company_code AND si.unit_code = pl.unit_code")
            .leftJoin("manufacturing_order", "mo", "mo.id = si.manufacturing_order_id AND mo.company_code = si.company_code AND mo.unit_code = si.unit_code")
            .where("pl.id IN (:...rollIds)", { rollIds })
            .andWhere("pl.unit_code = :unitCode", { unitCode })
            .andWhere("pl.company_code = :companyCode", { companyCode })
            .getRawMany();

        return rawData;
    }


    async getItemLinesRepo(id: number[], unitCode: string, companyCode: string): Promise<number> {
        const result = await this.createQueryBuilder('ph_item_lines')
            .select('SUM(i_quantity)', 'qty')
            .where('ph_item_lines.id IN (:id)', { id })
            .andWhere('ph_item_lines.unitCode = :unitCode', { unitCode })
            .andWhere('ph_item_lines.companyCode = :companyCode', { companyCode })
            .getRawOne();

        return result?.qty || 0;
    }

    async getItemLinesRepoTotal(id: number[], unitCode: string, companyCode: string): Promise<number> {
        const result = await this.createQueryBuilder('ph_item_lines')
            .select('SUM(i_quantity-issued_quantity)', 'qty')
            .where('ph_item_lines.id IN (:id)', { id })
            .andWhere('ph_item_lines.unitCode = :unitCode', { unitCode })
            .andWhere('ph_item_lines.companyCode = :companyCode', { companyCode })
            .getRawOne();

        return result?.qty || 0;
    }


    async getAllavailableQty(unitCode: string, companyCode: string): Promise<TotalRollInformation> {
        const queryBuilder = this.createQueryBuilder('pimlines')
            .select(`SUM(CASE WHEN pimlines.grn_status='DONE' THEN (pimlines.i_quantity-pimlines.issued_quantity) ELSE 0 END) AS rollQuantity,
            SUM(CASE WHEN pimlines.grn_status='DONE' AND pimlines.object_type='ROLL' AND (pimlines.i_quantity-pimlines.issued_quantity)>0 THEN 1 ELSE 0 END) AS rolls,
            SUM(CASE WHEN pimlines.grn_status='DONE' AND pimlines.object_type='BALE' AND (pimlines.i_quantity-pimlines.issued_quantity)>0 THEN 1 ELSE 0 END) AS bales`)
            .where(`pimlines.company_code='${companyCode}' and pimlines.unit_code='${unitCode}'`)
        return await queryBuilder.getRawOne();
    }

    async getRollIdsForItemCode(
        itemCodes: string[],
        unitCode: string,
        companyCode: string
    ): Promise<string[]> {
        const data = await this.createQueryBuilder('pil')
            .leftJoin('ph_items', 'pi', 'pil.ph_items_id = pi.id')
            .select('pil.id', 'id')
            .where('pi.item_code IN (:...itemCodes)', { itemCodes })
            .andWhere('pi.unit_code = :unitCode', { unitCode })
            .andWhere('pi.company_code = :companyCode', { companyCode })
            .getRawMany();

        return data.map(row => row.id);
    }


}