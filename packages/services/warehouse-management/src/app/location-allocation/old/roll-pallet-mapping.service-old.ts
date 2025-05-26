// import { Injectable } from '@nestjs/common';
// import { CurrentPalletLocationEnum, GlobalResponseObject, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackingListInfoModel, PackingListInfoResponse, PalletBinStatusEnum, PalletDetailsModel, PalletDetailsResponse, PalletIdRequest, PalletRollMappingRequest, PalletSortPrefEnum, PhBatchLotRollRequest, RollBasicInfoModel, RollBasicInfoResponse, RollsGrnRequest } from '@xpparel/shared-models';
// import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
// import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
// import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
// import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
// import { DataSource } from 'typeorm';
// import { ErrorResponse } from '@xpparel/backend-utils';
// import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
// import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
// import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
// import { LcoationMappingHelperService } from './location-mapping-helper.service';
// import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
// import { InspectionInfoService } from '../inspection/inspection-info.service';
// import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';
// import { PalletBinMappingService } from './pallet-bin-mapping.service-old';

// @Injectable()
// export class RollPalletMappingServiceOld {
//     private CAPACITY_TRIMMER = 1;
//     constructor(
//         private dataSource: DataSource,
//         private palletRollMapRepo: PalletRollMapRepo,
//         private locAllocHelper: LcoationMappingHelperService,
//         private insInfoService: InspectionInfoService,
//         private palletBinMapService: PalletBinMappingService
//     ) {

//     }

//     /**
//      * 
//      * IN default, the [ confirmed pallet id = systematic pallet id ] AND the confirmation status = OPEN
//      * For any pallet available calculation, the buffer has to be calculated based on the confirmed pallet id 
//      * status = OPEN / CONFIRMED, in both ways the pallet is occupied for the systematic allocation..
//      * 
//      * After a roll has systematically allocated for a Pallet, then due to some manualy placements, the pallet is now not free to confirm the allocated rolls,
//      * then we must not allocate the roll to the pallet
//      * 
//      * 
//      */
//     // TODO:
//     /**
//      * V1: ensure that if the packing list id is sent, the scanning roll must belong to the same packing list
//      * V2: If inspection roll, then we have to check if the roll is matching for the inspection/warehouse
//      */
//     // END POINT
//     // FUNCTIONALITY
//     // MANUAL CONFIRMATION
//     async confirmRollsToPallet(req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
//         const transManager = new GenericTransactionManager(this.dataSource); 
//         try {
//             const overRideSysAllocation: boolean = req.isOverRideSysAllocation;
//             // map the roll to the pallet
//             // first check if we already have record for the roll in the pallet mapping
//             const palletRollMapEnts: PalletRollMapEntity[] = [];
//             const palletRollMapHistoryEnts: PalletRollMapHistoryEntity[] = [];
//             const incomingPackListId: number = req.packingListId;
//             const reqType = req.mappingRequestFor;

//             const rollIds = req.rollInfo.map( r => r.rollId);
//             const rollsBasicInfo: RollBasicInfoModel[] = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, rollIds);
//             const palletBasicInfo: PalletDetailsModel[] = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
//             const rollInfoMap: Map<number, RollBasicInfoModel> = await this.locAllocHelper.getRollIdsInfoMap(rollsBasicInfo);
//             const palletInfoMap: Map<number, PalletDetailsModel> = await this.locAllocHelper.getPalletIdsInfoMap(palletBasicInfo);
            
//             // if there is incoming pack list id in the request, then validate whether the current scanning rolls are a part of the packing list
//             if(incomingPackListId > 0) {
//                 for(const roll of rollsBasicInfo) {
//                     // if not macthcing, then throw error
//                     if(roll.packListId != incomingPackListId) {
//                         throw new ErrorResponse(0, `Roll ${roll.barcode} does not belong to the selected packing list`);
//                     }
//                 }
//             }
//             // if the request is for the insepction type, then check if the roll is allocated for inspection
//             if(reqType == CurrentPalletLocationEnum.INSPECTION) {
//                 // await this.validdateIfRollSelectedForInspection(req.companyCode, req.unitCode, rollIds);
//             } else if(reqType == CurrentPalletLocationEnum.WAREHOUSE)  {
//                 // currently no validation. Have to check with the business
//             }

