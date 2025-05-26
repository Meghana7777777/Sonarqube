import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BinDetailsModel, BinDetailsResponse, CurrentPalletLocationEnum, CurrentPalletStateEnum, GlobalResponseObject, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackingListInfoModel, PackingListInfoResponse, PalletBehaviourEnum, PalletBinStatusEnum, PalletDetailsModel, PalletDetailsResponse, PalletGroupTypeEnum, PalletIdRequest, PalletRollMappingRequest, PalletSortPrefEnum, PhBatchLotRollRequest, RollBasicInfoModel, RollBasicInfoResponse, RollInfoModel, RollsGrnRequest } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { BinsDataService } from '../master-data/master-services/bins/bins.services';
import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';


@Injectable()
export class LcoationMappingHelperService {
    constructor(
        private dataSource: DataSource,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinRepo: PalletBinMapRepo,
        @Inject(forwardRef(() => PackingListInfoService)) private packlistInfoService: PackingListInfoService,
        @Inject(forwardRef(() => PalletsDataService)) private palletsService: PalletsDataService,
        @Inject(forwardRef(() => BinsDataService)) private binsService: BinsDataService,
    ) {

    }

    async getInspectionRollIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        return await this.packlistInfoService.getRollIdsForPackList(companyCode, unitCode, packListId, CurrentPalletLocationEnum.INSPECTION);
    }

    async getWarehouseRollIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        return await this.packlistInfoService.getRollIdsForPackList(companyCode, unitCode, packListId, CurrentPalletLocationEnum.WAREHOUSE);
    }

    async getRollIdsForPallet(companyCode: string, unitCode: string, palletId: number, rollMapStatus: PalletBinStatusEnum[]): Promise<number[]> {
        const rollIds: number[] = [];
        const allocatedRollsForPallet = await this.palletRollMapRepo.find({
            select: ['suggestedPalletId', 'confirmedPalletId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedPalletId: palletId, isActive: true, status: In(rollMapStatus) }
        });
        // all the rolls in the pallet
        const allocatedRollIds = allocatedRollsForPallet.map(r => r.itemLinesId);
        return allocatedRollIds;
    }

    // HELPER
    async getBasicInfoForRollIds(companyCode: string, unitCode: string, rollIds: number[]): Promise<RollBasicInfoModel[]> {
        const rollsBasicInfo: RollBasicInfoModel[] = await this.packlistInfoService.getRollsBasicInfoForRollIds(companyCode, unitCode, rollIds);
        return rollsBasicInfo ?? [];
    }

    // HELPER
    // NOTE: NEED TO OVERRIDE THE ALLOCTION CONFIRMATION STATUS
    // -----------------------------------------------------------------------------------------------------------------------------------------
    async getRollInfoForRollIds(companyCode: string, unitCode: string, rollIds: number[], iNeedRollActualInfoAlso: boolean): Promise<RollInfoModel[]> {
        const rollsInfo: RollInfoModel[] = await this.packlistInfoService.getRollInfoForRollIds(companyCode, unitCode, rollIds, iNeedRollActualInfoAlso);
        if (rollsInfo.length == 0) {
            throw new ErrorResponse(6081, 'Given objects doesnt exist');
        }
        // now update the mapping status of the pallet if it is already mapped to a pallet
        // -------------------------- NEEDS status OVERRIDE --------------------
        for (const roll of rollsInfo) {
            // check if the roll is confirmed to any pallet
            const rollConf = await this.palletRollMapRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, itemLinesId: roll.id, isActive: true, status: PalletBinStatusEnum.CONFIRMED } });
            roll.status = rollConf > 0 ? PalletBinStatusEnum.CONFIRMED : PalletBinStatusEnum.OPEN;
        }
        return rollsInfo ?? [];
    }

    // HELPER
    getRollIdsInfoMap(basicRollsInfo: RollBasicInfoModel[]): Map<number, RollBasicInfoModel> {
        const rollBasicInfoMap = new Map<number, RollBasicInfoModel>();
        basicRollsInfo.forEach(r => {
            rollBasicInfoMap.set(r.rollId, r);
        });
        return rollBasicInfoMap;
    }


    // HELPER
    // NOTE: NEED TO OVERRIDE THE ALLOCTION CONFIRMATION STATUS
    // -----------------------------------------------------------------------------------------------------------------------------------------
    async getBasicInfoForPalletIds(companyCode: string, unitCode: string, palletIds: number[]): Promise<PalletDetailsModel[]> {
        let palletBasicInfo: PalletDetailsModel[] = await this.palletsService.getPalletsBasicInfo(companyCode, unitCode, palletIds);
        if (palletBasicInfo.length == 0) {
            throw new ErrorResponse(6082, 'Selected pallets does not exist');
        }
        // -------------------------- NEEDS status OVERRIDE --------------------
        // now update the mapping status of the pallet if it is already mapped to a bin
        for (const pallet of palletBasicInfo) {
            const palletConf = await this.palletBinRepo.count({ where: { companyCode: companyCode, unitCode: unitCode, palletId: pallet.palletId, isActive: true, status: PalletBinStatusEnum.CONFIRMED } });
            pallet.status = palletConf > 0 ? PalletBinStatusEnum.CONFIRMED : PalletBinStatusEnum.OPEN;
        }
        return palletBasicInfo ?? [];
    }

    // API
    // TODO API
    async getBasicInfoForBinIds(companyCode: string, unitCode: string, binIds: number[]): Promise<BinDetailsModel[]> {
        // call the API and get the pack list ids for the roll ids
        const bins = await this.binsService.getBinsBasicInfo(companyCode, unitCode, binIds);
        if (bins.length == 0) {
            throw new ErrorResponse(6332, 'Selected bins does not exist');
        }
        return bins ?? [];
    }

    // API
    // TODO API
    async getAllSpaceFreePalletsInWarehouse(companyCode: string, unitCode: string): Promise<PalletDetailsModel[]> {
        const freePallets: PalletDetailsModel[] = [];
        // call the API and get the pack list ids for the roll ids
        // MUST get the consumed qty of the pallets whose confirmed_pallet_id has some value
        const allPalletsInWh = await this.palletsService.getAllPalletsBasicInfo(companyCode, unitCode);
        for (const pallet of allPalletsInWh) {
            // get the allocated qty from the pallet roll map

            // -----------------     CONFIRMED ROLLS ----------------------
            let currentRollsInPallet = 0;
            const confirmedRolls = await this.palletRollMapRepo.find({ select: ['id', 'itemLinesId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedPalletId: pallet.palletId, status: PalletBinStatusEnum.CONFIRMED, isActive: true } });
            const confirmedRollIds = confirmedRolls.map(r => r.itemLinesId);
            const confirmedRollBasicInfo: RollBasicInfoModel[] = await this.getBasicInfoForRollIds(companyCode, unitCode, confirmedRollIds);
            // const consumedPalletQty = confirmedRollBasicInfo.reduce((sum, r) => sum + Number(r.leftOverQuantity), 0);
            const palletGroupType = new Set<PalletGroupTypeEnum>()
            confirmedRollBasicInfo.forEach(r => {
                palletGroupType.add(r.inspectionPick ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE)
                // only if the roll have some qty in the pallet, then we can consider the roll as a valid one in the pallet
                if (Number(r.leftOverQuantity) > 0) {
                    currentRollsInPallet += 1;
                }
            });
            pallet.palletGroupType = Array.from(palletGroupType)
            // -----------------    ALLOCATED ROLLS ----------------------
            // UNCOMMENT THE BELOW LINES IF YOU NEDD TO CONSIDER THE SUGGESSTED ROLLS ALSO
            /*
            let allocatedRollsInPallet = 0;
            const allocatedRolls = await this.palletRollMapRepo.find({select: ['id', 'itemLinesId'], where: { suggestedPalletId: pallet.palletId, status: PalletBinStatusEnum.OPEN, isActive: true} });
            const allocatedRollIds = allocatedRolls.map(r => r.itemLinesId);
            const allocatedRollBasicInfo: RollBasicInfoModel[] = await this.getBasicInfoForRollIds(companyCode, unitCode, allocatedRollIds);
            // calculate the conumed qty of the pallet
            const allocatedPalletQty = allocatedRollBasicInfo.reduce((sum, r) => sum + Number(r.originalQty), 0);
            allocatedRollBasicInfo.forEach(r => {
                // only if the roll have some qty in the pallet, then we can consider the roll as a valid one in the pallet
                if(Number(r.originalQty) > 0) {
                    allocatedRollsInPallet += 1;
                }
            });
            */

            // override the qtys by using the refernece
            // pallet.confirmedQty = consumedPalletQty;
            pallet.totalConfirmedRolls = currentRollsInPallet;
            // pallet.allocatedQty = allocatedPalletQty;
            // pallet.totalAllocatedRolls = allocatedRollsInPallet;
            pallet.allocatedQty = 0;
            pallet.totalAllocatedRolls = 0;

            // No calculate the system alloactions
            // decide if the pallet has some free space
            let canSupportSomeWeight = true;
            let canSupportSomeRolls = false;
            let canSupportSomeCapacity = true;

            // canSupportSomeRolls = (pallet.maxItems - currentRollsInPallet + allocatedRollsInPallet) > 0;
            // canSupportSomeCapacity = (pallet.palletCapacity - consumedPalletQty + allocatedPalletQty) > 0;
            canSupportSomeRolls = (pallet.maxItems - currentRollsInPallet + 0) > 0;
            // canSupportSomeCapacity = (pallet.palletCapacity - consumedPalletQty + 0) > 0;
            if (canSupportSomeWeight && canSupportSomeRolls && canSupportSomeCapacity) {
                freePallets.push(pallet);
            } else {
                // skip to next pallet
                continue;
            }
        }
        return freePallets ?? [];
    }

    // HELPER
    getPalletIdsInfoMap(basicRollsInfo: PalletDetailsModel[]): Map<number, PalletDetailsModel> {
        const rollBasicInfoMap = new Map<number, PalletDetailsModel>();
        basicRollsInfo.forEach(r => {
            rollBasicInfoMap.set(r.palletId, r);
        });
        return rollBasicInfoMap;
    }

    // HELPER
    async getAllSpaceFreeBinsInWarehouse(companyCode: string, unitCode: string): Promise<BinDetailsModel[]> {
        const freeBins: BinDetailsModel[] = [];
        const binsDetails = await this.binsService.getAllBinsBasicInfo(companyCode, unitCode);
        const binIds = binsDetails.map(rec => rec.binId);
        const { confirmedPalletsMap, allocatePalletsMap } = await this.getBinWithSuggestedAndConfirmedPallets(companyCode, unitCode, binIds, null);
        for (const bin of binsDetails) {
            const conFirmedPallets = confirmedPalletsMap.get(bin.binId)?.confirmedPallets ? confirmedPalletsMap.get(bin.binId)?.confirmedPallets : 0
            const allocatedPallets = allocatePalletsMap.get(bin.binId)?.allocatePallets ? allocatePalletsMap.get(bin.binId)?.allocatePallets : 0
            // check if this bin has any free space to put the pallets
            let palletsCount = conFirmedPallets + allocatedPallets;
            // override the current pallets in the bin
            bin.totalFilledPallets = conFirmedPallets;
            if (palletsCount < bin.totalSupportedPallets) {
                freeBins.push(bin);
            }
        }
        return freeBins;
    }

    // HELPER
    async getBinWithSuggestedAndConfirmedPallets(companyCode: string, unitCode: string, binIds: number[], manager: GenericTransactionManager): Promise<{
        confirmedPalletsMap: Map<number, {
            confirmedPallets: number;
        }>;
        allocatePalletsMap: Map<number, {
            allocatePallets: number;
        }>;
    }> {
        let confirmedPallets: PalletBinMapEntity[] = [];
        let allocatePallets: PalletBinMapEntity[] = [];
        if (manager) {
            confirmedPallets = await manager.getRepository(PalletBinMapEntity).find({ select: ['palletId', 'confirmedBinId', 'suggestedBinId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: In(binIds), status: PalletBinStatusEnum.CONFIRMED, isActive: true } });
            allocatePallets = await manager.getRepository(PalletBinMapEntity).find({ select: ['palletId', 'confirmedBinId', 'suggestedBinId'], where: { companyCode: companyCode, unitCode: unitCode, suggestedBinId: In(binIds), status: PalletBinStatusEnum.OPEN, isActive: true } });
        } else {
            confirmedPallets = await this.palletBinRepo.find({ select: ['palletId', 'confirmedBinId', 'suggestedBinId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: In(binIds), status: PalletBinStatusEnum.CONFIRMED, isActive: true } });
            allocatePallets = await this.palletBinRepo.find({ select: ['palletId', 'confirmedBinId', 'suggestedBinId'], where: { companyCode: companyCode, unitCode: unitCode, suggestedBinId: In(binIds), status: PalletBinStatusEnum.OPEN, isActive: true } });
        };
        const confirmedPalletsMap = new Map<number, { confirmedPallets: number }>();
        for (const rec of confirmedPallets) {
            if (!confirmedPalletsMap.has(rec.confirmedBinId)) {
                confirmedPalletsMap.set(rec.confirmedBinId, { confirmedPallets: 1 })
            } else {
                confirmedPalletsMap.get(rec.confirmedBinId).confirmedPallets += 1
            }
        }
        const allocatePalletsMap = new Map<number, { allocatePallets: number }>();
        for (const rec of allocatePallets) {
            if (!allocatePalletsMap.has(rec.suggestedBinId)) {
                allocatePalletsMap.set(rec.suggestedBinId, { allocatePallets: 1 })
            } else {
                allocatePalletsMap.get(rec.suggestedBinId).allocatePallets += 1
            }
        }
        return { confirmedPalletsMap, allocatePalletsMap, };
    }

    // HELPER
    async updatePalletLocationState(companyCode: string, unitCode: string, palletIds: number[], locationState: CurrentPalletLocationEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        return await this.palletsService.updatePalletLocationState(companyCode, unitCode, palletIds, locationState, username, transManager);
    }


    // HELPER
    // WRITER
    async updatePalletLocWorkBehState(companyCode: string, unitCode: string, palletIds: number[], locationState: CurrentPalletLocationEnum, behaviourStatus: PalletBehaviourEnum, workStatus: CurrentPalletStateEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        return await this.palletsService.updatePalletLocWorkBehState(companyCode, unitCode, palletIds, locationState, behaviourStatus, workStatus, username, transManager);
    }

    // HELPER
    // WRITER
    async updateGrnCompleteForRollAndPackListAutomatically(companyCode: string, unitCode: string, rollId: number, packListId: number, username: string, transManager: GenericTransactionManager): Promise<GlobalResponseObject> {
        return await this.packlistInfoService.updateGrnCompleteForRollAndPackListAutomatically(companyCode, unitCode, rollId, packListId, username, transManager);
    }

}