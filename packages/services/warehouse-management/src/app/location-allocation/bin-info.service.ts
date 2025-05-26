import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BinDetailsModel, BinDetailsResponse, BinIdRequest, BinModel, BinPalletModel, CommonRequestAttrs, PackListIdRequest, PackingListInfoModel, PackingListInfoResponse, PalletBinStatusEnum, RackBinPalletsModel, RackBinPalletsResponse, RollBasicInfoModel, RollBasicInfoResponse, RollInfoModel, RollsGrnRequest, WarehousePalletRollsModel, WarehousePalletRollsResponse } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { BinsDataService } from '../master-data/master-services/bins/bins.services';
import { RacksDataService } from '../master-data/master-services/racks/racks.service';
import { BinRelatedDataQryResp } from './repositories/query-response.ts/bin-related-data.response';

@Injectable()
export class BinInfoService {
    constructor(
        private dataSource: DataSource,
        private palletBinMapRepo: PalletBinMapRepo,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinMapHistoryRepo: PalletBinMapHistoryRepo,
        private palletRollMapHistoryRepo: PalletRollMapHistoryRepo,
        @Inject(forwardRef(()=> LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
        @Inject(forwardRef(()=> BinsDataService)) private binsService: BinsDataService,
        @Inject(forwardRef(()=> RacksDataService)) private racksService: RacksDataService,
    ) {

    }

    // END POINT
    async getBinInfoWithoutPallets(req: BinIdRequest): Promise<BinDetailsResponse> {
        // get the bin info
        const binInfo = await this.binsService.getBinsBasicInfo(req.companyCode, req.unitCode, [req.binId]);
        const currentBinIno = binInfo[0];
        const totalPalletsInBinCurrently = await this.palletBinMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, confirmedBinId: currentBinIno.binId, status: PalletBinStatusEnum.CONFIRMED} });
        let emptyPalletIds: number[] = await this.getEmptyPalletsInBin(req.companyCode, req.unitCode, req.binId);
        const bin = new BinDetailsModel(currentBinIno.binId, currentBinIno.binCode, currentBinIno.binDesc, currentBinIno.totalSupportedPallets, totalPalletsInBinCurrently, emptyPalletIds.length, currentBinIno.rackId, currentBinIno.rackCode);
        return new BinDetailsResponse(true, 6348, 'Bin info retrieved successfully', [bin]);
    }

    // HELPER
    async getEmptyPalletsInBin(companyCode: string, unitCode: string, binId: number): Promise<number[]> {
        const emptyPalletIds: number[] = [];
        const totalPalletsInBinCurrently = await this.palletBinMapRepo.find({ select: ['id', 'palletId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: binId, status: PalletBinStatusEnum.CONFIRMED} });
        for(const pallet of totalPalletsInBinCurrently) {
            const palletsInBin = await this.palletRollMapRepo.find({select:['itemLinesId'], where: {  companyCode: companyCode, unitCode: unitCode, confirmedPalletId: pallet.palletId, status: PalletBinStatusEnum.CONFIRMED, isActive: true} });
            if(palletsInBin.length == 0) {
                emptyPalletIds.push(pallet.palletId);
            }
        }
        return emptyPalletIds;
    }

    // END POINT
    // RETRIEVAL
    async getBinsMappedForPackingList(req: PackListIdRequest): Promise<BinDetailsResponse> {
        // get the bins mapped to the packing list
        /**
         * First get all the pallet ids mapped for the packing list
         * then based on those pallets get the bin ids for those pallets
         * now get the bin info for those bin ids
         */
        const confirmedPalletIdsForPackList = await this.palletRollMapRepo.getConfirmedPalletIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const suggestedPalletIdsForPackList = await this.palletRollMapRepo.getConfirmedPalletIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        if(confirmedPalletIdsForPackList.length == 0 && suggestedPalletIdsForPackList.length == 0) {
            throw new ErrorResponse(6345, 'No pallets mapped for the packing list');
        }
        const palletIds = new Set<number>();
        confirmedPalletIdsForPackList.forEach(r => palletIds.add(r));
        suggestedPalletIdsForPackList.forEach(r => palletIds.add(r));
        const finalPalletIds = Array.from(palletIds);
        // get the bin ids for the pallet ids
        const confirmedBinsMappedToPallets = await this.palletBinMapRepo.getConfirmedBinIdsForPalletIds(req.companyCode, req.unitCode, finalPalletIds);
        const suggestedBinsMappedToPallets = await this.palletBinMapRepo.getSuggestedBinIdsForPalletIds(req.companyCode, req.unitCode, finalPalletIds);
        if(confirmedBinsMappedToPallets.length == 0 && suggestedBinsMappedToPallets.length == 0) {
            throw new ErrorResponse(6346, 'No bins mapped for the packing list');
        }
        const binIds = new Set<number>();
        confirmedBinsMappedToPallets.forEach(r => binIds.add(r));
        suggestedBinsMappedToPallets.forEach(r => binIds.add(r));
        const finalBinIds = Array.from(binIds);
        const bins: BinDetailsModel[] = [];
        const binsInfo = await this.binsService.getBinsBasicInfo(req.companyCode, req.unitCode, finalBinIds);
        for( const currentBinIno of binsInfo ){
            const totalPalletsInBinCurrently = await this.palletBinMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode,  confirmedBinId: currentBinIno.binId, status: PalletBinStatusEnum.CONFIRMED} });
            let emptyPalletIds: number[] = await this.getEmptyPalletsInBin(req.companyCode, req.unitCode, currentBinIno.binId)
            const bin = new BinDetailsModel(currentBinIno.binId, currentBinIno.binCode, currentBinIno.binDesc, currentBinIno.totalSupportedPallets, totalPalletsInBinCurrently, emptyPalletIds.length, currentBinIno.rackId, currentBinIno.rackCode);
            bins.push(bin);
        }
        return new BinDetailsResponse(true, 6344, 'Bin info retrieved successfully', bins);
    }

    // END POINT
    // RETRIEVAL
    async getBinPalletsWithRolls(req: BinIdRequest): Promise<RackBinPalletsResponse> {
        // get the bin info
        const binInfo = await this.binsService.getBinsBasicInfo(req.companyCode, req.unitCode, [req.binId]);
        const currentBinIno = binInfo[0];

        const rackInfo = await this.racksService.getRacksBasicInfo(req.companyCode, req.unitCode, [currentBinIno.rackId]);
        const currentRackInfo = rackInfo[0];

        const confirmedPalletIds = await this.palletBinMapRepo.getConfirmedPalletIdsForBinIds(req.companyCode, req.unitCode, [currentBinIno.binId]);
        const suggestedPalletIds = await this.palletBinMapRepo.getSuggestedPalletIdsForBinIds(req.companyCode, req.unitCode, [currentBinIno.binId]);
        const palletIds = new Set<number>();
        confirmedPalletIds.forEach(r => palletIds.add(r));
        suggestedPalletIds.forEach(r => palletIds.add(r));
        const finalPalletIds = Array.from(palletIds);

        // get the pallet info
        const palletDetails: WarehousePalletRollsModel[] = [];
        for(const palletId of finalPalletIds) {
            const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [palletId]);
            const currentPalletInfo = palletsInfo[0];

            const packListIds = await this.palletRollMapRepo.getPacklistIdsForPalletId(req.companyCode, req.unitCode, palletId);

            for(const phId of packListIds) {
                // get the rolls under the packing lists
                const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletIdAndPhId(req.companyCode, req.unitCode, palletId, phId);
                const rollIds = new Set<number>();
                rollsInPallet.forEach(r => rollIds.add(r.item_lines_id) );
    
                const currRollIds = Array.from(rollIds);
                const rollInfoModels: RollInfoModel[] = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, currRollIds,false)
    
                const palletPhDetail = new WarehousePalletRollsModel(null, phId, palletId, currentPalletInfo.palletCode, currentPalletInfo.palletCapacity, currentPalletInfo.uom, currentPalletInfo.maxItems, currentPalletInfo.palletCurrentLoc, currentPalletInfo.palletCureentState, currentPalletInfo.status, rollInfoModels.length, rollInfoModels, []);
                palletDetails.push(palletPhDetail);
            }
        }
    
        const binDetails = new BinPalletModel(currentBinIno.binId, currentBinIno.binCode, currentBinIno.binDesc, currentBinIno.totalSupportedPallets, currentBinIno.totalFilledPallets, 0, palletDetails);
        const rackDetails = new RackBinPalletsModel(currentRackInfo.id, currentRackInfo.code, currentRackInfo.code, currentRackInfo.levels, [binDetails]);

        return new RackBinPalletsResponse(true, 6347, 'Bin pallets and rolls retrieved successfully', [rackDetails]);
    }

    // END POINT
    // RETRIEVAL
    async getBinPalletsWithoutRolls(req: BinIdRequest): Promise<RackBinPalletsResponse> {
        // get the bin info
        const binInfo = await this.binsService.getBinsBasicInfo(req.companyCode, req.unitCode, [req.binId]);
        const currentBinIno = binInfo[0];

        const rackInfo = await this.racksService.getRacksBasicInfo(req.companyCode, req.unitCode, [currentBinIno.rackId]);
        const currentRackInfo = rackInfo[0];
        const confirmedPalletIds = await this.palletBinMapRepo.getConfirmedPalletIdsForBinIds(req.companyCode, req.unitCode, [currentBinIno.binId]);
        const suggestedPalletIds = await this.palletBinMapRepo.getSuggestedPalletIdsForBinIds(req.companyCode, req.unitCode, [currentBinIno.binId]);
        const palletIds = new Set<number>();
        confirmedPalletIds.forEach(r => palletIds.add(r));
        suggestedPalletIds.forEach(r => palletIds.add(r));
        const finalPalletIds = Array.from(palletIds);

        // get the pallet info
        const palletDetails: WarehousePalletRollsModel[] = [];
        for(const palletId of finalPalletIds) {
            const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [palletId]);
            const currentPalletInfo = palletsInfo[0];
            // get the total confirmed rolls for the pallet
            const totalRolls = await this.palletRollMapRepo.count({ where: { companyCode: req.companyCode, unitCode: req.unitCode, confirmedPalletId: currentPalletInfo.palletId, isActive: true }});
            const rollIdForPallet = await this.locAllocHelper.getRollIdsForPallet(req.companyCode, req.unitCode, palletId, [PalletBinStatusEnum.CONFIRMED]);
            const rollsBasicInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, rollIdForPallet);
            const palletPhDetail = new WarehousePalletRollsModel(null, 0, palletId, currentPalletInfo.palletCode, currentPalletInfo.palletCapacity, currentPalletInfo.uom, currentPalletInfo.maxItems, currentPalletInfo.palletCurrentLoc, currentPalletInfo.palletCureentState, currentPalletInfo.status, totalRolls, [], rollsBasicInfo);
            palletDetails.push(palletPhDetail);
        }
    
        const binDetails = new BinPalletModel(currentBinIno.binId, currentBinIno.binCode, currentBinIno.binDesc, currentBinIno.totalSupportedPallets, currentBinIno.totalFilledPallets, 0, palletDetails);
        const rackDetails = new RackBinPalletsModel(currentRackInfo.id, currentRackInfo.code, currentRackInfo.code, currentRackInfo.levels, [binDetails]);

        return new RackBinPalletsResponse(true, 6347, 'Bin pallets and rolls retrieved successfully', [rackDetails]);
    }

    // END POINT
    // RETRIEVAL
    async getAllSpaceFreeBinsInWarehouse(req: CommonRequestAttrs): Promise<BinDetailsResponse> {
        const bins = await this.locAllocHelper.getAllSpaceFreeBinsInWarehouse(req.companyCode, req.unitCode);
        return new BinDetailsResponse(true, 6348, 'Bins retrieved successfully', bins);
    }


    // HELPER
    async getPalletIdsInBin(binId: number, companyCode: string, unitCode: string): Promise<number[]> {
        const palletRecs = await this.palletBinMapRepo.find({select: ['palletId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: binId, isActive: true } });
        return palletRecs.map(r => r.palletId);
    }

    async getPalletsCountByBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
       return await this.palletBinMapRepo.getPalletsCountByBinIds(binIds, companyCode,unitCode);
    }
    

    async getTotalAndEmptyPalletCountForBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<BinRelatedDataQryResp[]> {
       return await this.palletBinMapRepo.getTotalAndEmptyPalletCountForBinIds(binIds, companyCode, unitCode);
    }


}