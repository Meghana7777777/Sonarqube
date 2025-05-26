import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BinPalletMappingRequest, CurrentPalletLocationEnum, GlobalResponseObject, PackListIdRequest, PalletBinStatusEnum, PalletIdRequest } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { DataSource, In } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';
import { PalletBinMapHistoryEntity } from './entities/pallet-bin-map-history.entity';

@Injectable()
export class PalletBinMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinMapRepo: PalletBinMapRepo,
        @Inject(forwardRef(() => LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
    ) {

    }

    // END POINT
    // FUNCIONALITY
    async confirmPalletsToBin(req: BinPalletMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const overRideSysAllocation: boolean = req.isOverRideSysAllocation;
            const palletIdsSet = new Set<number>();
            req.palletInfo.forEach(r => palletIdsSet.add(r.palletId));
            if (palletIdsSet.size == 0) {
                throw new ErrorResponse(6087, 'Please select the pallets');
            }
            const palletIds = Array.from(palletIdsSet);

            // check if the pllaets and the bin exist
            await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, palletIds);
            // await this.locAllocHelper.getBasicInfoForBinIds(req.companyCode, req.unitCode, [req.binId]);

            // if the pallet is already mapped to some location, then remove it from the old bin to the new Bin
            const palletBinMapEnts: PalletBinMapEntity[] = [];
            const palletBinMapHisEnts: PalletBinMapHistoryEntity[] = [];
            await transManager.startTransaction();
            for (const palletId of palletIds) {
                // check if the pllaet in any bin currently
                const palletInAnybin = await this.palletBinMapRepo.findOne({ select: ['suggestedBinId', 'confirmedBinId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, palletId: palletId, isActive: true } })
                if (palletInAnybin) {
                    if (!overRideSysAllocation) {
                        const sysMappedBin = palletInAnybin.suggestedBinId;
                        if (sysMappedBin != req.binId) {
                            throw new ErrorResponse(6083, 'Trying to allocate to a different bin than the system suggested bin');
                        }
                    }
                    if (palletInAnybin.confirmedBinId == req.binId && palletInAnybin.status == PalletBinStatusEnum.CONFIRMED) {
                        throw new ErrorResponse(6084, 'The pallet is already placed in the current bin');
                    }
                    // Validation funnction that checks if a pallet can be placed into a bin without any space issues
                    await this.validateBinCapacityForPalletConfirmation(req.companyCode, req.unitCode, palletId, req.binId, transManager);

                    // then map the pallet to the new bin and create a history record
                    // else update the new confirmed pallet ID to the roll and unmap it from the old pallet. Also insert the record into the history
                    await transManager.getRepository(PalletBinMapEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, palletId: palletId }, {
                        confirmedBinId: req.binId, updatedUser: req.username, status: PalletBinStatusEnum.CONFIRMED
                    });
                    // create the history entity
                    const historyEnt = this.getPalletBinMapHistoryEntity(req.companyCode, req.unitCode, req.username, palletId, '', palletInAnybin.confirmedBinId, req.binId);
                    palletBinMapHisEnts.push(historyEnt);
                } else if (overRideSysAllocation) {
                    // Validation funnction that checks if a pallet can be placed into a bin without any space issues
                    await this.validateBinCapacityForPalletConfirmation(req.companyCode, req.unitCode, palletId, req.binId, transManager);
                    // simply map the pallet to the bin
                    const palletBinMapentity = this.getPalletBinMapEntity(req.companyCode, req.unitCode, req.username, palletId, req.binId, req.binId, PalletBinStatusEnum.CONFIRMED);
                    palletBinMapEnts.push(palletBinMapentity);
                } else {
                    throw new ErrorResponse(6085, 'Pallets can only be placed in suggested bins without approval')
                }
            }
            // save all the roll mappings and the histories
            await transManager.getRepository(PalletBinMapEntity).save(palletBinMapEnts);
            await transManager.getRepository(PalletBinMapHistoryEntity).save(palletBinMapHisEnts);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6086, 'Pallet is mapped to the bin');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // END POINT
    // FUNCIONALITY
    async allocatePalletsToBin(req: BinPalletMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const binId = req.binId;
            const palletIdsSet = new Set<number>();
            req.palletInfo.forEach(r => palletIdsSet.add(r.palletId));
            if (palletIdsSet.size == 0) {
                throw new ErrorResponse(6087, 'Please select the pallets');
            }
            const palletIds = Array.from(palletIdsSet);
            await transManager.startTransaction();
            for (const palletId of palletIds) {
                // check if the pllaet is existing or not
                await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, palletIds);
                const palletBinMapRecord = await this.palletBinMapRepo.findOne({ where: { palletId: palletId, isActive: true, companyCode: req.companyCode, unitCode: req.unitCode } });
                if (!palletBinMapRecord) {
                    // check if the selected bin has some free space
                    await this.validateBinCapacityForPalletAllocation(req.companyCode, req.unitCode, 0, binId, transManager);
                    const palletBinMapEntity = this.getPalletBinMapEntity(req.companyCode, req.unitCode, req.username, palletId, binId, binId, PalletBinStatusEnum.OPEN);
                    await transManager.getRepository(PalletBinMapEntity).save(palletBinMapEntity);
                } else {
                    if (palletBinMapRecord.status == PalletBinStatusEnum.CONFIRMED) {
                        throw new ErrorResponse(6088, 'Pallet is already confirmed to a bin');
                    }
                    // check if the same bin is being mapped
                    if (palletBinMapRecord.suggestedBinId == binId) {
                        throw new ErrorResponse(6089, 'Pallet is already mapped to the same bin');
                    }
                    // check if the selected bin has some free space
                    await this.validateBinCapacityForPalletAllocation(req.companyCode, req.unitCode, 0, binId, transManager);
                    // update the suggested bin id to the pallet
                    await transManager.getRepository(PalletBinMapEntity).update({ palletId: palletId, companyCode: req.companyCode, unitCode: req.unitCode }, { suggestedBinId: binId, updatedUser: req.username });
                }
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6090, 'Pallet is mapped to the suggested bin')
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // END POINT
    // FUNCIONALITY
    async allocatePakcListPalletsToBin(req: PackListIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const packListId = req.packListId;
            const binPalletMap = new Map<number, { palletId: number }[]>();
            const consumedPalletIds = new Set<number>();
            const toConsiderPalletIds = new Set<number>();
            // get all the confirmed pallets for the packing list
            const confirmedPalletsForPackList = await this.palletRollMapRepo.getConfirmedPalletIdsForPackList(req.companyCode, req.unitCode, packListId);
            if (confirmedPalletsForPackList.length == 0) {
                throw new ErrorResponse(6091, 'No confirmed pallets for the packing list');
            }

            const onlyWhPalletIds: number[] = [];
            // filter out the inpsection pallets
            const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, confirmedPalletsForPackList);
            palletsInfo.forEach(r => {
                if (r.palletCurrentLoc == CurrentPalletLocationEnum.WAREHOUSE) {
                    // only consider the warehouse related pallets
                    onlyWhPalletIds.push(r.palletId);
                }
            });

            // filter out the already suggested/confirmed pallets
            const alreadySugOrConPallets = await this.palletBinMapRepo.find({ select: ['palletId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, palletId: In(onlyWhPalletIds), isActive: true } });
            const alreadySugOrConPalletIds = new Set<number>();
            alreadySugOrConPallets.forEach(r => {
                alreadySugOrConPalletIds.add(r.palletId);
            });
            onlyWhPalletIds.forEach(r => {
                if (!alreadySugOrConPalletIds.has(r)) {
                    toConsiderPalletIds.add(r);
                }
            });

            // validates that all the pallets are existing in the system - NO NEED. CAN REMOVE
            // await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, confirmedPallets);

            // get all free space Bins
            const spaceFreeBins = await this.locAllocHelper.getAllSpaceFreeBinsInWarehouse(req.companyCode, req.unitCode);
            spaceFreeBins.forEach(bin => {
                const capacity = bin.totalSupportedPallets;
                let freeSpace = bin.totalFilledPallets;
                for (const palletId of toConsiderPalletIds) {
                    if (consumedPalletIds.has(palletId)) {
                        continue;
                    }
                    if (freeSpace < capacity) {
                        if (!binPalletMap.has(bin.binId)) {
                            binPalletMap.set(bin.binId, []);
                        }
                        binPalletMap.get(bin.binId).push({ palletId: palletId });
                        consumedPalletIds.add(palletId);
                        freeSpace++;
                    }
                }
            });
            const palletBinMapEnts: PalletBinMapEntity[] = [];
            binPalletMap.forEach((pallets, bin) => {
                pallets.forEach(p => {
                    const palletBinMapentity = this.getPalletBinMapEntity(req.companyCode, req.unitCode, req.username, p.palletId, bin, bin, PalletBinStatusEnum.OPEN);
                    palletBinMapEnts.push(palletBinMapentity);
                });
            });
            await transManager.startTransaction();
            await transManager.getRepository(PalletBinMapEntity).save(palletBinMapEnts);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6092, 'Pallets mapped to bin');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    getPalletBinMapEntity(companyCode: string, unitCode: string, username: string, palletId: number, suggestedBinId: number, confirmedBinId: number, status: PalletBinStatusEnum): PalletBinMapEntity {
        const palletBinMapEnt = new PalletBinMapEntity();
        palletBinMapEnt.companyCode = companyCode;
        palletBinMapEnt.unitCode = unitCode;
        palletBinMapEnt.createdUser = username;
        palletBinMapEnt.palletId = palletId;
        palletBinMapEnt.suggestedBinId = suggestedBinId;
        palletBinMapEnt.confirmedBinId = confirmedBinId;
        palletBinMapEnt.status = status;
        return palletBinMapEnt;
    }

    // HELPER
    getPalletBinMapHistoryEntity(companyCode: string, unitCode: string, username: string, palletId: number, remarks: string, fromBinId: number, toBinId: number): PalletBinMapHistoryEntity {
        const palletBinMapHistEnt = new PalletBinMapHistoryEntity();
        palletBinMapHistEnt.companyCode = companyCode;
        palletBinMapHistEnt.unitCode = unitCode;
        palletBinMapHistEnt.createdUser = username;
        palletBinMapHistEnt.movedBy = username;
        palletBinMapHistEnt.remarks = remarks;
        palletBinMapHistEnt.fromBinId = fromBinId;
        palletBinMapHistEnt.toBinId = toBinId;
        palletBinMapHistEnt.palletId = palletId;
        return palletBinMapHistEnt;
    }

    // HELPER
    async validateBinCapacityForPalletConfirmation(companyCode: string, unitCode: string, palletId: number, binId: number, transManager: GenericTransactionManager): Promise<boolean> {
        // get the allocated and the sugegsted pallets in the bin
        const { confirmedPalletsMap } = await this.locAllocHelper.getBinWithSuggestedAndConfirmedPallets(companyCode, unitCode, [binId], transManager);
        const conFirmedPallets = confirmedPalletsMap.get(binId)?.confirmedPallets ? confirmedPalletsMap.get(binId)?.confirmedPallets : 0
        // const allocatedPalletsInBin = await transManager.getRepository(PalletBinMapEntity).find({ select: ['id', 'palletId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: binId, status: PalletBinStatusEnum.CONFIRMED, isActive: true} });
        const binsBasicInfo = await this.locAllocHelper.getBasicInfoForBinIds(companyCode, unitCode, [binId]);
        const currentBinInfo = binsBasicInfo[0];
        if (!currentBinInfo) {
            throw new ErrorResponse(6093, 'Bin does not exist');
        }
        const totalPalletsInBin = conFirmedPallets; // allocatedPalletsInBin.length;
        const binCapacity = currentBinInfo.totalSupportedPallets;
        if (totalPalletsInBin >= binCapacity) {
            throw new ErrorResponse(6094, 'Bin capacity is already full. Cannot keep more pallets');
        }
        return true;
    }

    // HELPER
    async validateBinCapacityForPalletAllocation(companyCode: string, unitCode: string, palletId: number, binId: number, transManager: GenericTransactionManager): Promise<boolean> {
        // get the allocated and the sugegsted pallets in the bin
        const { confirmedPalletsMap, allocatePalletsMap } = await this.locAllocHelper.getBinWithSuggestedAndConfirmedPallets(companyCode, unitCode, [binId], transManager);
        const conFirmedPallets = confirmedPalletsMap.get(binId)?.confirmedPallets ? confirmedPalletsMap.get(binId)?.confirmedPallets : 0
        const allocatedPallets = allocatePalletsMap.get(binId)?.allocatePallets ? allocatePalletsMap.get(binId)?.allocatePallets : 0

        const binsBasicInfo = await this.locAllocHelper.getBasicInfoForBinIds(companyCode, unitCode, [binId]);
        const currentBinInfo = binsBasicInfo[0];
        if (!currentBinInfo) {
            throw new ErrorResponse(6093, 'Bin does not exist');
        }
        const totalPalletsInBin = allocatedPallets + conFirmedPallets;
        const binCapacity = currentBinInfo.totalSupportedPallets;
        if (totalPalletsInBin >= binCapacity) {
            throw new ErrorResponse(6094, 'Bin capacity is already full. Cannot keep more pallets');
        }
        return true;
    }

    // End Point to Unmap pallet from Bin
    async unmapPalletFromABin(req: PalletIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            // get all the confirmed pallets for the packing list
            const palletsInfo = await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, [req.palletId]);
            if (palletsInfo.length == 0) {
                throw new ErrorResponse(6097, 'No confimred pallets for the packing list');
            }
            await transManager.startTransaction();
            await this.unmapPalletToABinHelper(req.companyCode, req.unitCode, req.palletId, req.username, transManager);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6098, 'Pallet UnMapped Successfully.');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    // unmaps the pallet to a bin when ever a pallet is scanned to put a roll into it
    async unmapPalletToABinHelper(companyCode: string, unitCode: string, palletId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        // unmap the pallet to the bin
        const palletMapRec = await transManager.getRepository(PalletBinMapEntity).findOne({ select: ['palletId', 'confirmedBinId', 'status'], where: { companyCode: companyCode, unitCode: unitCode, palletId: palletId } });
        // if(palletMapRec?.status == PalletBinStatusEnum.CONFIRMED) {
        await transManager.getRepository(PalletBinMapEntity).update({ companyCode: companyCode, unitCode: unitCode, palletId: palletId }, { status: PalletBinStatusEnum.OPEN, updatedUser: username, isActive: false });
        // create the history record also
        const historyEnt = this.getPalletBinMapHistoryEntity(companyCode, unitCode, username, palletId, 'unmapped', palletMapRec.confirmedBinId, 0);
        await transManager.getRepository(PalletBinMapHistoryEntity).save(historyEnt);
        // }
        return true;
    }
}
