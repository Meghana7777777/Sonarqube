import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PackListIdRequest, PalletGroupTypeEnum, PgIdRequest, PgRollsModel, PgRollsResponse, RollInfoModel } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { PalletGroupItemsEntity } from './entities/pallet-group/pallet-group-items.entity';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PalletGroupItemsRepo } from './repositories/pallet-group-items.repository';
import { PalletGroupRepo } from './repositories/pallet-group.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';

@Injectable()
export class PalletGroupInfoService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private palletRollMapRepo: PalletRollMapRepo,
        @Inject(forwardRef(() => LcoationMappingHelperService))  private locAllocHelper: LcoationMappingHelperService,
        private palletGroupRepo: PalletGroupRepo,
        private palletGroupItemRepo: PalletGroupItemsRepo
    ) {

    }

    // ENDPOUNT
    // READER
    async getPgIdsForPackListId(req: PackListIdRequest): Promise<PgRollsResponse> {
        const pgs = await this.palletGroupRepo.find({select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packListId: req.packListId, isActive: true } });
        if(pgs.length == 0) {
            throw new ErrorResponse(6334, 'No pallet groups mapped for the pack list');
        }
        const palletDetails: PgRollsModel[] = [];
        for(const pg of pgs) {
            const palletPhDetail = new PgRollsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, null);
            palletDetails.push(palletPhDetail);
        }
        return new PgRollsResponse(true, 6102, 'Pgs for pack list retrieved successfully', palletDetails);
    }

    // ENDPOUNT
    // READER
    async getInspectionRollsForPgId(req: PgIdRequest): Promise<PgRollsResponse> {
        // get the pallet groups and group wise rolls
        const pgs = await this.palletGroupRepo.find({select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.pgId, isActive: true, pgType: PalletGroupTypeEnum.INSPECTION } });
        if(pgs.length == 0) {
            throw new ErrorResponse(6334, 'No pallet groups mapped for the pack list');
        }
        const palletDetails: PgRollsModel[] = [];
        for(const pg of pgs) {
            
            const rollIds = [];
            // get all the rolls for the pg
            const rolls = await this.palletGroupItemRepo.find({ where: { pgId: pg.id, isActive: true }});
            rolls.forEach(r => rollIds.push(r.itemLinesId));

            const rollInfoModels: RollInfoModel[] = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, rollIds,false);
            const palletPhDetail = new PgRollsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, rollInfoModels);
            palletDetails.push(palletPhDetail);
        }
        return new PgRollsResponse(true, 6335, 'Pallet group info retrieved successfully', palletDetails);
    }

    // ENDPOUNT
    // READER
    async getWarehouseRollsForForPgId(req: PgIdRequest): Promise<PgRollsResponse> {
        // get the pallet groups and group wise rolls
        const pgs = await this.palletGroupRepo.find({select: ['id', 'pgName', 'pgType', 'packListId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: req.pgId, isActive: true, pgType: PalletGroupTypeEnum.WAREHOUSE } });
        if(pgs.length == 0) {
            throw new ErrorResponse(6334, 'No pallet groups mapped for the pack list');
        }
        const palletDetails: PgRollsModel[] = [];
        for(const pg of pgs) {
            
            const rollIds = [];
            // get all the rolls for the pg
            const rolls = await this.palletGroupItemRepo.find({ where: { pgId: pg.id, isActive: true }});
            rolls.forEach(r => rollIds.push(r.itemLinesId));

            const rollInfoModels: RollInfoModel[] = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, rollIds,false);
            const palletPhDetail = new PgRollsModel(pg.pgName, pg.id, pg.pgType, pg.packListId, rollInfoModels);
            palletDetails.push(palletPhDetail);
        }
        return new PgRollsResponse(true, 6335, 'Pallet group info retrieved successfully', palletDetails);
    }

    // HELPER
    // READER
    async getDefaultPalletMappedForARoll(companyCode: string, unitCode: string, rollId: number, pgType: PalletGroupTypeEnum): Promise<{ pgId: number, defaulPalletId: number, pgName: string, packListId: number}> {
        const pgItem = await this.palletGroupItemRepo.findOne({select: ['pgId', 'packListId'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, pgType: pgType, itemLinesId: rollId}});
        if(!pgItem) {
            throw new ErrorResponse(6103, 'The roll is not mapped to any of the pallet groups');
        }
        const pg = await this.palletGroupRepo.findOne({select: ['id', 'pgName', 'confirmedPalletId'], where: { id: pgItem.pgId, isActive: true}});
        if(!pg) {
            throw new ErrorResponse(6104, 'No pallet group found for : ' + pgItem.pgId);
        }
        return { pgId: pg.id, defaulPalletId: pg.confirmedPalletId, pgName: pg.pgName, packListId: pg.packListId};
    }

    // HELPER
    // READER
    async getConfirmedPalletMappedForARoll(companyCode: string, unitCode: string, rollId: number): Promise<{ pgId: number, defaulPalletId: number, pgName: string,  packListId: number}> {
        const pgItem = await this.palletRollMapRepo.findOne({select: ['confirmedPalletId', 'packListId'], where: { companyCode: companyCode, unitCode: unitCode, isActive: true, itemLinesId: rollId}});
        return { pgId: null, defaulPalletId: pgItem?.confirmedPalletId, pgName: null, packListId: pgItem?.packListId};
    }

    // HELPER
    // READER
    async getRollIdsMappedForPg(companyCode: string, unitCode: string, pgId: number,  transManager: GenericTransactionManager): Promise<number[]> {
        const rollIds: number[] = [];
        let rolls: PalletGroupItemsEntity[] = [];
        if(transManager) {
            rolls = await transManager.getRepository(PalletGroupItemsEntity).find({select: ['itemLinesId'], where: { pgId: pgId, companyCode: companyCode, unitCode: unitCode} });
        } else {
            rolls = await this.palletGroupItemRepo.find({select: ['itemLinesId'], where: { pgId: pgId, companyCode: companyCode, unitCode: unitCode} });
        }
        rolls.forEach(r => {
            rollIds.push(r.itemLinesId);
        });
        return rollIds;
    }

    async getConfirmedPalletIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
       return await this.palletRollMapRepo.getConfirmedPalletIdsForPackList(companyCode, unitCode, packListId);
    }

    async getGrnCompletedBuNotInWhPackListCount(companyCode: string, unitCode: string, packListId: number[]): Promise<number> {
        return await this.palletRollMapRepo.getGrnCompletedBuNotInWhPackListCount(companyCode, unitCode, packListId);
    }
}