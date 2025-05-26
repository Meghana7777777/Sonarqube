import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { CurrentPalletLocationEnum, GlobalResponseObject, PalletRollMappingRequest, RollIdRequest, TrayRollMappingRequest } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { TrayRollMapEntity } from './entities/tray-roll-map.entity';
import { TrayTrolleyMapHistoryEntity } from './entities/tray-trolley-map-history.entity';
import { TrayRollMapHistoryEntity } from './entities/tray-roll-map-history.entity';
import { TrayTrolleyMapRepo } from './repositories/tray-trolley-map.repository';
import { TrayRollMapHistoryRepo } from './repositories/tray-troll-map-history.repository';
import { TrayRollMapRepo } from './repositories/tray-roll-map.repository';
import { PalletRollMapEntity } from '../location-allocation/entities/pallet-roll-map.entity';
import { PalletRollMapHistoryEntity } from '../location-allocation/entities/pallet-roll-map-history.entity';
import { RollPalletMappingService } from '../location-allocation/roll-pallet-mapping.service';

@Injectable()
export class TrayRollMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private trayRollMapRepo: TrayRollMapRepo,
        private trayRollMapHisRepo: TrayRollMapHistoryRepo,
        @Inject(forwardRef(() => TraysService)) private trayService: TraysService,
        @Inject(forwardRef(() => PackingListInfoService)) private packListInfoService: PackingListInfoService,
        @Inject(forwardRef(() => RollPalletMappingService)) private rollPalletMappingService: RollPalletMappingService
    ) {

    }


    // WRITER
    // NOT AND ENDPOINT
    //  This function is a helper function that actually removes the roll from the tray
    async unmapRollFromTrayInternal(rollId: number, companyCode: string, unitCode: string, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        const existingMapRec = await this.getTrayRollMapRecordForRollId(rollId, companyCode, unitCode);
        if(!existingMapRec) {
            return true;
        }
        const oldTrayId = existingMapRec ? existingMapRec.confirmedTrayId : 0; 
        // now un map the roll to this incoming tray
        const trayRollMapHisEnt = this.getTrayRollMapHistoryEntity(oldTrayId, 0, rollId, existingMapRec.packListId, 'ROLL ISSUED', username, companyCode, unitCode);
        await transManager.getRepository(TrayRollMapHistoryEntity).save(trayRollMapHisEnt, { reload: false });
        if(existingMapRec) {
            await transManager.getRepository(TrayRollMapEntity).delete({ id: existingMapRec.id, companyCode: companyCode, unitCode: unitCode});
        }
        return true;
    }

    /**     
     * WRITER
     * ENDPOINT
     * unmaps the roll from the tray
     * @param req 
     */
    async unmapRollFromTray(req: TrayRollMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            if(!req.rollIds) {
                throw new ErrorResponse(6282, 'Objects ids not provided');
            }
            const rolls = await this.packListInfoService.getRollRecordForRollIds(req.rollIds);
            if(rolls.length !- req.rollIds.length) {
                throw new ErrorResponse(6283, `Given Object does not exist`);
            }
            let unMapCount = 0;
            await transManager.startTransaction();
            for(const roll of rolls) {
                const existingMapRec = await this.getTrayRollMapRecordForRollId(roll.id, req.companyCode, req.unitCode);
                if(!existingMapRec) {
                    continue;
                }
                const oldTrayId = existingMapRec ? existingMapRec.confirmedTrayId : 0; 

                // now un map the roll to this incoming tray
                const trayRollMapHisEnt = this.getTrayRollMapHistoryEntity(oldTrayId, 0, roll.id, roll.phId, 'UNMAP', req.username, req.companyCode, req.unitCode);
                await transManager.getRepository(TrayRollMapHistoryEntity).save(trayRollMapHisEnt, { reload: false });
                if(existingMapRec) {
                    await transManager.getRepository(TrayRollMapEntity).delete({ id: existingMapRec.id, companyCode: req.companyCode, unitCode: req.unitCode});
                }
                unMapCount++;
            }
            if(unMapCount == 0) {
                throw new ErrorResponse(6284, 'Object is not mapped to any tray yet');
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6285, 'Object un mapped to the trolly');
        } catch(error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    /**     
     * WRITER
     * ENDPOINT
     * Maps the roll to the trolly and then unmaps the roll from the pallet
     * @param req 
     * @returns 
     */
    async mapRollToTray(req: TrayRollMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            /**
             * check if the tray exist
             * check if the roll exist
             * check if we are exceeding the tray capacity
             * check if the roll is already present in the same tray or some other tray
             * create the history record 
             * remove the roll from the pallet
             * commit the transaction 
             */
            if(!req.trayId) {
                throw new ErrorResponse(6286, 'Please provide the tray id');
            }
            if(!req.rollIds) {
                throw new ErrorResponse(6287, 'Objects ids not provided');
            }
            let trayCapacity = 0;
            const tray = await this.trayService.getTraysByTrayIdsInternal([req.trayId], req.companyCode, req.unitCode, false, false);
            if(tray.length == 0) {
                throw new ErrorResponse(6288, 'Given tray does not exist');
            }
            if(!tray[0].isActive) {
                throw new ErrorResponse(6289, 'Selected tray is in de-active state');
            }
            trayCapacity = Number(tray[0].capacity);
            const totalRollsInTray = await this.trayRollMapRepo.count({ where: { confirmedTrayId: req.trayId, companyCode: req.companyCode, unitCode: req.unitCode}});
            // If the capaacity is already full and if the request is not saying to overflow capacity, then we must throw an error
            if(totalRollsInTray >= trayCapacity && !req.overrideCapacity) {
                throw new ErrorResponse(6290, `Tray capacity of ${trayCapacity} rolls is already full`);
            }
            const rolls = await this.packListInfoService.getRollRecordForRollIds(req.rollIds);
            if(rolls.length !- req.rollIds.length) {
                throw new ErrorResponse(6291, `Given Object does not exist`);
            }
            let mappedRollsCount = 0;
            await transManager.startTransaction();
            for(const roll of rolls) {
                // check whether the roll is valid
                // if(Number(roll.issuedQuantity) == Number(roll.sQuantity)) {
                //     continue;
                // }
                const existingMapRec = await this.getTrayRollMapRecordForRollId(roll.id, req.companyCode, req.unitCode);
                const oldTrayId = existingMapRec ? existingMapRec.confirmedTrayId : 0;
                // check if we are again putting the roll in the same tray again
                if(oldTrayId == req.trayId) {
                    throw new ErrorResponse(6292, `The Object ${roll.barcode} is already present in the same tray ${tray[0].code}`);
                }
                // now map the roll to this incoming tray
                const trayRollMapEnt = this.getTrayRollMapEntity(req.trayId, roll.id, roll.phId, req.username, req.companyCode, req.unitCode);
                const trayRollMapHisEnt = this.getTrayRollMapHistoryEntity(oldTrayId, req.trayId, roll.id, roll.phId, 'MANUAL', req.username, req.companyCode, req.unitCode);
                await transManager.getRepository(TrayRollMapEntity).save(trayRollMapEnt, { reload: false });
                await transManager.getRepository(TrayRollMapHistoryEntity).save(trayRollMapHisEnt, { reload: false });
                if(existingMapRec) {
                    await transManager.getRepository(TrayRollMapEntity).delete({ id: existingMapRec.id, companyCode: req.companyCode, unitCode: req.unitCode});
                }

                // After all now finally unmap the roll from the pallet. Since it is assigned to the tray
                const rollReq = new RollIdRequest(req.username, req.unitCode, req.companyCode, 0, roll.id, roll.barcode);
                const prmReq = new PalletRollMappingRequest(req.username, req.unitCode, req.companyCode, req.userId, roll.phId, 0, false, CurrentPalletLocationEnum.NONE, false, [rollReq]);
                await this.rollPalletMappingService.deAllocateRollsToPalletatIssuance(prmReq, 'TRAY ALLOC REM', false, transManager);
                mappedRollsCount++;
            }
            await transManager.completeTransaction();
            if(mappedRollsCount == 0) {
                throw new ErrorResponse(6293, 'Objects were not mapped to the trays');
            }
            return new GlobalResponseObject(true, 6294, 'Object mapped to the tray');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    async getTrayRollMapRecordForRollId(rollId: number, companyCode: string, unitCode: string): Promise<TrayRollMapEntity> {
        return await this.trayRollMapRepo.findOne({ where: { itemLinesId: rollId, companyCode: companyCode, unitCode: unitCode}});
    }

    getTrayRollMapEntity(trayId: number, rollId: number, packListId: number, username: string, companyCode: string, unit: string): TrayRollMapEntity {
        const trmEnt = new TrayRollMapEntity();
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.confirmedTrayId = trayId;
        trmEnt.suggestedTrayId = trayId;
        trmEnt.itemLinesId = rollId;
        trmEnt.createdUser = username;
        trmEnt.packListId = packListId;
        return trmEnt;
    }

    getTrayRollMapHistoryEntity(fromTrayId: number, toTrayId: number, rollId: number, packListId: number,  movedBy: string, username: string, companyCode: string, unit: string): TrayRollMapHistoryEntity {
        const trmEnt = new TrayRollMapHistoryEntity();
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.fromTrayId = fromTrayId;
        trmEnt.toTrayId = toTrayId;
        trmEnt.itemLinesId = rollId;
        trmEnt.createdUser = username;
        trmEnt.movedBy = movedBy;
        trmEnt.packListId = packListId;
        return trmEnt;
    }


}