//             await transManager.startTransaction();
//             for(const roll of req.rollInfo) {
//                 const rollBasicInfo = rollInfoMap.get(roll.rollId);
//                 const palletInfo = rollInfoMap.get(req.palletId);

//                 const rollInAnyPallet = await this.palletRollMapRepo.findOne({ select: ['suggestedPalletId', 'confirmedPalletId', 'status'], where: { itemLinesId: roll.rollId, isActive: true} });
//                 // if there is a roll in the mapping table already
//                 if(rollInAnyPallet) {
//                     if(rollInAnyPallet.confirmedPalletId == req.palletId && rollInAnyPallet.status == PalletBinStatusEnum.CONFIRMED) {
//                         throw new ErrorResponse(0, 'Roll is already mapped to the pallet');
//                     }
//                     const sysMappedPallet = rollInAnyPallet.suggestedPalletId;
//                     if(!overRideSysAllocation) {
//                         if(sysMappedPallet != req.palletId) {
//                             throw new ErrorResponse(0, 'Trying to allocate to a different pallet than the system suggested one');
//                         }
//                     }
//                     // TODO
//                     // Validation funnction that checks if a roll can be placed into a pallet without any space issues
//                     await this.validatePalletCapacityForRollConfirmation(req.companyCode, req.unitCode, req.palletId, roll.rollId, rollBasicInfo.leftOverQuantity, transManager);
//                     // else update the new confirmed pallet ID to the roll and unmap it from the old pallet. Also insert the record into the history
//                     await transManager.getRepository(PalletRollMapEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, itemLinesId: roll.rollId}, {
//                         confirmedPalletId: req.palletId, updatedUser: req.username, status: PalletBinStatusEnum.CONFIRMED
//                     });

//                     const packListId = rollBasicInfo.packListId;
//                     // create the history entity
//                     const palletRollMapHistoryEnt = this.getPalletRollMapHistoryEntity(req.companyCode, req.unitCode, rollInAnyPallet.confirmedPalletId, req.palletId, roll.rollId, packListId, req.username);
//                     palletRollMapHistoryEnts.push(palletRollMapHistoryEnt);
//                 } else {
//                     // check if the pallet has the capacity
//                     // TODO
//                     await this.validatePalletCapacityForRollConfirmation(req.companyCode, req.unitCode, req.palletId, roll.rollId, rollBasicInfo.leftOverQuantity, transManager);
//                     // simply map the new incoming roll to the new pallet
//                     const palletRollMapEnt = this.getPalletRollMapEntity(req.companyCode, req.unitCode, rollBasicInfo.packListId, req.palletId, req.palletId, roll.rollId, PalletBinStatusEnum.CONFIRMED, req.username);
//                     // the new direct entities to be saved 
//                     palletRollMapEnts.push(palletRollMapEnt);
//                 }
//             }
//             // after completing all the roll allcoation to the pallet, now unmap the pallet from the Rack -> Bin. Because when we try to put a roll into a pallet, it must be get down out of the bin
//             await this.palletBinMapService.unmapPalletToABinHelper(req.companyCode, req.unitCode, req.palletId, req.username, transManager);
//             // save all the roll mappings and the histories
//             await transManager.getRepository(PalletRollMapEntity).save(palletRollMapEnts);
//             if(palletRollMapHistoryEnts.length > 0) {
//                 await transManager.getRepository(PalletRollMapHistoryEntity).save(palletRollMapHistoryEnts);
//             }
//             await transManager.completeTransaction();
//             return new GlobalResponseObject(true, 0, 'Rolls mapped to the pallet');
//         } catch (error) {
//             await transManager.releaseTransaction();
//             throw error;
//         }
//     }

//     // END POINT
//     // FUNCTIONALITY
//     // SYSTEMATIC ALLOCATION
//     async allocateRollsToPallet(req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
//         const transManager = new GenericTransactionManager(this.dataSource); 
//         try {
//             const palletsLocationSortOrder = [CurrentPalletLocationEnum.NONE, CurrentPalletLocationEnum.INSPECTION, CurrentPalletLocationEnum.WAREHOUSE, CurrentPalletLocationEnum.CUTTING];

