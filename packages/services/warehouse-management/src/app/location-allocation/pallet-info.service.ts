import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CommonRequestAttrs, CurrentPalletLocationEnum, GlobalResponseObject, InsInspectionLevelEnum, InspectionPalletGroupedRollsModel, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackListIdRequest, PackListPalletCfNcfPfendingRollsModel, PackingListInfoModel, PackingListInfoResponse, PalletBinStatusEnum, PalletDetailsModel, PalletDetailsResponse, PalletIdRequest, PalletRollMappingRequest, PalletSortPrefEnum, PhBatchLotRollRequest, RollBasicInfoModel, RollBasicInfoResponse, RollInfoModel, RollsGrnRequest, WarehousePalletRollsModel, WarehousePalletRollsResponse, PackListPalletCfNcfPfendingRollsResponse, BinDetailsModel, PalletRollsResponse, PalletRollsModel, RollIdsRequest, PalletAndBinResponse, PalletAndBinModel } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { PalletAndBinCodeQueryResponse } from './repositories/query-response.ts/pallet-and-bin-data.query.response';


@Injectable()
export class PalletInfoService {
    constructor(
        private dataSource: DataSource,
        private palletBinMapRepo: PalletBinMapRepo,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinMapHistoryRepo: PalletBinMapHistoryRepo,
        private palletRollMapHistoryRepo: PalletRollMapHistoryRepo,
        @Inject(forwardRef(() => LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
    ) {

    }

    async getPalletInfoAndItsRollIds(companyCode: string, unitCode: string, palletId: number, needBinsInfo: boolean): Promise<PalletDetailsModel> {
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(companyCode, unitCode, [palletId]);
        const currPalletInfo = palletsInfo[0];
        if (!currPalletInfo) {
            throw new ErrorResponse(6105, 'Pallet does not exist');
        }
        // get the total allocated rolls and the confirmed rolls in the pallet
        const confirmedRollsForPallet = await this.palletRollMapRepo.find({
            select: ['suggestedPalletId', 'confirmedPalletId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedPalletId: palletId, isActive: true, status: In([PalletBinStatusEnum.CONFIRMED]) }
        });
        const allocatedRollsForPallet = await this.palletRollMapRepo.find({
            select: ['suggestedPalletId', 'confirmedPalletId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedPalletId: palletId, isActive: true, status: In([PalletBinStatusEnum.OPEN]) }
        });

        const binsInfo = needBinsInfo ? await this.getSuggestedAndConfirmedInfoForPalletId(companyCode, unitCode, palletId) : { s: null, c: null };
        const palletDetails = new PalletDetailsModel('', unitCode, companyCode, 0, currPalletInfo.barcode, palletId, currPalletInfo.palletCode, currPalletInfo.palletCapacity, currPalletInfo.uom, currPalletInfo.maxItems, currPalletInfo.status, currPalletInfo.palletCurrentLoc, currPalletInfo.palletCureentState, confirmedRollsForPallet.length, currPalletInfo.confirmedQty, allocatedRollsForPallet.length, currPalletInfo.allocatedQty, binsInfo.s, binsInfo.s);
        return palletDetails;
    }

    // END POINT
    // RETRIEVAL
    async getPalletMappingInfoWithoutRolls(req: PalletIdRequest): Promise<PalletDetailsResponse> {
        // get the pallet header info
        const palletsDetails: PalletDetailsModel[] = [];
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
        const palletConsumedQtyInfo = await this.getPalletConsumedQty(req.companyCode, req.unitCode, req.palletId, [PalletBinStatusEnum.CONFIRMED, PalletBinStatusEnum.OPEN]);
        const currentPalletInfo = palletsInfo[0];
        const binsInfo = await this.getSuggestedAndConfirmedInfoForPalletId(req.companyCode, req.unitCode, currentPalletInfo.palletId);
        const palletDetails = new PalletDetailsModel(req.username, req.unitCode, req.companyCode, req.userId, currentPalletInfo.barcode, req.palletId, currentPalletInfo.palletCode, currentPalletInfo.palletCapacity, currentPalletInfo.uom, currentPalletInfo.maxItems, currentPalletInfo.status, currentPalletInfo.palletCurrentLoc, currentPalletInfo.palletCureentState, palletConsumedQtyInfo.confirmedRolls, palletConsumedQtyInfo.confirmedQty, palletConsumedQtyInfo.allocatedRolls, palletConsumedQtyInfo.allocatedQty, binsInfo.s, binsInfo.c);
        palletsDetails.push(palletDetails);
        return new PalletDetailsResponse(true, 6336, 'Pallet info retrieved successfully', palletsDetails);
    }


    async getSuggestedAndConfirmedInfoForPalletId(companyCode: string, unitCode: string, palletId: number): Promise<{ s: BinDetailsModel, c: BinDetailsModel }> {
        const rec = await this.palletBinMapRepo.findOne({ select: ['confirmedBinId', 'suggestedBinId', 'status'], where: { companyCode: companyCode, unitCode: unitCode, palletId: palletId, isActive: true } });
        if (!rec) {
            return { s: null, c: null };
        }
        const suggestedBinId = rec.suggestedBinId;
        const confirmedBinId = rec.confirmedBinId;
        // if the pallet is not confirmed to any bin, then only get the suggested bin info
        if (rec.status == PalletBinStatusEnum.OPEN) {
            const binsInfo = await this.locAllocHelper.getBasicInfoForBinIds(companyCode, unitCode, [suggestedBinId]);
            return { s: binsInfo[0], c: null };
        } else {
            const binsInfo = await this.locAllocHelper.getBasicInfoForBinIds(companyCode, unitCode, [suggestedBinId, confirmedBinId]);
            const sBinInfo = binsInfo.filter(r => r.binId == suggestedBinId);
            const cBinInfo = binsInfo.filter(r => r.binId == confirmedBinId);

            return { s: sBinInfo[0], c: cBinInfo[0] };
        }
    }

    // HELPER 
    // getting the confirmed, allocated rolls for a given pallet id
    async getPalletConsumedQty(companyCode: string, unitCode: string, palletId: number, rollMapStatus: PalletBinStatusEnum[]): Promise<{ allocatedRolls: number, allocatedQty: number, confirmedRolls: number, confirmedQty: number }> {
        const allocatedRollsForPallet = await this.palletRollMapRepo.find({
            select: ['suggestedPalletId', 'confirmedPalletId', 'itemLinesId', 'status'],
            where: { companyCode: companyCode, unitCode: unitCode, confirmedPalletId: palletId, isActive: true, status: In(rollMapStatus) }
        });
        // all the rolls in the pallet
        const allocatedRollIds = allocatedRollsForPallet.map(r => r.itemLinesId);

        // get the roll quantities for the rolls
        const rollsBasicInfo: RollBasicInfoModel[] = await this.locAllocHelper.getBasicInfoForRollIds(companyCode, unitCode, allocatedRollIds);
        const rollInfoMap: Map<number, RollBasicInfoModel> = await this.locAllocHelper.getRollIdsInfoMap(rollsBasicInfo);
        // just a cross check that all the rolls are a part of the items table
        // calculate the conumed qty of the pallet
        let allocatedRolls = 0;
        let allocatedQty = 0;
        let confirmedRolls = 0;
        let confirmedQty = 0;
        allocatedRollsForPallet.forEach(rec => {
            const rollId = rec.itemLinesId;
            const rollLeftOverQty = rollInfoMap.get(rollId)?.leftOverQuantity;
            if (rollLeftOverQty > 0) {
                // seggregate the confirmed rolls and confirmed qty
                if (rec.status == PalletBinStatusEnum.OPEN) {
                    allocatedQty += Number(rollLeftOverQty);
                    allocatedRolls += 1;

                    // seggregate the allocated rolls and allocated qty
                } else if (rec.status == PalletBinStatusEnum.CONFIRMED) {
                    confirmedQty += Number(rollLeftOverQty);
                    confirmedRolls += 1;
                }
            }
        });
        return { allocatedRolls: allocatedRolls, allocatedQty: allocatedQty, confirmedRolls: confirmedRolls, confirmedQty: confirmedQty };
    }

    // END POINT
    // RETRIEVAL
    // get the pallets mapped for a given packing list
    async getPalletsMappedForPackingList(req: PackListIdRequest): Promise<PalletDetailsResponse> {
        const confirmedPalletIdsForPackList = await this.palletRollMapRepo.getConfirmedPalletIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const suggestedPalletIdsForPackList = await this.palletRollMapRepo.getSuggestedPalletIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        if (confirmedPalletIdsForPackList.length == 0 && suggestedPalletIdsForPackList.length == 0) {
            throw new ErrorResponse(6106, 'No pallets mapped for the packing list');
        }
        const palletIds = new Set<number>();
        confirmedPalletIdsForPackList.forEach(r => palletIds.add(r));
        suggestedPalletIdsForPackList.forEach(r => palletIds.add(r));
        const finalPalletIds = Array.from(palletIds);
        // get all the pallet basic info
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, finalPalletIds);
        const palletsDetails: PalletDetailsModel[] = [];
        for (const pallet of palletsInfo) {

            const binsInfo = await this.getSuggestedAndConfirmedInfoForPalletId(req.companyCode, req.unitCode, pallet.palletId);

            const totalRollsInPallet = await this.locAllocHelper.getRollIdsForPallet(req.companyCode, req.unitCode, pallet.palletId, [PalletBinStatusEnum.CONFIRMED]);
            const palletDetails = new PalletDetailsModel(req.username, req.unitCode, req.companyCode, req.userId, pallet.barcode, pallet.palletId, pallet.palletCode, pallet.palletCapacity, pallet.uom, pallet.maxItems, pallet.status, pallet.palletCurrentLoc, pallet.palletCureentState, totalRollsInPallet?.length, 0, 0, 0, binsInfo.s, binsInfo.c);
            palletsDetails.push(palletDetails);
        }
        return new PalletDetailsResponse(true, 6336, 'Pallet info retrieved successfully', palletsDetails);
    }

    // END POINT
    // RETRIEVAL
    async getInspectionPalletMappingInfoWithRolls(req: PalletIdRequest): Promise<InspectionPalletRollsResponse> {
        // get the pallet header info
        const palletDetails: InspectionPalletRollsModel[] = [];

        const packListIds = await this.palletRollMapRepo.getPacklistIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
        if (packListIds.length == 0) {
            throw new ErrorResponse(6107, 'No rolls mapped to the pallet');
        }
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
        const currentPalletInfo = palletsInfo[0];

        // for(const phId of packListIds) {
        // get the rolls under the packing lists
        const insWiseRollsDetails: InspectionPalletGroupedRollsModel[] = [];

        // const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletIdAndPhId(req.companyCode, req.unitCode, req.palletId, phId);
        const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
        const rollIds = new Set<number>();
        rollsInPallet.forEach(r => rollIds.add(r.item_lines_id));
        // seggregate the rolls based on the inpsection category .i.e BATCH / LOT / ROLL
        const seggregatedRolls = await this.seggregateRollsBasedOnInspectionType(req.companyCode, req.unitCode, Array.from(rollIds));

        for (const [rollType, addDetail] of seggregatedRolls) {
            const currRollIds = addDetail.rollIds;
            const rollInfoModels: RollInfoModel[] = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, currRollIds, true)
            // get the rolls info for all the rolls
            // todo:null----rollType
            const insTypeRollsModel = new InspectionPalletGroupedRollsModel(null, addDetail.objDesc, addDetail.objNumber, rollInfoModels);
            insWiseRollsDetails.push(insTypeRollsModel);
        }
        const palletPhDetail = new InspectionPalletRollsModel(0, currentPalletInfo.palletId, currentPalletInfo.palletCode, currentPalletInfo.palletCapacity, currentPalletInfo.uom, currentPalletInfo.maxItems, currentPalletInfo.palletCurrentLoc, currentPalletInfo.palletCureentState, insWiseRollsDetails,);
        palletDetails.push(palletPhDetail);
        // }
        return new InspectionPalletRollsResponse(true, 6336, 'Pallet info retrieved successfully', palletDetails);
    }

    // HELPER
    async seggregateRollsBasedOnInspectionType(companyCode: string, unitCode: string, rollIds: number[]): Promise<Map<InsInspectionLevelEnum, { rollIds: number[], objNumber: string, objDesc: string }>> {
        const inspectionLevelRollsMap = new Map<InsInspectionLevelEnum, { rollIds: number[], objNumber: string, objDesc: string }>();
        inspectionLevelRollsMap.set(InsInspectionLevelEnum.PACKING_LIST, { rollIds: rollIds, objDesc: 'Packlist', objNumber: '1' })
        return inspectionLevelRollsMap
    }

    // END POINT
    // RETRIEVAL
    async getWarehousePalletMappingInfoWithRolls(req: PalletIdRequest): Promise<WarehousePalletRollsResponse> {
        // get the pallet header info
        const palletDetails: WarehousePalletRollsModel[] = [];

        const packListIds = await this.palletRollMapRepo.getPacklistIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
        if (packListIds.length == 0) {
            throw new ErrorResponse(6107, 'No rolls mapped to the pallet');
        }
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
        const currentPalletInfo = palletsInfo[0];

        // for(const phId of packListIds) {
        // get the rolls under the packing lists
        // const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletIdAndPhId(req.companyCode, req.unitCode, req.palletId, phId);
        const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
        const rollIds = new Set<number>();
        rollsInPallet.forEach(r => rollIds.add(r.item_lines_id));

        const currRollIds = Array.from(rollIds);
        let rollInfoModels: RollInfoModel[] = [];
        if (currRollIds.length > 0) {
            rollInfoModels = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, currRollIds, false)
        }
        const palletPhDetail = new WarehousePalletRollsModel(null, 0, currentPalletInfo.palletId, currentPalletInfo.palletCode, currentPalletInfo.palletCapacity, currentPalletInfo.uom, currentPalletInfo.maxItems, currentPalletInfo.palletCurrentLoc, currentPalletInfo.palletCureentState, currentPalletInfo.status, rollInfoModels.length, rollInfoModels, []);
        palletDetails.push(palletPhDetail);
        // }
        return new WarehousePalletRollsResponse(true, 6336, 'Pallet info retrieved successfully', palletDetails);
    }

    // END POINT
    // RETRIEVAL
    async getAllSpaceFreePalletsInWarehouse(req: CommonRequestAttrs): Promise<PalletDetailsResponse> {
        const palletDetails = await this.locAllocHelper.getAllSpaceFreePalletsInWarehouse(req.companyCode, req.unitCode);
        return new PalletDetailsResponse(true, 6336, 'Pallet info retrieved successfully', palletDetails);
    }

    // END POINT
    // RETRIEVAL
    async getAllPendingToPalletConfirmationRollsInPackingList(req: PackListIdRequest): Promise<PackListPalletCfNcfPfendingRollsResponse> {
        const insRollsInPackList = await this.locAllocHelper.getInspectionRollIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const whRollsInPackList = await this.locAllocHelper.getWarehouseRollIdsForPackList(req.companyCode, req.unitCode, req.packListId);
        const packListRollIds: number[] = [];
        insRollsInPackList.forEach(r => packListRollIds.push(Number(r)));
        whRollsInPackList.forEach(r => packListRollIds.push(Number(r)));
        // get all the roll ids to which the pallet is already confirmed
        const confirmedRolls = await this.palletRollMapRepo.getConfirmedRollIdsForPackList(req.companyCode, req.unitCode, req.packListId, null);
        const diffRolls = [];
        packListRollIds.forEach(r => {
            if (!confirmedRolls.includes(r)) {
                diffRolls.push(r);
            }
        });
        // get all the pending rolls info
        const rollsInfo = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, diffRolls, false);
        const packListRollsModel = new PackListPalletCfNcfPfendingRollsModel(req.packListId, null, rollsInfo, []);
        return new PackListPalletCfNcfPfendingRollsResponse(true, 6337, 'Rolls for packing list retrieved', [packListRollsModel]);
    }

