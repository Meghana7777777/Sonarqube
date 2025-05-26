import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrolleyService } from '../master-data/master-services/trollys/trolley.service';
import { GlobalResponseObject, TrayTrolleyMappingRequest, TrolleyBinMappingRequest } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { TrayTrolleyMapRepo } from './repositories/tray-trolley-map.repository';
import { TrayTrolleyMapHistoryRepo } from './repositories/tray-trolley-map-history.repository';
import { TrayTrolleyMapEntity } from './entities/tray-trolley-map.entity';
import { TrayTrolleyMapHistoryEntity } from './entities/tray-trolley-map-history.entity';
import { BinInfoService } from '../location-allocation/bin-info.service';
import { TrolleyBinMapRepo } from './repositories/trolley-bin-map.repository';
import { BinsDataService } from '../master-data/master-services/bins/bins.services';
import { TrolleyBinMapEntity } from './entities/trolley-bin-map.entity';
import { TrolleyBinMapHistoryEntity } from './entities/trolley-bin-map-history.entity';

@Injectable()
export class TrolleyBinMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private trolleyBinRepo: TrolleyBinMapRepo,
        @Inject(forwardRef(() => TrolleyService)) private trolleyService: TrolleyService,
        @Inject(forwardRef(() => BinsDataService)) private binService: BinsDataService,
        @Inject(forwardRef(() => BinInfoService)) private binInfoService: BinInfoService,
    ) {

    }

    /**
     * WRITER
     * ENDPOINT
     * unmaps the trolley from the bin
     * @param req 
     */
    async unmapTrolleyFromBin(req: TrolleyBinMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {

            const trolleyRecs = await this.trolleyService.getTrollysByTrollyIdsInternal([req.trolleyId], req.companyCode, req.unitCode, false, false, false);
            if(trolleyRecs.length == 0) {
                throw new ErrorResponse(6314, 'No trolleys found for the provided ids');
            }
            let unMapCount = 0;
            await transManager.startTransaction();
            for(const trolley of trolleyRecs) {
                const existingMapRec = await this.trolleyBinRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, trolleyId: trolley.id }});
                if(!existingMapRec) {
                    continue;
                }
                const oldBinId = existingMapRec ? existingMapRec.binId : 0;

                const trolleyBinHisEnt = this.getTrolleyBinMapHistoryEntity(oldBinId, 0, req.trolleyId, 0, 'MANUAL', req.username, req.companyCode, req.unitCode);
                await transManager.getRepository(TrolleyBinMapHistoryEntity).save(trolleyBinHisEnt, { reload: false});
                await transManager.getRepository(TrolleyBinMapEntity).delete({ id: existingMapRec.id, companyCode: req.companyCode, unitCode: req.unitCode });
                unMapCount++;
            }
            if(unMapCount == 0) {
                throw new ErrorResponse(6315, 'Trolley is not mapped to any bin yet');
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6316, 'Trolley unmapped from the bin successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    /**
     * WRITER
     * ENDPOINT
     * Maps the trolley to the bin
     * @param req 
     * @returns 
     */
    async mapTrolleyToBin(req: TrolleyBinMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            /**
             * check if the bin exist
             * check if the trolley exist
             * check if the trolley is put in the same bin
             * check for the bin capacity and override it based on the request 
             * create the history record
             * commit the transaction
             */
            
            const trolleyRecs = await this.trolleyService.getTrollysByTrollyIdsInternal([req.trolleyId], req.companyCode, req.unitCode, false, false, false);
            if(trolleyRecs.length == 0) {
                throw new ErrorResponse(6317, 'No trolleys found for the provided ids');
            }
            if(!trolleyRecs[0].isActive) {
                throw new ErrorResponse(6318, 'Selected trolley is in de-active state');
            }
            const binRec = await this.binService.getBinRecordById(req.binId, req.companyCode, req.unitCode);
            if(!binRec) {
                throw new ErrorResponse(6319, 'No bin found for the provided ids');
            }
            if(!binRec.isActive) {
                throw new ErrorResponse(6320, 'Selected bin is in de-active state');
            }
            if(binRec.level > 1) {
                throw new ErrorResponse(6321, 'Trolley can only be put in LEVEL-1 bins');
            }
            
            // check if there is any pallet in the bin
            const palletsInBin = await this.binInfoService.getPalletIdsInBin(req.binId, req.companyCode, req.unitCode);
            if(palletsInBin.length > 0) {
                throw new ErrorResponse(6322, `Currently ${palletsInBin.length} pallets are mapped to the bin. Trolley cannot be placed`);
            }
            const binCapacity = 1;
            const trolleyBinCount = await this.trolleyBinRepo.count({ where: {  companyCode: req.companyCode, unitCode: req.unitCode, binId: req.binId }});
            if(trolleyBinCount >= binCapacity && !req.overrideCapacity) {
                throw new ErrorResponse(6323, `The Bin capacity is already full with ${trolleyBinCount} trolley`);
            }

            await transManager.startTransaction();

            // check and put the trolley in the bin
            const trolleyBinMapExistingRec = await this.trolleyBinRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, trolleyId: req.trolleyId }});
            const oldBinId = trolleyBinMapExistingRec ? trolleyBinMapExistingRec.binId : 0;
            if(oldBinId == req.binId) {
                throw new ErrorResponse(6324, `The selected trolley ${trolleyRecs[0].code} is already located in the same bin ${binRec.name}`);
            }

            const trolleyBinMapEnt = this.getTrolleyBinMapEntity(req.trolleyId, req.binId, binRec.lRackId, req.username, req.companyCode, req.unitCode);
            const trolleyBinHisEnt = this.getTrolleyBinMapHistoryEntity(oldBinId, req.binId, req.trolleyId, binRec.lRackId, 'MANUAL', req.username, req.companyCode, req.unitCode);
            await transManager.getRepository(TrolleyBinMapEntity).save(trolleyBinMapEnt, { reload: false});
            await transManager.getRepository(TrolleyBinMapHistoryEntity).save(trolleyBinHisEnt, { reload: false});
            if(trolleyBinMapExistingRec) {
                await transManager.getRepository(TrolleyBinMapEntity).delete({ id: trolleyBinMapExistingRec.id, companyCode: req.companyCode, unitCode: req.unitCode });
            }

            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6325, 'Trolley mapped to the bin');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    getTrolleyBinMapEntity(trolleyId: number, binId: number, rackId: number, username: string, companyCode: string, unit: string): TrolleyBinMapEntity {
        const trmEnt = new TrolleyBinMapEntity();
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.trolleyId = trolleyId;
        trmEnt.binId = binId;
        trmEnt.rackId = rackId;
        trmEnt.createdUser = username;
        return trmEnt;
    }

    getTrolleyBinMapHistoryEntity(fromBinId: number, toBinId: number, trolleyId: number, rackId: number, movedBy: string, username: string, companyCode: string, unit: string): TrolleyBinMapHistoryEntity {
        const trmEnt = new TrolleyBinMapHistoryEntity;
        trmEnt.companyCode = companyCode;
        trmEnt.unitCode = unit;
        trmEnt.fromBinId = fromBinId;
        trmEnt.toBinId = toBinId;
        trmEnt.trolleyId = trolleyId;
        trmEnt.createdUser = username;
        trmEnt.movedBy = movedBy;
        return trmEnt;
    }

}