//             const rollIdsSet = new Set<number>();
//             req.rollInfo.map( r => rollIdsSet.add(r.rollId));
//             const incomingRollIds: number[] = Array.from(rollIdsSet);
//             const reqFor = req.mappingRequestFor;
//             // TODO: Based on the inspection confirmation, we have to remove the old rolls allocation and redo the new rolls allocation for the  

//             const rollsBasicInfo: RollBasicInfoModel[] = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, incomingRollIds);
//             const rollInfoMap: Map<number, RollBasicInfoModel> = await this.locAllocHelper.getRollIdsInfoMap(rollsBasicInfo);

//             // just a cross check that all the rolls are a part of the items table
//             req.rollInfo.forEach(r => {
//                 if(!rollInfoMap.has(r.rollId)) {
//                     throw new ErrorResponse(0, `The specific roll ${r.barcode} is not existing in the inventory`);
//                 }
//             });
//             const suggestedPalletId = req.palletId;

//             // check if this roll is already a part of the inspection

//             const consumedRollIds = new Set<number>();
//             const rollIdPalletIdTempMap = new Map<number, number>(); // roll_id -> pallet_id
//             // Now get all the free pallets on the floor. Based on the available pallets, allocate the rolls to the pallets systematically
//             const allFreeAvailablePalletsInWh: PalletDetailsModel[] = await this.locAllocHelper.getAllSpaceFreePalletsInWarehouse(req.companyCode, req.unitCode);
//             const palletInfoMap = this.locAllocHelper.getPalletIdsInfoMap(allFreeAvailablePalletsInWh);
//             // seggregate the pallets based on their current location.. and also sort them based on the free ones first and then partial ones..
//             const areaWiseFreePallets = this.getLocationWisePalletIds(allFreeAvailablePalletsInWh, req.mappingRequestFor);

//             // REDIS LOCK

//             // Now check how can the rolls be allcoted
//             // Current algorithm is just to fill the rolls from top -> bottom :: sorting the pallets top -> bottom based on the order
//             // The thing here is to get the pallets that are not allocated to any bins, then followed by one in insepction area , then the free ones in bins

//             /**
//              * For each pallet
//              *  check if the paller has capacity and also must support the no of rolls
//              *      for each roll, we will check the pallet capacity and support the no of rolls
//              */
//             areaWiseFreePallets.forEach((palletIds, locType) => {
//                 // once the pallet is done, then go to the next pallet
//                 palletIds.forEach(id => {
//                     const palletInfo = palletInfoMap.get(id);
//                     let pendingCapacity = Number(palletInfo.palletCapacity) - Number(palletInfo.confirmedQty) + Number(palletInfo.allocatedQty);
//                     let allowableMaxRollsPerPallet = Number(palletInfo.maxItems);
//                     let currentRollsInPallet = Number(palletInfo.totalAllocatedRolls) + Number(palletInfo.totalConfirmedRolls);

//                     // only get inside the pallet if it has the pending quantity
//                     // Can optimize to check for the minimum roll qty. so for less qtys we can skip the pallet
//                     if( (pendingCapacity > 0) && ( currentRollsInPallet < allowableMaxRollsPerPallet) ) { // this is a ref varibale being updated down
//                         // based on the pallet free space fill the rolls....
//                         req.rollInfo.forEach(roll => {
//                             if(!consumedRollIds.has(roll.rollId)) {
//                                 const rollInfo = rollInfoMap.get(roll.rollId);
//                                 const rollQty = Number(rollInfo.leftOverQuantity);

//                                 // 1.the pallet need to have capacity 2. no of rolls must be acceptable
//                                 if( (pendingCapacity * this.CAPACITY_TRIMMER > rollQty ) && ( currentRollsInPallet + 1 <= allowableMaxRollsPerPallet) ) {
//                                     // yes we can allocate the specific roll to this specific pallet
//                                     consumedRollIds.add(roll.rollId);

//                                     rollIdPalletIdTempMap.set(roll.rollId, palletInfo.palletId);

//                                     // ----------------------------------------------------------
//                                     // update the remaining capacity of the pallet
//                                     palletInfo.allocatedQty += rollQty; // ref variable
//                                     palletInfo.totalAllocatedRolls += 1; // ref variable