    // END POINT
    // RETRIEVAL
    async getAllPalletConfirmationRollsInPackingList(req: PackListIdRequest): Promise<PackListPalletCfNcfPfendingRollsResponse> {
        // get all the roll ids to which the pallet is already confirmed
        const confirmedRolls = await this.palletRollMapRepo.getConfirmedRollIdsForPackList(req.companyCode, req.unitCode, req.packListId, null);
        // get all the pending rolls info
        const rollsInfo = await this.locAllocHelper.getRollInfoForRollIds(req.companyCode, req.unitCode, confirmedRolls, false);
        const packListRollsModel = new PackListPalletCfNcfPfendingRollsModel(req.packListId, null, [], rollsInfo);
        return new PackListPalletCfNcfPfendingRollsResponse(true, 6337, 'Rolls for packing list retrieved', [packListRollsModel]);
    }


    async getAllOccupiedPalletsInWarehouse(req: CommonRequestAttrs): Promise<PalletDetailsResponse> {
        return null;
    }

    /**
    * Gets the rolls and its badic info mapped for the pallet. Any pallet.
    * RETRIEVER
    * @param req 
    * @returns 
    */
    async getPalletMappingInfoWithRolls(req: PalletIdRequest): Promise<PalletRollsResponse> {
        // get the pallet basic info 
        const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
        const currentPalletInfo = palletsInfo[0];
        // get all the rolls in the pallet
        const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
        const rollIds = new Set<number>();
        rollsInPallet.forEach(r => rollIds.add(r.item_lines_id));
        const currRollIds = Array.from(rollIds);
        let rollInfoModels: RollBasicInfoModel[] = [];
        if (currRollIds.length > 0) {
            rollInfoModels = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, currRollIds)
        } else {
            throw new ErrorResponse(6109, 'There are no rolls mapped to this pallet');
        }
        const palletRolls = new PalletRollsModel(currentPalletInfo.palletId, currentPalletInfo.palletCode, rollInfoModels);
        return new PalletRollsResponse(true, 6110, 'Rolls for pallet retrieved', [palletRolls]);
    }

    /**
     * Gets the rolls and its badic info mapped for the pallet. Any pallet.
     * RETRIEVER
     * @param req 
     * @returns 
     */
    async getPalletAndBinbyRollIdData(req: RollIdsRequest, throwError: boolean = true): Promise<PalletAndBinResponse> {
        const palletsInfo: PalletAndBinCodeQueryResponse[] = await this.palletRollMapRepo.getPalletAndBinCodeforRollsIds(req.companyCode, req.unitCode, (req.rollIds));
        console.log(palletsInfo);
        const palletAndBinResult: PalletAndBinModel[] = [];
        if (palletsInfo.length == 0 && throwError) {
            throw new ErrorResponse(6111, 'Pallet and Bin information not found');
        }
        for (const rollinfo of palletsInfo) {
            const palletAndBininfo = new PalletAndBinModel();
            palletAndBininfo.rollId = rollinfo.item_lines_id;
            palletAndBininfo.palletId = rollinfo.pallet_id;
            palletAndBininfo.palletName = rollinfo.pallet_name;
            palletAndBininfo.palletCode = rollinfo.pallet_code;
            palletAndBininfo.palletBarcode = rollinfo.pallet_barcode;
            palletAndBininfo.binId = rollinfo.bin_id;
            palletAndBininfo.binCode = rollinfo.bin_code;
            palletAndBininfo.binName = rollinfo.bin_name;
            palletAndBininfo.binBarcode = rollinfo.bin_barcode;
            palletAndBinResult.push(palletAndBininfo);
        }
        return new PalletAndBinResponse(true, 6112, 'Tray and trollesys rretrieved successfully', palletAndBinResult);

    }



}