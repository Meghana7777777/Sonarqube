import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, InsFabInsSelectedBatchModelAttrs, PackListDropDownModel, SupplierCodeReq } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { PackingListEntity } from "../entities/packing-list.entity";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { PhLinesEntity } from "../entities/ph-lines.entity";

@Injectable()
export class InspectionReportsRepo extends Repository<PackingListEntity> {
    constructor(dataSource: DataSource) {
        super(PackingListEntity, dataSource.createEntityManager());
    }

    async packListNumbersDropDown(reqModel: CommonRequestAttrs) {
        const queryData = this.createQueryBuilder('plh')
            .select(`plh.id AS Id ,plh.pack_list_code AS packListNo`)
            .where(`plh.unit_code = '${reqModel.unitCode}' AND plh.company_code = '${reqModel.companyCode}'  AND is_active=true`)
            .orderBy('plh.created_at', 'DESC')
        const data = await queryData.getRawMany();
        return data
    }
    async getPackListsForSupplier(reqModel: SupplierCodeReq) {
        const queryData = this.createQueryBuilder('plh')
            .select(`plh.id AS Id ,plh.pack_list_code AS packListNo`)
            .where(`plh.unit_code = '${reqModel.unitCode}' AND plh.company_code = '${reqModel.companyCode}'  AND is_active=true`)
            .andWhere(`plh.supplier_code = '${reqModel.supplierCode}'`)
            .orderBy('plh.created_at', 'DESC')
        const data = await queryData.getRawMany();
        return data.map((data) => new PackListDropDownModel(data.packListNo, data.Id))
    }

    async getHeaderAtributesById(headerId: number): Promise<InsFabInsSelectedBatchModelAttrs> {
        const rawResult = await this
            .createQueryBuilder('plh')
            .select('plh.id', 'HEADER_ID')
            .addSelect('plh.supplier_name', 'SUPPLIER')
            .addSelect('plh.delivery_date', 'DELIVARYDATE')
            .addSelect('GROUP_CONCAT(DISTINCT pi.item_description)', 'FABRIC_DESCRIPTION')
            .addSelect('GROUP_CONCAT(DISTINCT pi.item_size)', 'SIZE')
            .addSelect('GROUP_CONCAT(DISTINCT pi.item_color)', 'COLOR')
            .addSelect('GROUP_CONCAT(DISTINCT pi.item_style)', 'STYLE')
            .addSelect('GROUP_CONCAT(DISTINCT pl.invoice_number)', 'INVOICE_NO')
            .addSelect('GROUP_CONCAT(DISTINCT pil.po_number)', 'PO_NO')
            .addSelect('plh.pack_list_code', 'PACKLIST_CODE')
            .leftJoin(PhLinesEntity, 'pl', 'pl.ph_id = plh.id')
            .leftJoin(PhItemsEntity, 'pi', 'pi.ph_lines_id = pl.id')
            .leftJoin(PhItemLinesEntity, 'pil', 'pil.ph_items_id = pi.id')
            .where('plh.id = :id', { id: headerId })
            .groupBy('plh.id')
            .getRawOne();

        if (!rawResult) {
            return null;
        }
        // console.log('rawResult45',rawResult);
        const split = (value: string) => value ? value.split(',') : [];

        const result: InsFabInsSelectedBatchModelAttrs = {
            moNo: [],
            delDate: [rawResult.DELIVARYDATE],
            destination: [],
            moLines: [],
            style: split(rawResult.STYLE),
            color: split(rawResult.COLOR),
            size: split(rawResult.SIZE),
            descriptions: split(rawResult.FABRIC_DESCRIPTION),
            supplier: [rawResult.SUPPLIER],
            invoiceNo: rawResult.INVOICE_NO,
            poNumber: rawResult.PO_NO,
            packListCode: rawResult.PACKLIST_CODE,
        };

        return result;
    }

}