//                                     pendingCapacity -= rollQty;
//                                     currentRollsInPallet += 1;
//                                     // ----------------------------------------------------------
//                                 }
//                             }
                            
//                         });
//                     }
//                 });
//             });
//             if(!req.allowPartialAllocation) {
//                 if(incomingRollIds.length != consumedRollIds.size) {
//                     throw new ErrorResponse(0, 'Some rolls cannot be allocated due to no space found in the pallets ');
//                 }
//             }
//             const palletRollMapEnts: PalletRollMapEntity[] = [];
//             const palletIds: number[] = [];
//             // save the systematic roll pallet map 
//             for(const [rollId, palletId] of rollIdPalletIdTempMap) {
//                 const rollInfo = rollInfoMap.get(rollId);
//                 const palletRollMapEnt = this.getPalletRollMapEntity(req.companyCode, req.unitCode, rollInfo.packListId, palletId, palletId, rollId, PalletBinStatusEnum.OPEN, req.username);
//                 // the new direct entities to be saved 
//                 palletRollMapEnts.push(palletRollMapEnt);
//                 palletIds.push(palletId);
//             }
//             await transManager.startTransaction();
//             // update the selected pallets current state to be at the inspection
//             await this.locAllocHelper.updatePalletLocationState(req.companyCode, req.unitCode, palletIds, reqFor, req.username, transManager);
//             // save all the roll mappings and the histories
//             await transManager.getRepository(PalletRollMapEntity).save(palletRollMapEnts);
//             await transManager.completeTransaction();
//             return new GlobalResponseObject(true, 0, 'Rolls mapped to the pallet');
//         } catch (error) {
//             await transManager.releaseTransaction();
//             throw error;
//         }
//     }

//     // TODO - sorting has to be implemented based on the roll to inspection or for direct cutting storage
//     // HELPER
//     getLocationWisePalletIds(palletsInfo: PalletDetailsModel[], mappingIsFor: CurrentPalletLocationEnum): Map<CurrentPalletLocationEnum, number[]> {
//         const locTypePalletIdsMap = new Map<CurrentPalletLocationEnum, number[]>();
//         // const locTypePalletIdsMap = new Map<CurrentPalletLocationEnum, number[]>();
//         palletsInfo.forEach(r => {
//             if(!locTypePalletIdsMap.has(r.palletCurrentLoc)) {
//                 locTypePalletIdsMap.set(r.palletCurrentLoc, []);
//             }
//             locTypePalletIdsMap.get(r.palletCurrentLoc).push(r.palletId);
//         });
//         return locTypePalletIdsMap;
//     }
    
//     /**
//      * VALIDATOR
//      * validates a given roll and a pallet id, if it can be CONFIRMED to the given pallet without any issue
//      * @param companyCode 
//      * @param unitCode 
//      * @param palletId 
//      * @param currentRollId 
//      * @param currentRollQty 
//      * @returns 
//      */
//     async validatePalletCapacityForRollConfirmation(companyCode: string, unitCode: string, palletId: number, currentRollId: number, currentRollQty: number, transManager: GenericTransactionManager): Promise<boolean> {
//         // palletSupportedRolls: number, palledCurrentRolls: number, palletSupportedCapacity: number, palletCurrentCapacity: number
        
//         // get all the current rolls allocated for the pallet - ONLY THE ROLLS WITH CONFIRMED PALLET ID
//         const allocatedRolls = await transManager.getRepository(PalletRollMapEntity).find({select: ['id', 'itemLinesId'], where: {confirmedPalletId: palletId, isActive: true} });
//         const allocatedRollIds = allocatedRolls.map(r => r.itemLinesId);
//         let currentRollsInPallet = 0;

//         // get the roll quantities for the rolls
//         const rollBasicInfo: RollBasicInfoModel[] = await this.locAllocHelper.getBasicInfoForRollIds(companyCode, unitCode, allocatedRollIds);
//         const palletBasicInfo: PalletDetailsModel[] = await this.locAllocHelper.getBasicInfoForPalletIds(companyCode, unitCode, [palletId]);
//         const targetPalletInfo =  palletBasicInfo[0];

