import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PhGrnEntity } from "../entities/ph-grn.entity";
import { SystemPreferenceQryResp } from "./query-response/system-preference.qry.resp";
import { GrnDetailsReportResponse, ReportType } from "@xpparel/shared-models";
import { PackingListEntity } from "../../packing-list/entities/packing-list.entity";
import { PhItemLinesEntity } from "../../packing-list/entities/ph-item-lines.entity";
import { PhItemsEntity } from "../../packing-list/entities/ph-items.entity";
import { PalletRollMapEntity } from "../../location-allocation/entities/pallet-roll-map.entity";
import { PalletBinMapEntity } from "../../location-allocation/entities/pallet-bin-map.entity";
import { LPalletEntity } from "../../master-data/entities/l-pallet.entity";
import { LBinEntity } from "../../master-data/entities/l-bin.entity";
import { PhItemLinesActualEntity } from "../../packing-list/entities/ph-item-lines-actual.entity";
import { PhLinesEntity } from "../../packing-list/entities/ph-lines.entity";

@Injectable()
export class PhGrnRepo extends Repository<PhGrnEntity>{
    constructor(private dataSource: DataSource) {
        super(PhGrnEntity, dataSource.createEntityManager());
    }

    /**
     * Service to get system Preferences for packing list Id
     * @param packListId 
     * @param unitCode 
     * @param companyCode 
    */
    async getSystemPreferenceForPackListId(packListId: number, unitCode: string, companyCode: string): Promise<SystemPreferenceQryResp> {
        return await this.createQueryBuilder('ph_grn')
            .select('rolls_pick_perc, roll_selection_type,remarks')
            .where(`ph_id = ${packListId} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
    }


    async getGrnDetailsReports(startDate: string, endDate: string, companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_date AS grnDate,pg.grn_number as grnNo,ph.supplier_code as supplier,pitemlines.po_number as poNo,pg.grn_invoice_number as invoiceNumber,ph.pack_list_code as supplierPackingListNumber,pitem.item_code as itemCode, pitem.item_color as itemColor,pitem.item_description as itemDescription,pitemlines.lot_number as lotNo,pitemlines.object_ext_no AS rollNo,pitemlines.i_quantity AS quantity,pitemlines.issued_quantity AS issQuantity,pitemlines.return_quantity AS retQuantity,pitemlines.allocated_quantity AS allocQuantity,'METER' AS uom,pitemlines.grn_status AS grnStatus, ph.grn_status AS mainGrnStatus,pitemlines.object_type as objectType,pitemlines.barcode as barcodeNumber,ppallet.confirmed_pallet_id as palletId, pbin.confirmed_bin_id as binId,ppallet.status AS palletStatus, pbin.status AS binStatus,pallet.pallet_code AS palletCode, pallet.current_pallet_state AS currentPalletState,pallet.current_pallet_location AS currentPalletLocation,pallet.pallet_beahvior AS palletBehavior, bins.bin_code AS binCode, pitemlines.grn_date as grnRollDate,pitemlines.id as id,pitemlines.i_width AS inputWidth, pitemlines.i_w_uom AS inputWidthUom,pitemlines.s_width AS inputWidthCm,pilinesactual.a_width as relaxWidth,pilinesactual.a_shade as shade`)
            .leftJoin(PackingListEntity, 'ph', 'pg.company_code = ph.company_code AND pg.unit_code = ph.unit_code AND pg.ph_id = ph.id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.ph_id = ph.id')
            .leftJoin(PhItemLinesActualEntity, 'pilinesactual', 'pilinesactual.company_code = pitemlines.company_code AND pilinesactual.unit_code = pitemlines.unit_code AND pilinesactual.phItemLinesId = pitemlines.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.id = pitemlines.ph_items_id')
            .leftJoin(PalletRollMapEntity, 'ppallet', 'ppallet.company_code = pitemlines.company_code AND ppallet.unit_code = pitemlines.unit_code AND ppallet.item_lines_id = pitemlines.id')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.company_code = ppallet.company_code AND pbin.unit_code = ppallet.unit_code AND pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'bins.id= pbin.confirmed_bin_id')
            .where(`date(pg.grn_date) between '${startDate}' and '${endDate}' pg.unit_code = '${unitCode}' AND pg.company_code = '${companyCode}'`)
            .groupBy('ph.pack_list_code, pitemlines.lot_number, pitemlines.object_ext_no')

