import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { BinDetailsResponse, BinsResponse, RollIdsRequest, TrayModel, TrayResponse, TrollyIdsRequest } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrayRollMapRepo } from './repositories/tray-roll-map.repository';
import { TrayRollMapHistoryRepo } from './repositories/tray-troll-map-history.repository';
import { TrolleyBinMapRepo } from './repositories/trolley-bin-map.repository';
import { TrolleyService } from '../master-data/master-services/trollys/trolley.service';
import { BinsDataService } from '../master-data/master-services/bins/bins.services';

@Injectable()
export class TrolleyBinInfoService {
    constructor(
        private dataSource: DataSource,
        private trolleyBinMapRepo: TrolleyBinMapRepo,
        @Inject(forwardRef(() => BinsDataService)) private binService: BinsDataService,
    ) {

    }

    /**
     * ENDPOINT
     * gets the trays info for the given roll ids
     * @param req 
     * @returns 
     */
    async getBinInfoForTrolleyIds(req: TrollyIdsRequest): Promise<BinDetailsResponse> {
        const trolleyIds = req.ids;
        if(!trolleyIds || trolleyIds?.length == 0) {
            throw new ErrorResponse(6310, 'Trolley ids are not provided');
        }
        const trolleyBinEnts = await this.trolleyBinMapRepo.find({ select: ['binId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, trolleyId: In(trolleyIds)}});
        if(trolleyBinEnts.length == 0) {
            if(req.dontThrowException) {
                return new BinDetailsResponse(true, 6311, 'Bins not yet mapped for the given trolleys', []);
            }
            throw new ErrorResponse(6312, 'Bins not yet mapped for the given trolleys');
        }
        const binIds = trolleyBinEnts.map(r => r.binId);
        const binsInfo = await this.binService.getBinsBasicInfo( req.companyCode, req.unitCode, binIds, true);
        return new BinDetailsResponse(true, 6313, 'Tray rolls retrieved successfully', binsInfo);
    }


    // HELPER
    // NOT END POINT
    async getTrolleyIdsForBin(binId: number, companyCode: string, unitCode: string): Promise<string[]> {
        let trolleyIds: string[] = [];
        const trolleyMapRecs = await this.trolleyBinMapRepo.find({select:['trolleyId'], where: { companyCode: companyCode, unitCode: unitCode, binId: binId }});
        trolleyIds = trolleyMapRecs.map(r => r.trolleyId.toString());
        return trolleyIds;
    }

    // HELPER
    // NOT END POINT
    async getBinIdsForTrolleyIds(trolleyIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        let bindIds: number[] = [];
        const trolleyMapRecs = await this.trolleyBinMapRepo.find({select:['binId'], where: { companyCode: companyCode, unitCode: unitCode, trolleyId: In(trolleyIds) }});
        bindIds = trolleyMapRecs.map(r => r.binId);
        return bindIds;
    }



}