//         // calculate the conumed qty of the pallet
//         const consumedPalletQty = rollBasicInfo.reduce((sum, r) => sum + Number(r.leftOverQuantity), 0);
//         rollBasicInfo.forEach(r => {
//             // only if the roll have some qty in the pallet, then we can consider the roll as a valid one in the pallet
//             if(Number(r.leftOverQuantity) > 0) {
//                 currentRollsInPallet += 1
//             }
//         });
//         const allowableMaxRollsPerPallet = Number(targetPalletInfo.maxItems);
//         const palletFreeSpace = Number(targetPalletInfo.palletCapacity) - Number(consumedPalletQty);

//         if(currentRollsInPallet + 1 > allowableMaxRollsPerPallet) {
//             throw new ErrorResponse(0, `Pallet supports only ${allowableMaxRollsPerPallet} items`);
//         }
//         // TODO - change the conditions based on the business req
//         if(currentRollQty > palletFreeSpace) {
//             throw new ErrorResponse(0, `Pallet have a free capacity of only ${palletFreeSpace} yards`);
//         }
//         return true;
//     }

//     // HELPER
//     // VALIDATOR
//     async validdateIfRollSelectedForInspection(companyCode: string, unitCode: string, rollIds: number[]): Promise<boolean> {
//         for(const rollId of rollIds) {
//             const isRollSelectedForIns = await this.insInfoService.checkIfRollSelectedForInspection(companyCode, unitCode, rollId);
//             if(!isRollSelectedForIns) {
//                 throw new ErrorResponse(0, 'Roll is not selected for inspection');
//             }
//         }
//         return true;
//     }

//     // HELPER
//     getPalletRollMapEntity(companyCode: string, unitCode: string, packListId: number, suggestedPalletId: number, confirmedPalletId: number, rollId: number, status: PalletBinStatusEnum, username: string): PalletRollMapEntity {
//         const rollMapEnt = new PalletRollMapEntity();
//         rollMapEnt.companyCode = companyCode;
//         rollMapEnt.unitCode = unitCode;
//         rollMapEnt.packListId = packListId;
//         rollMapEnt.suggestedPalletId = suggestedPalletId;
//         rollMapEnt.confirmedPalletId = confirmedPalletId;
//         rollMapEnt.itemLinesId = rollId;
//         rollMapEnt.status = status;
//         rollMapEnt.createdUser = username;
//         return rollMapEnt;
//     }

//     // HELPER
//     getPalletRollMapHistoryEntity(companyCode: string, unitCode: string, fromPalletId: number, toPalletId: number, rollId: number, packListId: number, username: string): PalletRollMapHistoryEntity {
//         const rollMapHistoryEnt = new PalletRollMapHistoryEntity();
//         rollMapHistoryEnt.companyCode = companyCode;
//         rollMapHistoryEnt.unitCode = unitCode;
//         rollMapHistoryEnt.fromPalletId = fromPalletId;
//         rollMapHistoryEnt.toPalletId = toPalletId;
//         rollMapHistoryEnt.itemLinesId = rollId;
//         rollMapHistoryEnt.movedBy = username;
//         rollMapHistoryEnt.packListId = packListId;
//         rollMapHistoryEnt.createdUser = username;
//         return rollMapHistoryEnt;
//     }


//     // HELPER
//     // unmaps the roll to a pallet when ever a roll is scanned to put out of the pallet
//     async unmapRollToAPalletHelper(companyCode: string, unitCode: string, rollId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
//         // unmap the pallet to the bin
//         const rollMapRec = await transManager.getRepository(PalletRollMapEntity).findOne({ select: ['confirmedPalletId', 'itemLinesId', 'packListId'], where: { companyCode: companyCode, unitCode: unitCode, itemLinesId: rollId } });
//         if(rollMapRec.status == PalletBinStatusEnum.CONFIRMED) {
//             await transManager.getRepository(PalletRollMapEntity).update({ companyCode: companyCode, unitCode: unitCode, itemLinesId: rollId}, { status: PalletBinStatusEnum.OPEN, updatedUser: username });
//             // create the history record also
//             const historyEnt = this.getPalletRollMapHistoryEntity(companyCode, unitCode, rollMapRec.confirmedPalletId, null, rollId, rollMapRec.packListId, username);
//             await transManager.getRepository(PalletRollMapHistoryEntity).save(historyEnt);
//         }
//         return true;
//     }

// }