            .getRawMany();
        return queryBuilder
    }

    async getGrnDetailsReportsPackListWiseRepo(packListId: string, companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_date AS grnDate,pg.grn_number as grnNo,ph.supplier_code as supplier,pitemlines.po_number as poNo,pg.grn_invoice_number as invoiceNumber,ph.pack_list_code as supplierPackingListNumber,pitem.item_code as itemCode, pitem.item_color as itemColor,pitem.item_description as itemDescription,pitemlines.lot_number as lotNo,pitemlines.object_ext_no AS rollNo,pitemlines.i_quantity AS quantity,pitemlines.issued_quantity AS issQuantity,pitemlines.return_quantity AS retQuantity,pitemlines.allocated_quantity AS allocQuantity,'METER' AS uom,pitemlines.grn_status AS grnStatus,ph.grn_status AS mainGrnStatus,pitemlines.object_type as objectType,pitemlines.barcode as barcodeNumber,ppallet.confirmed_pallet_id as palletId, pbin.confirmed_bin_id as binId,ppallet.status AS palletStatus, pbin.status AS binStatus,pallet.pallet_code AS palletCode, pallet.current_pallet_state AS currentPalletState,pallet.current_pallet_location AS currentPalletLocation,pallet.pallet_beahvior AS palletBehavior, bins.bin_code AS binCode, pitemlines.grn_date as grnRollDate,pitemlines.id as id,pitemlines.i_width AS inputWidth, pitemlines.i_w_uom AS inputWidthUom,pitemlines.s_width AS inputWidthCm,pilinesactual.a_width as relaxWidth,pilinesactual.a_shade as shade`)
            .leftJoin(PackingListEntity, 'ph', 'pg.company_code = ph.company_code AND pg.unit_code = ph.unit_code AND pg.ph_id = ph.id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.company_code = ph.company_code AND pitemlines.unit_code = ph.unit_code AND pitemlines.ph_id = ph.id')
            .leftJoin(PhItemLinesActualEntity, 'pilinesactual', 'pilinesactual.company_code = pitemlines.company_code AND pilinesactual.unit_code = pitemlines.unit_code AND pilinesactual.phItemLinesId = pitemlines.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.company_code = pitemlines.company_code AND pitem.unit_code = pitemlines.unit_code AND pitem.id = pitemlines.ph_items_id')
            .leftJoin(PalletRollMapEntity, 'ppallet', 'ppallet.company_code = pitemlines.company_code AND ppallet.unit_code = pitemlines.unit_code AND ppallet.item_lines_id = pitemlines.id')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.company_code = ppallet.company_code AND pbin.unit_code = ppallet.unit_code AND pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.company_code= ppallet.company_code AND pallet.unit_code= ppallet.unit_code AND pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'bins.company_code= pbin.company_code AND bins.unit_code= pbin.unit_code AND bins.id= pbin.confirmed_bin_id')
            .where(`ph.id= ${packListId} AND ph.unit_code = '${unitCode}' AND ph.company_code = '${companyCode}'`)
            .groupBy('ph.pack_list_code, pitemlines.lot_number, pitemlines.object_ext_no')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany(); 
        return queryBuilder
    }
    
    async getGrnDetailsReportsAllRepo(companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_date AS grnDate,pg.grn_number as grnNo,ph.supplier_code as supplier,pitemlines.po_number as poNo,pg.grn_invoice_number as invoiceNumber,ph.pack_list_code as supplierPackingListNumber,pitem.item_code as itemCode, pitem.item_color as itemColor,pitem.item_description as itemDescription,pitemlines.lot_number as lotNo,pitemlines.object_ext_no AS rollNo,pitemlines.i_quantity AS quantity,pitemlines.issued_quantity AS issQuantity,pitemlines.return_quantity AS retQuantity,pitemlines.allocated_quantity AS allocQuantity,'METER' AS uom,pitemlines.grn_status AS grnStatus,ph.grn_status AS mainGrnStatus,pitemlines.object_type as objectType,pitemlines.barcode as barcodeNumber,ppallet.confirmed_pallet_id as palletId, pbin.confirmed_bin_id as binId,ppallet.status AS palletStatus, pbin.status AS binStatus,pallet.pallet_code AS palletCode, pallet.current_pallet_state AS currentPalletState,pallet.current_pallet_location AS currentPalletLocation,pallet.pallet_beahvior AS palletBehavior, bins.bin_code AS binCode, pitemlines.grn_date as grnRollDate,pitemlines.id as id,pitemlines.i_width AS inputWidth, pitemlines.i_w_uom AS inputWidthUom,pitemlines.s_width AS inputWidthCm,pilinesactual.a_width as relaxWidth,pilinesactual.a_shade as shade`)
            .leftJoin(PackingListEntity, 'ph', 'pg.company_code = ph.company_code AND pg.unit_code = ph.unit_code AND pg.ph_id = ph.id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.company_code = ph.company_code AND pitemlines.unit_code = ph.unit_code AND pitemlines.ph_id = ph.id')
            .leftJoin(PhItemLinesActualEntity, 'pilinesactual', 'pilinesactual.company_code = pitemlines.company_code AND pilinesactual.unit_code = pitemlines.unit_code AND pilinesactual.phItemLinesId = pitemlines.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.company_code = pitemlines.company_code AND pitem.unit_code = pitemlines.unit_code AND pitem.id = pitemlines.ph_items_id')
            .leftJoin(PalletRollMapEntity, 'ppallet', 'ppallet.company_code = pitemlines.company_code AND ppallet.unit_code = pitemlines.unit_code AND ppallet.item_lines_id = pitemlines.id')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.company_code = ppallet.company_code AND pbin.unit_code = ppallet.unit_code AND pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.company_code= ppallet.company_code AND pallet.unit_code= ppallet.unit_code AND pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'bins.company_code= pbin.company_code AND bins.unit_code= pbin.unit_code AND bins.id= pbin.confirmed_bin_id')
            .where(`pg.unit_code = '${unitCode}' AND pg.company_code = '${companyCode}'`)
            .groupBy('ph.pack_list_code, pitemlines.lot_number, pitemlines.object_ext_no')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany();

        return queryBuilder
    }

    async getRollDataWithBarcodeNumberRepo(rollId: number) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_date AS grnDate,pg.grn_number as grnNo,ph.supplier_code as supplier,pitemlines.po_number as poNo,pg.grn_invoice_number as invoiceNumber,ph.pack_list_code as supplierPackingListNumber,pitem.item_code as itemCode, pitem.item_color as itemColor,pitem.item_description as itemDescription,pitemlines.lot_number as lotNo,pitemlines.object_ext_no AS rollNo,pitemlines.i_quantity AS quantity,pitemlines.issued_quantity AS issQuantity,pitemlines.return_quantity AS retQuantity,pitemlines.allocated_quantity AS allocQuantity,'METER' AS uom,pitemlines.grn_status AS grnStatus, ph.grn_status AS mainGrnStatus,pitemlines.object_type as objectType,pitemlines.barcode as barcodeNumber,ppallet.confirmed_pallet_id as palletId, pbin.confirmed_bin_id as binId,ppallet.status AS palletStatus, pbin.status AS binStatus,pallet.pallet_code AS palletCode, pallet.current_pallet_state AS currentPalletState,pallet.current_pallet_location AS currentPalletLocation,pallet.pallet_beahvior AS palletBehavior, bins.bin_code AS binCode, pitemlines.grn_date as grnRollDate,pitemlines.id as id,pitemlines.i_width AS inputWidth, pitemlines.i_w_uom AS inputWidthUom,pitemlines.s_width AS inputWidthCm`)
            .leftJoin(PackingListEntity, 'ph', 'ph.id = pg.ph_id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.ph_id = ph.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.id = pitemlines.ph_items_id')
            .leftJoin(PalletRollMapEntity, 'ppallet', 'ppallet.item_lines_id = pitemlines.id ')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'bins.id= pbin.confirmed_bin_id')
            .where(`pitemlines.id= ${rollId}`)
            .groupBy('ph.pack_list_code, pitemlines.lot_number, pitemlines.object_ext_no')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany();
            

        return queryBuilder
    }

    async getGrnDetailsRepo(packingListCodes: string[], companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_number as grnNumber, MIN(pimlines.grn_date) as grnDate, ph.delivery_date AS deliveryDate, ph.pack_list_code AS packListcode, ph.delivery_date AS deliveryDate, plines.invoice_number AS phInvNumber, pimlines.po_number AS poNo, pitems.item_code AS itemCode, pitems.item_color AS itemColor,pitems.actual_uom as uom, COUNT(pimlines.id) AS rolls, SUM(pimlines.i_quantity) AS packRollQty,SUM(IF(pimlines.grn_status = 'DONE', pimlines.i_quantity, 0)) AS grnQty, SUM(pimlines.issued_quantity) AS issQty,pitems.item_type as packageType`)
            .leftJoin(PackingListEntity, 'ph', 'ph.company_code = pg.company_code AND ph.unit_code = pg.unit_code AND ph.id = pg.ph_id')
            .leftJoin(PhLinesEntity, 'plines', 'plines.company_code = ph.company_code AND plines.unit_code = ph.unit_code AND plines.ph_id = ph.id')
            .leftJoin(PhItemsEntity, 'pitems', 'pitems.company_code = plines.company_code AND pitems.unit_code = plines.unit_code AND pitems.ph_lines_id = plines.id')
            .leftJoin(PhItemLinesEntity, 'pimlines', 'pimlines.company_code = plines.company_code AND pimlines.unit_code = plines.unit_code AND pimlines.ph_items_id = pitems.id')
            .where(`ph.company_code='${companyCode}' and ph.unit_code='${unitCode}' and ph.id in (:...packinglistcode)`, {packinglistcode:packingListCodes})
            .groupBy('ph.pack_list_code, pitems.item_code, pimlines.po_number')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany();   
        return queryBuilder
    }

    async getReceivingRepo(startDate: string, endDate: string, companyCode: string, unitCode: string, reportType: ReportType) {
        // console.log(startDate, endDate, reportType,'datesssssssssssssssssssssss');
        const queryBuilder = this.createQueryBuilder('pg')
            .select(`ph.delivery_date AS receivingDate,ph.supplier_code AS supplierCode,plines.invoice_number AS phInvNumber, pimlines.po_number AS poNo, pitems.item_code AS itemCode, pitems.item_color AS itemColor, COUNT(pimlines.id) AS rolls, SUM(pimlines.i_quantity) AS packRollQty,SUM(IF(pimlines.grn_status = 'DONE', pimlines.i_quantity, 0)) AS grnQty,pimlines.object_ext_no AS rollNumber, plines.lot_number AS lotNumber, ph.pack_list_code AS packListCode, pitems.item_type AS packageType`)
            .leftJoin(PackingListEntity, 'ph', 'ph.company_code = pg.company_code AND ph.unit_code = pg.unit_code AND ph.id = pg.ph_id')
            .leftJoin(PhLinesEntity, 'plines', 'plines.company_code = ph.company_code AND plines.unit_code = ph.unit_code AND plines.ph_id = ph.id')
            .leftJoin(PhItemsEntity, 'pitems', 'pitems.company_code = plines.company_code AND pitems.unit_code = plines.unit_code AND pitems.ph_lines_id = plines.id')
            .leftJoin(PhItemLinesEntity, 'pimlines', 'pimlines.company_code = plines.company_code AND pimlines.unit_code = plines.unit_code AND pimlines.ph_items_id = pitems.id')
            .where(`ph.company_code='${companyCode}' and ph.unit_code='${unitCode}' and date(ph.delivery_date) between '${startDate}' and '${endDate}'`)
            if(reportType==ReportType.DETAILS){
                queryBuilder.groupBy('ph.pack_list_code,plines.lot_number,pitems.item_code,pitems.item_category,pimlines.po_number')
            }else{
                queryBuilder.groupBy('ph.pack_list_code,pitems.item_code,pimlines.po_number')
            }
            queryBuilder.orderBy('ph.delivery_date', 'DESC')
            console.log(queryBuilder,'popopopopop')
            return await queryBuilder.getRawMany();
    }

    async getOnHandStockRepo(poNumberData: string[], companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
            .select(`pg.grn_date AS grnDate,pg.grn_number as grnNo,ph.supplier_code as supplier,pitemlines.po_number as poNo,pg.grn_invoice_number as invoiceNumber,ph.pack_list_code as supplierPackingListNumber,pitem.item_code as itemCode, pitem.item_color as itemColor,pitem.item_description as itemDescription,pitemlines.lot_number as lotNo,pitemlines.object_ext_no AS rollNo,pitemlines.i_quantity AS quantity,pitemlines.issued_quantity AS issQuantity,pitemlines.return_quantity AS retQuantity,pitemlines.allocated_quantity AS allocQuantity, pitemlines.i_q_uom AS uom,pitemlines.grn_status AS grnStatus, ph.grn_status AS mainGrnStatus,pitemlines.object_type as objectType,pitemlines.barcode as barcodeNumber,ppallet.confirmed_pallet_id as palletId, pbin.confirmed_bin_id as binId,ppallet.status AS palletStatus, pbin.status AS binStatus,pallet.pallet_code AS palletCode, pallet.current_pallet_state AS currentPalletState,pallet.current_pallet_location AS currentPalletLocation,pallet.pallet_beahvior AS palletBehavior, bins.bin_code AS binCode, pitemlines.grn_date as grnRollDate,pitemlines.id as id,pitemlines.i_width AS inputWidth, pitemlines.i_w_uom AS inputWidthUom,pitemlines.s_width AS inputWidthCm, pilinesactual.a_width as relaxWidth,pilinesactual.a_shade as shade, DATEDIFF(CURRENT_DATE, pitemlines.grn_date) AS daysDifference`)
            .leftJoin(PackingListEntity, 'ph', 'pg.company_code = ph.company_code AND pg.unit_code = ph.unit_code AND pg.ph_id = ph.id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.company_code = ph.company_code AND pitemlines.unit_code = ph.unit_code AND pitemlines.ph_id = ph.id')
            .leftJoin(PhItemLinesActualEntity, 'pilinesactual', 'pilinesactual.company_code = pitemlines.company_code AND pilinesactual.unit_code = pitemlines.unit_code AND pilinesactual.phItemLinesId = pitemlines.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.company_code = pitemlines.company_code AND pitem.unit_code = pitemlines.unit_code AND pitem.id = pitemlines.ph_items_id')
            .leftJoin(PalletRollMapEntity, 'ppallet', 'ppallet.company_code = pitemlines.company_code AND ppallet.unit_code = pitemlines.unit_code AND ppallet.item_lines_id = pitemlines.id')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.company_code = ppallet.company_code AND pbin.unit_code = ppallet.unit_code AND pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.company_code= ppallet.company_code AND pallet.unit_code= ppallet.unit_code AND pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'bins.company_code= pbin.company_code AND bins.unit_code= pbin.unit_code AND bins.id= pbin.confirmed_bin_id')
            .where(`ph.company_code = '${companyCode}' AND ph.unit_code = '${unitCode}' AND pitemlines.grn_status='DONE' AND pitemlines.po_number in (:...poNumber)`, {poNumber:poNumberData})
            .groupBy('ph.pack_list_code, pitemlines.lot_number, pitemlines.id')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany(); 
        return queryBuilder
    }

    async getStockAgingRepo(poNumber: string[], companyCode: string, unitCode: string) {
        const queryBuilder = await this.createQueryBuilder('pg')
        .select(`pg.grn_date AS grnDate,
            pg.grn_number AS grnNo,
            ph.supplier_code AS supplier,
            pg.grn_invoice_number AS invoiceNumber,
            ph.pack_list_code AS supplierPackingListNumber,
            pitem.item_code AS itemCode,
            pitem.item_color AS itemColor,
             pitem.item_category AS itemCategory,
            pitem.item_description AS itemDescription,
            SUM(pitemlines.i_quantity) AS totalQuantity, 
            SUM(pitemlines.issued_quantity) AS totalIssuedQuantity,
            SUM(pitemlines.return_quantity) AS totalReturnQuantity,
            SUM(pitemlines.allocated_quantity) AS totalAllocatedQuantity,
            pitem.actual_uom AS uom,
            pitemlines.grn_status AS grnStatus,
            ph.grn_status AS mainGrnStatus,
            pitemlines.object_type AS objectType,
            SUM(pitemlines.i_quantity) AS packRollQty,
            SUM(IF(pitemlines.grn_status = 'DONE', pitemlines.i_quantity,0)) AS grnQty,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 0 AND 30 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days30,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 31 AND 60 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days60,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 61 AND 90 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days90,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 91 AND 120 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days120,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 121 AND 150 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days150,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 151 AND 180 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days180,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 181 AND 300 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days300,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 301 AND 360 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS days360,
            SUM(CASE WHEN DATEDIFF(CURRENT_DATE, pitemlines.grn_date) BETWEEN 360 AND 3000 AND pitemlines.grn_status='DONE' THEN (pitemlines.i_quantity-pitemlines.issued_quantity) ELSE 0 END) AS alldays`)
            .leftJoin(PackingListEntity, 'ph', 'pg.company_code = ph.company_code AND pg.unit_code = ph.unit_code AND pg.ph_id = ph.id')
            .leftJoin(PhItemLinesEntity, 'pitemlines', 'pitemlines.company_code = ph.company_code AND pitemlines.unit_code = ph.unit_code AND pitemlines.ph_id = ph.id')
            .leftJoin(PhItemsEntity, 'pitem', 'pitem.company_code = pitemlines.company_code AND pitem.unit_code = pitemlines.unit_code AND pitem.id = pitemlines.ph_items_id')
            .where(`ph.company_code = '${companyCode}' AND ph.unit_code = '${unitCode}' AND pitemlines.grn_status='DONE' AND pitemlines.po_number in (:...poNumber)`, {poNumber:poNumber})
            .groupBy('ph.pack_list_code, pitem.item_code')
            .orderBy('ph.delivery_date', 'DESC')
            .getRawMany(); 
        return queryBuilder
    }
}




