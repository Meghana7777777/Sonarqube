import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { TrayTrolleyMapRepo } from './repositories/tray-trolley-map.repository';
import { TrayTrolleyMapHistoryRepo } from './repositories/tray-trolley-map-history.repository';
import { TrayIdsRequest, TrollyResponse } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrolleyService } from '../master-data/master-services/trollys/trolley.service';

@Injectable()
export class TrayTrolleyInfoService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private trayTrolleyMapRepo: TrayTrolleyMapRepo,
        private trayTrolletMapHisRepo: TrayTrolleyMapHistoryRepo,
        @Inject(forwardRef(() => TraysService)) private trayService: TraysService,
        @Inject(forwardRef(() => TrolleyService)) private trollyService: TrolleyService,
    ) {

    }

    /**
     * gets the trolleys info for the given tray ids
     * @param req 
     * @returns 
     */
    async getTrolleyInfoForTrayIds(req: TrayIdsRequest): Promise<TrollyResponse> {
        const trayIds = req.ids;
        if(!trayIds || trayIds?.length == 0) {
            throw new ErrorResponse(6295, 'Tray ids not provided');
        }
        const trolleysForTrays = await this.trayTrolleyMapRepo.find({select: ['confirmedTrolleyId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, trayId: In(trayIds)}});
        if(trolleysForTrays.length == 0) {
            // An exceptional scenario where we should not throw an error but must return the success response for the validness of the API 
            if(req.dontThrowExceptoin) {
                return new TrollyResponse(true, 6296, 'No mapped trolleys found for the tray ids', []);
            }
            throw new ErrorResponse(6297, 'No mapped trolleys found for the tray ids');
        }
        const trolleyIds = trolleysForTrays.map(r => r.confirmedTrolleyId);
        const trolleys = await this.trollyService.getTrollysByTrollyIdsInternal(trolleyIds, req.companyCode, req.unitCode, false, true, false);
        if(trolleys.length == 0) {
            throw new ErrorResponse(6298, 'No trolleys found for the tray ids');
        }
        return new TrollyResponse(true, 6299, 'Trolleys retrieved for the trays', trolleys);
    }

    // HELPER
    async getTrayIdsMappedForTrolley(trolleyId: number, companyCode: string, unitCode: string): Promise<string[]> {
        let trayIds = [];
        const trayRecs = await this.trayTrolleyMapRepo.find({select: ['trayId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedTrolleyId: trolleyId } });
        trayIds = trayRecs.map(r => r.trayId);
        return trayIds;
    }

     // HELPER
     async getTrolleyIdsMappedForTray(trayIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        let trolleyIds = [];
        const trayRecs = await this.trayTrolleyMapRepo.find({select: ['confirmedTrolleyId'], where: { companyCode: companyCode, unitCode: unitCode, trayId: In(trayIds) } });
        trolleyIds = trayRecs.map(r => r.confirmedTrolleyId);
        return trolleyIds;
    }
}