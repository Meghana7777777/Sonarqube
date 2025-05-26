import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletRollMapEntity } from "../entities/pallet-roll-map.entity";
import { PalletBinStatusEnum } from "@xpparel/shared-models";
import { PalletPackListRollsQueryResponse } from "./query-response.ts/pallet-packlist-rolls.query.response";
import { PhItemLinesEntity } from "../../packing-list/entities/ph-item-lines.entity";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { PalletBinMapEntity } from "../entities/pallet-bin-map.entity";
import { LPalletEntity } from "../../master-data/entities/l-pallet.entity";
import { LBinEntity } from "../../master-data/entities/l-bin.entity";
import { PalletAndBinCodeQueryResponse } from "./query-response.ts/pallet-and-bin-data.query.response";
import { InsConfigItemRepo } from "../../wms-inspection-config/repositories/ins-config-item.repository";
import { InsConfigItemsEntity } from "../../wms-inspection-config/entities/ins-header-config-items";

@Injectable()
export class PalletRollMapRepo extends Repository<PalletRollMapEntity>{
    constructor(dataSource: DataSource) {
        super(PalletRollMapEntity, dataSource.createEntityManager());
    }

    async getConfirmedPalletIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT confirmed_pallet_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${PalletBinStatusEnum.CONFIRMED}' `);
        const result: { confirmed_pallet_id: number }[] = await query.getRawMany();
        const palletIds: number[] = [];
        result.forEach(r => {
            palletIds.push(r.confirmed_pallet_id);
        });
        return palletIds;
    }

    async getConfirmedPalletIdsForRollIds(companyCode: string, unitCode: string, rollIds: number[], transManager: GenericTransactionManager): Promise<number[]> {
        const ref = transManager ? transManager.getRepository(PalletRollMapEntity).createQueryBuilder('p') : this.createQueryBuilder('p');
        const query = ref.select('DISTINCT confirmed_pallet_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND item_lines_id IN (:...rollIds) AND status = '${PalletBinStatusEnum.CONFIRMED}' `, { rollIds: rollIds });
        const result: { confirmed_pallet_id: number }[] = await query.getRawMany();
        const palletIds: number[] = [];
        result.forEach(r => {
            palletIds.push(r.confirmed_pallet_id);
        });
        return palletIds;
    }

    async getConfirmedRollIdsForPackList(companyCode: string, unitCode: string, packListId: number, transManager: GenericTransactionManager): Promise<number[]> {
        const ref = transManager ? transManager.getRepository(PalletRollMapEntity).createQueryBuilder('p') : this.createQueryBuilder('p');
        const query = ref.select('DISTINCT item_lines_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${PalletBinStatusEnum.CONFIRMED}' `);
        const result: { item_lines_id: number }[] = await query.getRawMany();
        const rollIds: number[] = [];
        result.forEach(r => {
            rollIds.push(r.item_lines_id);
        });
        return rollIds;
    }

    async getSuggestedPalletIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT suggested_pallet_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${PalletBinStatusEnum.OPEN}' `);
        const result: { suggested_pallet_id: number }[] = await query.getRawMany();
        const palletIds: number[] = [];
        result.forEach(r => {
            palletIds.push(r.suggested_pallet_id);
        });
        return palletIds;
    }

    async getPacklistIdsForPalletId(companyCode: string, unitCode: string, palletId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT pack_list_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND ( suggested_pallet_id = ${palletId} OR confirmed_pallet_id = ${palletId} )`);
        const result: { pack_list_id: number }[] = await query.getRawMany();
        const packListIds: number[] = [];
        result.forEach(r => {
            packListIds.push(r.pack_list_id);
        });
        return packListIds;
    }

    async getRollIdsForPalletIdAndPhId(companyCode: string, unitCode: string, palletId: number, packListId: number): Promise<PalletPackListRollsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('pack_list_id, item_lines_id, status')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_pallet_id = ${palletId} AND pack_list_id = '${packListId}'`);
        return await query.getRawMany();
    }

    async getRollIdsForPalletId(companyCode: string, unitCode: string, palletId: number, transManager?: GenericTransactionManager): Promise<PalletPackListRollsQueryResponse[]> {
        let query;
        if (transManager) {
            query = transManager.getRepository(PalletRollMapEntity).createQueryBuilder('p')
                .select('pack_list_id, item_lines_id, status')
                .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_pallet_id = ${palletId} AND is_active=true`);
        } else {
            query = this.createQueryBuilder('p')
                .select('pack_list_id, item_lines_id, status')
                .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_pallet_id = ${palletId} AND is_active=true`);
        }
        return await query.getRawMany();
    }


    async getConfirmedRollIdsForPalletId(companyCode: string, unitCode: string, palletId: number): Promise<PalletPackListRollsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('pack_list_id, item_lines_id, status')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_pallet_id = ${palletId} `);
        return await query.getRawMany();
    }

    async getWarehouseRollIdsForPalletId(companyCode: string, unitCode: string, palletId: number): Promise<PalletPackListRollsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('p.pack_list_id, p.item_lines_id, p.status')
            .leftJoin(PhItemLinesEntity, 'roll', 'roll.company_code = p.company_code AND roll.unit_code = p.unit_code AND roll.id = p.item_lines_id')
            .leftJoin(InsConfigItemsEntity, 'ic', 'ic.ins_item_id = p.item_lines_id')
            .where(` p.company_code = '${companyCode}' AND p.unit_code = '${unitCode}'   AND  p.confirmed_pallet_id = ${palletId} `)
            .andWhere(`ic.id IS null`)
        return await query.getRawMany();
    }

    async getInspectionRollIdsForPalletId(companyCode: string, unitCode: string, palletId: number): Promise<PalletPackListRollsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('p.pack_list_id, p.item_lines_id, p.status')
            .leftJoin(PhItemLinesEntity, 'roll', 'roll.company_code = p.company_code AND roll.unit_code = p.unit_code AND roll.id = p.item_lines_id')
            .leftJoin(InsConfigItemsEntity, 'ic', 'ic.ins_item_id = p.item_lines_id')
            .where(` p.company_code = '${companyCode}' AND p.unit_code = '${unitCode}'   AND p.confirmed_pallet_id = ${palletId} `)
            .andWhere(`ic.id IS NOT null`)
        return await query.getRawMany();
    }

    async getPalletAndBinCodeforRollsIds(companyCode: string, unitCode: string, rollIds: number[]): Promise<PalletAndBinCodeQueryResponse[]> {
        const query = this.createQueryBuilder('ppallet')
            .select('ppallet.item_lines_id, pallet.id as pallet_id, pallet.pallet_name, pallet.pallet_code, pallet.barcode_id as pallet_barcode, bins.id as bin_id, bins.bin_name, bins.bin_code,bins.barcode_id as bin_barcode')
            .leftJoin(LPalletEntity, 'pallet', 'pallet.company_code= ppallet.company_code AND pallet.unit_code= ppallet.unit_code AND pallet.is_active= ppallet.is_active AND pallet.id= ppallet.confirmed_pallet_id')
            .leftJoin(PalletBinMapEntity, 'pbin', 'pbin.company_code = ppallet.company_code AND pbin.unit_code = ppallet.unit_code AND pbin.is_active = ppallet.is_active AND pbin.pallet_id = ppallet.confirmed_pallet_id')
            .leftJoin(LBinEntity, 'bins', 'pbin.company_code = bins.company_code AND pbin.unit_code = bins.unit_code AND pbin.is_active = bins.is_active AND bins.id= pbin.confirmed_bin_id')
            .where(`ppallet.company_code = '${companyCode}' AND ppallet.unit_code = '${unitCode}' AND ppallet.item_lines_id IN (:...rollIds) AND ppallet.status = '${PalletBinStatusEnum.CONFIRMED}' `, { rollIds: rollIds });
        return await query.getRawMany();
    }

    async getGrnCompletedBuNotInWhPackListCount(companyCode: string, unitCode: string, packListId: number[]): Promise<number> {
        const countObj: { cnt: number } = await this.createQueryBuilder('p')
            .select('COUNT(DISTINCT p.pack_list_id) AS cnt')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${PalletBinStatusEnum.CONFIRMED}' `)
            .andWhere(`p.pack_list_id IN(:...packListId)`, { packListId: packListId })
            .getRawOne()
        return countObj.cnt;
    }
    async getRollsInWarehouse(itemLines: number[]): Promise<number> {
        const query = await this.createQueryBuilder('prm')
            .select('COUNT(DISTINCT prm.item_lines_id)', 'cnt')
            .leftJoin(PalletBinMapEntity, 'pbm', 'pbm.pallet_id = prm.confirmed_pallet_id')
            .where('prm.item_lines_id IN (:...itemLines)', { itemLines: itemLines })
            .andWhere('pbm.confirmed_bin_id IS NOT NULL')
            .getRawOne();

        return query;
    }
}













