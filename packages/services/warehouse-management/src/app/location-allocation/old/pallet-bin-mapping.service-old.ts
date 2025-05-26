import { Injectable } from '@nestjs/common';
import { BinPalletMappingRequest, GlobalResponseObject, PalletBinStatusEnum } from '@xpparel/shared-models';
import { PalletBinMapRepo } from '../repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from '../repositories/pallet-roll-map.repository';
import { DataSource } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from '../../../database/typeorm-transactions/generic-transaction-manager';
import { LcoationMappingHelperService } from '../location-mapping-helper.service';
import { PalletBinMapEntity } from '../entities/pallet-bin-map.entity';
import { PalletBinMapHistoryEntity } from '../entities/pallet-bin-map-history.entity';

@Injectable()
export class PalletBinMappingServiceOld {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinMapRepo: PalletBinMapRepo,
        private locAllocHelper: LcoationMappingHelperService,
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
            if(palletIdsSet.size == 0) {
                throw new ErrorResponse(6087, 'Please select the pallets');
            }
            const palletIds = Array.from(palletIdsSet);
            await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, palletIds);
            await this.locAllocHelper.getBasicInfoForBinIds(req.companyCode, req.unitCode, palletIds);
            // if the pallet is already mapped to some location, then remove it from the old bin to the new Bin

            const palletBinMapEnts: PalletBinMapEntity[] = [];
            const palletBinMapHisEnts: PalletBinMapHistoryEntity[] = [];
            for(const palletId of palletIds) {
                // check if the pllaet in any bin currently
                const palletInAnybin = await this.palletBinMapRepo.findOne({ select: ['suggestedBinId', 'confirmedBinId'], where: { palletId: palletId, isActive: true } })
                if(palletInAnybin) {
                    if(!overRideSysAllocation) {
                        const sysMappedBin = palletInAnybin.suggestedBinId;
                        if(sysMappedBin != req.binId) {
                            throw new ErrorResponse(0, 'Trying to allocate to a different bin than the system suggested bin');
                        }
                    }
                    // Validation funnction that checks if a pallet can be placed into a bin without any space issues
                    await this.validateBinCapacityForPalletConfirmation(req.companyCode, req.unitCode, palletId, req.binId);

                    // then map the pallet to the new bin and create a history record
                    // else update the new confirmed pallet ID to the roll and unmap it from the old pallet. Also insert the record into the history
                    await transManager.getRepository(PalletBinMapEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, palletId: palletId}, {
                        confirmedBinId: req.binId, updatedUser: req.username, status: PalletBinStatusEnum.CONFIRMED
                    });
                    // create the history entity
                    const historyEnt = this.getPalletBinMapHistoryEntity(req.companyCode, req.unitCode, req.username, palletId, '', palletInAnybin.confirmedBinId, req.binId);
                    palletBinMapHisEnts.push(historyEnt);
                } else {
                    // Validation funnction that checks if a pallet can be placed into a bin without any space issues
                    await this.validateBinCapacityForPalletConfirmation(req.companyCode, req.unitCode, palletId, req.binId);
                    // simply map the pallet to the bin
                    const palletBinMapentity = this.getPalletBinMapEntity(req.companyCode, req.unitCode, req.username, palletId, req.binId, req.binId, PalletBinStatusEnum.OPEN);
                    palletBinMapEnts.push(palletBinMapentity);
                }
            }
            // save all the roll mappings and the histories
            await transManager.getRepository(PalletBinMapEntity).save(palletBinMapEnts);
            await transManager.getRepository(PalletBinMapHistoryEntity).save(palletBinMapHisEnts);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Rolls mapped to the pallet');
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
            const binPalletMap = new Map<number, {palletId: number}[]>();
            const consumedPalletIds = new Set<number>();
            const overRideSysAllocation: boolean = req.isOverRideSysAllocation;
            const palletIdsSet = new Set<number>();
            req.palletInfo.forEach(r => palletIdsSet.add(r.palletId));
            if(palletIdsSet.size == 0) {
                throw new ErrorResponse(6087, 'Please select the pallets');
            }
            const palletIds = Array.from(palletIdsSet);
            await this.locAllocHelper.getBasicInfoForPalletIds(req.companyCode, req.unitCode, palletIds);

            // get all free space Bins
            const spaceFreeBins = await this.locAllocHelper.getAllSpaceFreeBinsInWarehouse(req.companyCode, req.unitCode);
            spaceFreeBins.forEach( bin => {
                const capacity = bin.totalSupportedPallets;
                let freeSpace = bin.totalFilledPallets;
                for(const palletId of palletIds) {
                    if(freeSpace < capacity) {
                        if(!binPalletMap.has(bin.binId)) {
                            binPalletMap.set(bin.binId, []);
                        }
                        binPalletMap.get(bin.binId).push({ palletId: palletId});
                        consumedPalletIds.add(palletId);
                        freeSpace++;
                    }
                }
            });
            const palletBinMapEnts: PalletBinMapEntity[] = [];
            binPalletMap.forEach((pallets, bin) => {
                pallets.forEach(p => {
                    const palletBinMapentity = this.getPalletBinMapEntity(req.companyCode, req.unitCode, req.username, p.palletId, req.binId, req.binId, PalletBinStatusEnum.OPEN);
                    palletBinMapEnts.push(palletBinMapentity);
                });
            });
            await transManager.getRepository(PalletBinMapEntity).save(palletBinMapEnts);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Rolls mapped to the pallet');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    getPalletBinMapEntity(companyCode: string, unitCode: string, username: string, palletId: number, suggestedBinId: number, confirmedBinId: number, status: PalletBinStatusEnum): PalletBinMapEntity{
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
    async validateBinCapacityForPalletConfirmation(companyCode: string, unitCode: string, palletId: number, binId: number): Promise<boolean> {
        
        const allocatedPalletsInBin = await this.palletBinMapRepo.find({ select: ['id', 'palletId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedBinId: binId, status: PalletBinStatusEnum.CONFIRMED, isActive: true} });
        const binsBasicInfo = await this.locAllocHelper.getBasicInfoForBinIds(companyCode, unitCode, [binId]);
        const currentBinInfo = binsBasicInfo[0];
        if(!currentBinInfo) {
            throw new ErrorResponse(0, 'Bin does not exist');
        }
        const totalPalletsInBin = allocatedPalletsInBin.length;
        const binCapacity = currentBinInfo.totalSupportedPallets;
        if(totalPalletsInBin >= binCapacity) {
            throw new ErrorResponse(0, 'Bin capacity is already full. Cannot keep more pallets');
        }
        return true;
    }

    // HELPER
    // unmaps the pallet to a bin when ever a pallet is scanned to put a roll into it
    async unmapPalletToABinHelper(companyCode: string, unitCode: string, palletId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        // unmap the pallet to the bin
        const palletMapRec = await transManager.getRepository(PalletBinMapEntity).findOne({ select: ['palletId', 'confirmedBinId'], where: { companyCode: companyCode, unitCode: unitCode, palletId: palletId } });
        if(palletMapRec?.status == PalletBinStatusEnum.CONFIRMED) {
            await transManager.getRepository(PalletBinMapEntity).update({ companyCode: companyCode, unitCode: unitCode, palletId: palletId}, { status: PalletBinStatusEnum.OPEN, updatedUser: username });
            // create the history record also
            const historyEnt = this.getPalletBinMapHistoryEntity(companyCode, unitCode, username, palletId, '', palletMapRec.confirmedBinId, null);
            await transManager.getRepository(PalletBinMapHistoryEntity).save(historyEnt);
        }
        return true;
    }
}
