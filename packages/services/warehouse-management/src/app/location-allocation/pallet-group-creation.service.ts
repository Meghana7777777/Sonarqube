import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CurrentPalletLocationEnum, GlobalResponseObject, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackListIdRequest, PackingListInfoModel, PackingListInfoResponse, PalletBinStatusEnum, PalletDetailsModel, PalletDetailsResponse, PalletGroupTypeEnum, PalletIdRequest, PalletRollMappingRequest, PalletSortPrefEnum, PhBatchLotRollRequest, RollBasicInfoModel, RollBasicInfoResponse, RollsGrnRequest } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { DataSource } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';
import { PalletBinMappingService } from './pallet-bin-mapping.service';
import { dataSource } from '../../database/type-orm-config/typeorm.config-migrations';
import configuration from '../../config/configuration';
import { PalletGroupEntity } from './entities/pallet-group/pallet-group.entity';
import { PalletSubGroupEntity } from './entities/pallet-group/pallet-sub-group.entity';
import { PalletGroupItemsEntity } from './entities/pallet-group/pallet-group-items.entity';
import { PalletGroupRepo } from './repositories/pallet-group.repository';

@Injectable()
export class PalletGroupCreationService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        @Inject(forwardRef(() => LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
        private palletGroupRepo: PalletGroupRepo
    ) {

    }

    async getPalletGroupInfo(req: PackListIdRequest): Promise<GlobalResponseObject> {
        const pgs = await this.palletGroupRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packListId: req.packListId, isActive: true } });
        if (pgs) {
            throw new ErrorResponse(6100, 'Pallet groups already created for the pack list');
        }
        return new GlobalResponseObject(true, 6101, 'Pallet groups does not exist for the pack list.');
    }

    // ENDPOINT
    // WRITER
    async createPalletGroupsForPackList(req: PackListIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            // check if the mapping is already been created
            const packListId = req.packListId;
            const pgs = await this.palletGroupRepo.findOne({ select: ['id'], where: { companyCode: req.companyCode, unitCode: req.unitCode, packListId: req.packListId, isActive: true } });
            if (pgs) {
                throw new ErrorResponse(6100, 'Pallet groups already created for the pack list');
            }
            await transManager.startTransaction();
            // create the pallet groups for the inspection
            await this.createInspectionPalletGroups(req, transManager);
            // create the pallet groups for warehouse
            await this.createWarehousePalletGroups(req, transManager);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6101, 'Pallet groups created successfully');
        } catch (err) {
            await transManager.releaseTransaction();
            throw err;
        }
    }

    // HELPER
    // WRITER
    async createInspectionPalletGroups(req: PackListIdRequest, transManager: GenericTransactionManager): Promise<boolean> {
        const rollIds = await this.locAllocHelper.getInspectionRollIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, rollIds);
        const palletRollCapacity = configuration().appSepcific.palletRollCapacity;
        if (!palletRollCapacity) {
            throw new ErrorResponse(6333, 'Max pallet roll capacity is not defined');
        }
        // no group the rolls based on the bacth and the width group
        const groupedRolls = this.getBatchWidthWiseRolls(rollsInfo);
        // now based on the capacity of the pallet, split the map into chunks
        const pgGroupedRolls = this.getPgSaggregatedRolls(palletRollCapacity, groupedRolls, false);
        // based on the info, construct the pallet_group, pallet_sub_group and pallet_group_items entities
        let currentPgId = 0;
        for (const [pgName, pg] of pgGroupedRolls) {
            const pgEntity = this.getPalletGroupEntity(req.companyCode, req.unitCode, req.packListId, pgName, PalletGroupTypeEnum.INSPECTION, '', req.username);
            const savedPgEntity = await transManager.getRepository(PalletGroupEntity).save(pgEntity);
            currentPgId = savedPgEntity.id;
            for (const [batch, batchRolls] of pg) {
                const pgSubGroups: PalletSubGroupEntity[] = [];
                for (const [width, rolls] of batchRolls) {
                    const bathcId = rolls[0].phLinesId;
                    const pgSubEnt = this.getPalletSubGroupEntity(req.companyCode, req.unitCode, req.packListId, bathcId, currentPgId, PalletGroupTypeEnum.INSPECTION, width?.toString(), rolls.length, '', req.username);

                    //push the records into an array
                    pgSubGroups.push(pgSubEnt);

                    const pgItems: PalletGroupItemsEntity[] = [];
                    rolls.forEach(roll => {
                        const pgItem = this.getPalletGroupItemsEntity(req.companyCode, req.unitCode, req.packListId, roll.rollId, currentPgId, pgName, PalletGroupTypeEnum.INSPECTION, '', req.username);
                        pgItems.push(pgItem);
                    });
                    await transManager.getRepository(PalletGroupItemsEntity).save(pgItems, { reload: false });
                }
                await transManager.getRepository(PalletSubGroupEntity).save(pgSubGroups);
            }
        }

        return true;
    }

    // HELPER
    getPalletGroupEntity(companyCode: string, unitCode: string, packListId: number, pgName: string, pgType: PalletGroupTypeEnum, remarks: string, username: string): PalletGroupEntity {
        const ent = new PalletGroupEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgName = pgName;
        ent.pgType = pgType;
        ent.remarks = remarks;
        return ent;
    }

    // HELPER
    getPalletSubGroupEntity(companyCode: string, unitCode: string, packListId: number, phLinesId: number, pgId: number, pgType: PalletGroupTypeEnum, width: string, itemCount: number, remarks: string, username: string): PalletSubGroupEntity {
        const ent = new PalletSubGroupEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgId = pgId;
        ent.pgType = pgType;
        ent.remarks = remarks;
        ent.itemCount = itemCount;
        ent.phLinesId = phLinesId;
        ent.width = width;
        return ent;
    }

    // HELPER
    getPalletGroupItemsEntity(companyCode: string, unitCode: string, packListId: number, itemLinesId: number, pgId: number, pgName: string, pgType: PalletGroupTypeEnum, remarks: string, username: string): PalletGroupItemsEntity {
        const ent = new PalletGroupItemsEntity();
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        ent.createdUser = username;
        ent.packListId = packListId;
        ent.pgName = pgName;
        ent.pgType = pgType;
        ent.remarks = remarks;
        ent.itemLinesId = itemLinesId;
        ent.pgId = pgId;
        ent.pgName = pgName;
        return ent;
    }

    // HELPER
    getBatchWidthWiseRolls(rollsInfo: RollBasicInfoModel[]): Map<string, Map<number, RollBasicInfoModel[]>> {
        const map = new Map<string, Map<number, RollBasicInfoModel[]>>();
        rollsInfo.forEach(r => {
            const width = Math.ceil(Number(r.width));
            if (!map.has(r.batch)) {
                map.set(r.batch, new Map<number, RollBasicInfoModel[]>());
            }
            if (!map.get(r.batch).has(width)) {
                map.get(r.batch).set(width, []);
            }
            map.get(r.batch).get(width).push(r);
        });
        return map;
    }

    // HELPER
    getPgSaggregatedRolls(palletRollCapacity: number, groupedRolls: Map<string, Map<number, RollBasicInfoModel[]>>, saggregateBatchWise: boolean) {
        let pgCounter = 1;
        let cpPendingRolls = palletRollCapacity;
        let currentPallet = 1;
        let currPgName = 'PG-1';

        const pgMap = new Map<string, Map<string, Map<number, RollBasicInfoModel[]>>>();
        pgMap.set(currPgName, new Map<string, Map<number, RollBasicInfoModel[]>>);

        groupedRolls.forEach((b, batch) => {
            b.forEach((wRolls, rollWidth) => {
                wRolls.forEach((r, i) => {
                    cpPendingRolls--;

                    // NOTE: Do not move these below 2 set statements above the for loop for performance optimization. 
                    if (!pgMap.get(currPgName).has(batch)) {
                        pgMap.get(currPgName).set(batch, new Map<number, RollBasicInfoModel[]>());
                    }
                    if (!pgMap.get(currPgName).get(batch).has(rollWidth)) {
                        pgMap.get(currPgName).get(batch).set(rollWidth, []);
                    }
                    // push the roll to the existing PG
                    pgMap.get(currPgName).get(batch).get(rollWidth).push(r);

                    // set the new key to the map
                    if (cpPendingRolls == 0) {
                        pgCounter++;
                        currPgName = 'PG-' + pgCounter;
                        // create a new  PG here and set all the properties to the map
                        pgMap.set(currPgName, new Map<string, Map<number, RollBasicInfoModel[]>>);
                        cpPendingRolls = palletRollCapacity;
                    }
                });
            });

            // If the pallet grouping is done for the 
            if (saggregateBatchWise) {
                // before initilaizing it to one, just check if the current batch has 0 records, then pg name should not be incremented
                if (pgMap.get(currPgName)?.get(batch)?.size > 0) {
                    // do nothing
                    pgCounter++;
                    currPgName = 'PG-' + pgCounter;
                    cpPendingRolls = palletRollCapacity;
                    pgMap.set(currPgName, new Map<string, Map<number, RollBasicInfoModel[]>>);
                }
            }
        });
        return pgMap;
    }

    // HELPER
    // WRITER
    async createWarehousePalletGroups(req: PackListIdRequest, transManager: GenericTransactionManager): Promise<boolean> {
        const rollIds = await this.locAllocHelper.getWarehouseRollIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, rollIds);
        const palletRollCapacity = configuration().appSepcific.palletRollCapacity;
        if (!palletRollCapacity) {
            throw new ErrorResponse(6333, 'Max pallet roll capacity is not defined');
        }
        // no group the rolls based on the bacth and the width group
        const groupedRolls = this.getBatchWidthWiseRolls(rollsInfo);
        // now based on the capacity of the pallet, split the map into chunks
        const pgGroupedRolls = this.getPgSaggregatedRolls(palletRollCapacity, groupedRolls, true);
        // based on the info, construct the pallet_group, pallet_sub_group and pallet_group_items entities
        let currentPgId = 0;
        for (const [pgName, pg] of pgGroupedRolls) {
            for (const [batch, batchRolls] of pg) {
                const pgEntity = this.getPalletGroupEntity(req.companyCode, req.unitCode, req.packListId, pgName, PalletGroupTypeEnum.WAREHOUSE, '', req.username);
                const savedPgEntity = await transManager.getRepository(PalletGroupEntity).save(pgEntity);
                currentPgId = savedPgEntity.id;

                const pgSubGroups: PalletSubGroupEntity[] = [];
                for (const [width, rolls] of batchRolls) {
                    const bathcId = rolls[0].phLinesId;

                    const pgSubEnt = this.getPalletSubGroupEntity(req.companyCode, req.unitCode, req.packListId, bathcId, currentPgId, PalletGroupTypeEnum.WAREHOUSE, width?.toString(), rolls.length, '', req.username);

                    //push the records into an array
                    pgSubGroups.push(pgSubEnt);

                    const pgItems: PalletGroupItemsEntity[] = [];
                    rolls.forEach(roll => {
                        const pgItem = this.getPalletGroupItemsEntity(req.companyCode, req.unitCode, req.packListId, roll.rollId, currentPgId, pgName, PalletGroupTypeEnum.WAREHOUSE, '', req.username);
                        pgItems.push(pgItem);
                    });
                    await transManager.getRepository(PalletGroupItemsEntity).save(pgItems, { reload: false });
                }
                await transManager.getRepository(PalletSubGroupEntity).save(pgSubGroups);
            }
        }

        return true;
    }

    // HELPER
    // WRITER
    async updatePalletIdToPg(companyCode: string, unitCode: string, pgId: number, palletId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        await transManager.getRepository(PalletGroupEntity).update({ id: pgId }, { confirmedPalletId: palletId, updatedUser: username });
        return true;
    }
}