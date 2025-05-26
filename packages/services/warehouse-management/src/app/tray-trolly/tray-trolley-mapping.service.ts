import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrolleyService } from '../master-data/master-services/trollys/trolley.service';
import { GlobalResponseObject, TrayTrolleyMappingRequest } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { TrayTrolleyMapRepo } from './repositories/tray-trolley-map.repository';
import { TrayTrolleyMapHistoryRepo } from './repositories/tray-trolley-map-history.repository';
import { TrayTrolleyMapEntity } from './entities/tray-trolley-map.entity';
import { TrayTrolleyMapHistoryEntity } from './entities/tray-trolley-map-history.entity';

@Injectable()
export class TrayTrolleyMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private trayTrolleyMapRepo: TrayTrolleyMapRepo,
        private trayTrolletMapHisRepo: TrayTrolleyMapHistoryRepo,
        @Inject(forwardRef(() => TrolleyService)) private trolleyService: TrolleyService,
        @Inject(forwardRef(() => TraysService)) private trayService: TraysService,
        @Inject(forwardRef(() => PackingListInfoService)) private packListInfoService: PackingListInfoService,
    ) {

    }

    /**
     * WRITER
     * ENDPOINT
     * unmaps the tray from the trolley
     * @param req 
     */
    async unmapTrayFromTrolley(req: TrayTrolleyMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {

            const trayRecs = await this.trayService.getTraysByTrayIdsInternal(req.trayIds, req.companyCode, req.unitCode, false, false);
            if(trayRecs.length == 0) {
                throw new ErrorResponse(6300, 'No trays found for the provided ids');
            }
            let unMapCount = 0;
            await transManager.startTransaction();
            for(const tray of trayRecs) {
                const existingMapRec = await this.trayTrolleyMapRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, trayId: tray.id }});
                if(!existingMapRec) {
                    continue;
                }
                const oldTrolleyId = existingMapRec ? existingMapRec.confirmedTrolleyId : 0;

                const trayTrolleyHisEnt = this.getTrayTrolleyMapHistoryEntity(oldTrolleyId, 0, tray.id, 'MANUAL', req.username, req.companyCode, req.unitCode);
                await transManager.getRepository(TrayTrolleyMapHistoryEntity).save(trayTrolleyHisEnt, { reload: false});
                await transManager.getRepository(TrayTrolleyMapEntity).delete({ id: existingMapRec.id, companyCode: req.companyCode, unitCode: req.unitCode });
                unMapCount++;
            }
            if(unMapCount == 0) {
                throw new ErrorResponse(6301, 'Tray is not mapped to any trolley yet');
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6302, 'Tray unmapped from the trolley');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    /**
     * WRITER
     * ENDPOINT
     * Maps the tray to the trolley
     * @param req 
     * @returns 
     */
    async mapTrayToTrolley(req: TrayTrolleyMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            /**
             * check if the tray exist
             * check if the trolley exist
             * check if the tray is put in the same trolley
             * check for the tray capacity and override it based on the request 
             * create the history record
             * commit the transaction
             */

            const trolleyRecs = await this.trolleyService.getTrollysByTrollyIdsInternal([req.trolleyId], req.companyCode, req.unitCode, false, false, false);
            if(trolleyRecs.length == 0) {
                throw new ErrorResponse(6303, 'No trolleys found for the provided ids');
            }
            if(!trolleyRecs[0].isActive) {
                throw new ErrorResponse(6304, 'Selected trolley is in de-active state');
            }
            const trayRecs = await this.trayService.getTraysByTrayIdsInternal(req.trayIds, req.companyCode, req.unitCode, false, false);
            if(trayRecs.length == 0) {
                throw new ErrorResponse(6305, 'No trays found for the provided ids');
            }
            if(!trayRecs[0].isActive) {
                throw new ErrorResponse(6306, 'Selected tray is in de-active state');
            }
            const trolleyCapacity = Number(trolleyRecs[0].capacity);
            const trolleyTraysCount = await this. trayTrolleyMapRepo.count({ where: {  companyCode: req.companyCode, unitCode: req.unitCode, confirmedTrolleyId: req.trolleyId }});
            if(trolleyTraysCount >= trolleyCapacity && !req.overrideCapacity) {
                throw new ErrorResponse(6307, `The trolley capacity is already full with ${trolleyTraysCount} trays`);
            }
            await transManager.startTransaction();
            for(const tray of trayRecs) {
                // check and put the tray in the trolley

                const trayTrolleyMapExistingRec = await this.trayTrolleyMapRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, trayId: tray.id }});
                const oldTrolleyId = trayTrolleyMapExistingRec ? trayTrolleyMapExistingRec.confirmedTrolleyId : 0;
                if(oldTrolleyId == req.trolleyId) {
                    throw new ErrorResponse(6308, `The selected tray ${tray.code} is already located in the same trolley ${trolleyRecs[0].code}`);
                }
                const trayTrolleyMapEnt = this.getTrayTrolleyMapEntity(req.trolleyId, tray.id, req.username, req.companyCode, req.unitCode);
                const trayTrolleyHisEnt = this.getTrayTrolleyMapHistoryEntity(oldTrolleyId, req.trolleyId, tray.id, 'MANUAL', req.username, req.companyCode, req.unitCode);
                await transManager.getRepository(TrayTrolleyMapEntity).save(trayTrolleyMapEnt, { reload: false});
                await transManager.getRepository(TrayTrolleyMapHistoryEntity).save(trayTrolleyHisEnt, { reload: false});
                if(trayTrolleyMapExistingRec) {
                    await transManager.getRepository(TrayTrolleyMapEntity).delete({ id: trayTrolleyMapExistingRec.id, companyCode: req.companyCode, unitCode: req.unitCode });
                }
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6309, 'Tray mapped to the trolley');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    getTrayTrolleyMapEntity(trolleyId: number, trayId: number, username: string, companyCode: string, unit: string): TrayTrolleyMapEntity {
        const trmEnt = new TrayTrolleyMapEntity();
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.confirmedTrolleyId = trolleyId;
        trmEnt.suggestedTrolleyId = trolleyId;
        trmEnt.trayId = trayId;
        trmEnt.createdUser = username;
        return trmEnt;
    }

    getTrayTrolleyMapHistoryEntity(fromTrolleyId: number, toTrolleyId: number, trayId: number, movedBy: string, username: string, companyCode: string, unit: string): TrayTrolleyMapHistoryEntity {
        const trmEnt = new TrayTrolleyMapHistoryEntity();
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.fromTrolleyId = fromTrolleyId;
        trmEnt.toTrolleyId = toTrolleyId;
        trmEnt.trayId = trayId;
        trmEnt.createdUser = username;
        trmEnt.movedBy = movedBy;
        return trmEnt;
    }

}