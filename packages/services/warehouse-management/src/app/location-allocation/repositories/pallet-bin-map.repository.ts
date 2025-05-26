import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletBinMapEntity } from "../entities/pallet-bin-map.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { PalletRollMapEntity } from "../entities/pallet-roll-map.entity";
import { PhItemLinesEntity } from "../../packing-list/entities/ph-item-lines.entity";
import { PhItemsEntity } from "../../packing-list/entities/ph-items.entity";
import { BinRelatedDataQryResp } from "./query-response.ts/bin-related-data.response";
import { PalletBinStatusEnum, PhItemLinesObjectTypeEnum } from "@xpparel/shared-models";
//import { distinct } from "rxjs";

@Injectable()
export class PalletBinMapRepo extends Repository<PalletBinMapEntity>{

    constructor(dataSource: DataSource) {
        super(PalletBinMapEntity, dataSource.createEntityManager());
    }

    async getConfirmedBinIdsForPalletIds(companyCode: string, unitCode: string, palletIds: number[]): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT confirmed_bin_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${PalletBinStatusEnum.CONFIRMED}' AND pallet_id IN(:...pallets)`, {pallets: palletIds});
        const result: {confirmed_bin_id: number}[] = await query.getRawMany();
        const binIds: number[] = [];
        result.forEach(r => {
            binIds.push(r.confirmed_bin_id);
        });
        return binIds;
    }

    async getSuggestedBinIdsForPalletIds(companyCode: string, unitCode: string, palletIds: number[]): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT suggested_bin_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${PalletBinStatusEnum.OPEN}' AND pallet_id IN(:...pallets)`, {pallets: palletIds});
        const result: {suggested_bin_id: number}[] = await query.getRawMany();
        const binIds: number[] = [];
        result.forEach(r => {
            binIds.push(r.suggested_bin_id);
        });
        return binIds;
    }

    async getConfirmedPalletIdsForBinIds(companyCode: string, unitCode: string, binIds: number[]): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT pallet_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${PalletBinStatusEnum.CONFIRMED}' AND is_active = true AND confirmed_bin_id IN(:...binIds)`, {binIds: binIds});
        const result: {pallet_id: number}[] = await query.getRawMany();
        const pallet_ids: number[] = [];
        result.forEach(r => {
            pallet_ids.push(r.pallet_id);
        });
        return pallet_ids;
    }

    async getSuggestedPalletIdsForBinIds(companyCode: string, unitCode: string, binIds: number[]): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT pallet_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${PalletBinStatusEnum.OPEN}' AND is_active = true AND suggested_bin_id IN(:...binIds)`, {binIds: binIds});
        const result: {pallet_id: number}[] = await query.getRawMany();
        const pallet_ids: number[] = [];
        result.forEach(r => {
            pallet_ids.push(r.pallet_id);
        });
        return pallet_ids;
    }


    async getPalletsCountByBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT pallet_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true AND is_active = true AND confirmed_bin_id IN(:...binIds)`, {binIds: binIds});
        const result: {pallet_id: number}[] = await query.getRawMany();
        const pallet_ids: number[] = [];
        result.forEach(r => {
            pallet_ids.push(r.pallet_id);
        });
        return pallet_ids;
    }

    async getSupportedPalletsCountByBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        const query =  this.createQueryBuilder('p')
        .select('DISTINCT pallet_id')
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true AND is_active = true AND confirmed_bin_id IN(:...binIds)`, {binIds: binIds});
        const result: {pallet_id: number}[] = await query.getRawMany();
        const pallet_ids: number[] = [];
        result.forEach(r => {
            pallet_ids.push(r.pallet_id);
        });
        return pallet_ids;
    }

    async getTotalAndEmptyPalletCountForBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<BinRelatedDataQryResp[]> {
        const query = await this.createQueryBuilder('p')
            .select([
                'p.confirmed_bin_id AS id',
                'SUM(CASE WHEN pallet_bin.item_lines_id IS NULL THEN 1 ELSE 0 END) AS empty_pallets',
                'COUNT(DISTINCT p.pallet_id) AS total_pallets',
                'COUNT(DISTINCT pallet_bin.item_lines_id) AS no_of_rolls_in_bin',
                `COUNT(DISTINCT CASE WHEN object_type = '${PhItemLinesObjectTypeEnum.ROLL}' THEN pallet_bin.item_lines_id ELSE NULL END) AS no_of_rolls_in_bin `,
                `COUNT(DISTINCT CASE WHEN object_type = '${PhItemLinesObjectTypeEnum.BALE}' THEN pallet_bin.item_lines_id ELSE NULL END) AS no_of_bails_in_bin`,
                // `COUNT(IF(ph_item_lines.object_type = '${PhItemLinesObjectTypeEnum.ROLL}', 1 , 0)) AS no_of_rolls_in_bin`,
                // `COUNT(IF(ph_item_lines.object_type = '${PhItemLinesObjectTypeEnum.BALE}', 1 , 0)) AS no_of_bails_in_bin`,
                'COUNT(IF(ph_item_lines.inspection_status = \'OPEN\', 1, NULL)) AS count_open',
                'COUNT(IF(ph_item_lines.inspection_status = \'INPROGRESS\', 1, NULL)) AS count_inprogress',
                'COUNT(IF(ph_item_lines.inspection_status = \'COMPLETED\', 1, NULL)) AS count_completed',

                'SUM(IF(ph_item_lines.inspection_status = \'OPEN\', ph_item_lines.s_quantity, 0)) AS total_sQuantity_open',
                'SUM(IF(ph_item_lines.inspection_status = \'INPROGRESS\', ph_item_lines.s_quantity, 0)) AS total_sQuantity_inprogress',
                'SUM(IF(ph_item_lines.inspection_status = \'COMPLETED\', ph_item_lines.s_quantity, 0)) AS total_sQuantity_completed',

                'SUM(IF(ph_item_lines.inspection_status = \'OPEN\', ph_item_lines.allocated_quantity, 0)) AS total_allocatedQty_open',
                'SUM(IF(ph_item_lines.inspection_status = \'INPROGRESS\', ph_item_lines.allocated_quantity, 0)) AS total_allocatedQty_inprogress',
                'SUM(IF(ph_item_lines.inspection_status = \'COMPLETED\', ph_item_lines.allocated_quantity, 0)) AS total_allocatedQty_completed',

                'COUNT(IF(ph_item_lines.grn_status = \'DONE\', 1, NULL)) AS grn_completed_rolls_count',
                'COUNT(IF(ph_item_lines.grn_status = \'OPEN\', 1, NULL)) AS grn_pending_rolls_count',

                'SUM(IF(ph_item_lines.grn_status = \'DONE\', ph_item_lines.s_quantity, 0)) AS grn_completed_length',
                'SUM(IF(ph_item_lines.grn_status = \'OPEN\', ph_item_lines.s_quantity, 0)) AS grn_pending_length',

                'SUM(allocated_quantity) as allocated_qty',
                'SUM(issued_quantity) as issued_qty',
                'COUNT(IF(ph_item_lines.allocated_quantity > 0, 1, 0)) AS allocated_rolls',
                'COUNT(IF(ph_item_lines.issued_quantity > 0, 1, 0)) AS issued_rolls',


                'GROUP_CONCAT(DISTINCT ph_items.item_code ORDER BY ph_items.item_code ASC) AS itemCodes',
                'GROUP_CONCAT(DISTINCT ph_item_lines.inspection_status ORDER BY ph_item_lines.inspection_status ASC) AS inspectionStatuses',
                'GROUP_CONCAT(DISTINCT ph_item_lines.id) as roll_ids',
                'GROUP_CONCAT(ph_items.item_style) as style'
            ])
            .leftJoin(PalletRollMapEntity, 'pallet_bin', 'pallet_bin.confirmed_pallet_id = p.pallet_id AND pallet_bin.unit_code = p.unit_code AND pallet_bin.company_code = p.company_code')
            .leftJoin(PhItemLinesEntity, 'ph_item_lines', 'ph_item_lines.id = pallet_bin.item_lines_id')
            .leftJoin(PhItemsEntity, 'ph_items', 'ph_items.id = ph_item_lines.ph_items_id')
            .where('p.company_code = :companyCode', { companyCode })
            .andWhere('p.unit_code = :unitCode', { unitCode })
            .andWhere('p.is_active = true')
            .andWhere('p.confirmed_bin_id IN (:...binIds)', { binIds })
            .groupBy('p.confirmed_bin_id')
            .getRawMany();
    
        return query;
    }
    

    // async getTotalAndEmptyPalletCountForBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<{
    //     empty_pallets: number,
    //     total_pallets: number,
    //     id: number
    // }[]> {
    //     const query: {
    //         empty_pallets: number,
    //         total_pallets: number,
    //         id: number
    //     }[] =  await this.createQueryBuilder('p')
    //     .select('SUM(CASE WHEN pallet_bin.item_lines_id IS NULL THEN 1 ELSE 0 END) AS empty_pallets, COUNT(DISTINCT p.pallet_id) AS total_pallets, p.confirmed_bin_id as id')
    //     .leftJoin(PalletRollMapEntity, 'pallet_bin', 'pallet_bin.confirmed_pallet_id = p.pallet_id and pallet_bin.unit_code = p.unit_code and pallet_bin.company_code = p.company_code')
    //     .where(`p.company_code = '${companyCode}' AND p.unit_code = '${unitCode}' AND p.is_active = true AND p.is_active = true AND p.confirmed_bin_id IN(:...binIds)`, {binIds: binIds})
    //     .groupBy(`p.confirmed_bin_id`)
    //     .getRawMany();
    //     return query;
    // }

}