import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { TraysService } from '../master-data/master-services/trays/trays.service';
import { RollIdsRequest, TrayAndTrolleyModel, TrayAndTrolleyResponse, TrayModel, TrayResponse } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrayRollMapRepo } from './repositories/tray-roll-map.repository';
import { TrayRollMapHistoryRepo } from './repositories/tray-troll-map-history.repository';
import { TrayAndTrolleyCodeQueryResponse } from './repositories/query-reponse/tray-and-trolley-query.response';

@Injectable()
export class TrayRollInfoService {
    getPalletAndBinCodeforRollsIds: any;
    constructor(
        private dataSource: DataSource,
        private trayRollMapRepo: TrayRollMapRepo,
        private trayRollMapHisRepo: TrayRollMapHistoryRepo,
        @Inject(forwardRef(() => TraysService)) private trayService: TraysService,
    ) {

    }

    /**
     * gets the trays info for the given roll ids
     * @param req 
     * @returns 
     */
    async getTrayInfoForRollIds(req: RollIdsRequest): Promise<TrayResponse> {
        const rollIds = req.rollIds;
        if (!rollIds || rollIds?.length == 0) {
            throw new ErrorResponse(6276, 'Object ids are not provided');
        }
        const trayRollEnts = await this.trayRollMapRepo.find({ select: ['confirmedTrayId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, itemLinesId: In(rollIds) } });
        if (trayRollEnts.length == 0) {
            if (req.dontThrowException) {
                return new TrayResponse(true, 6277, 'Trays not yet mapped for the given rolls', []);
            }
            throw new ErrorResponse(6277, 'Trays not yet mapped for the given rolls');
        }
        const trayIds = trayRollEnts.map(r => r.confirmedTrayId);
        const trayInfo = await this.trayService.getTraysByTrayIdsInternal(trayIds, req.companyCode, req.unitCode, false, true);
        return new TrayResponse(true, 6278, 'Tray rolls retrieved successfully', trayInfo);
    }

    // HELPER
    async getRollIdsMappedForTray(trayId: number, companyCode: string, unitCode: string): Promise<string[]> {
        let rollIds = [];
        const rollRecs = await this.trayRollMapRepo.find({ select: ['itemLinesId'], where: { companyCode: companyCode, unitCode: unitCode, confirmedTrayId: trayId } });
        rollIds = rollRecs.map(r => r.itemLinesId);
        return rollIds;
    }


    async getTrayAndTrolleyInfoForRollIdData(req: RollIdsRequest, throwError: boolean = true): Promise<TrayAndTrolleyResponse> {
        const rollIds = req.rollIds;
        if (!rollIds || rollIds?.length == 0) {
            throw new ErrorResponse(6276, 'Object ids are not provided');
        }
        const trayRollEnts: TrayAndTrolleyCodeQueryResponse[] = await this.trayRollMapRepo.getTrayAndTrolleyCodeforRollsIds(req.companyCode, req.unitCode, (rollIds));
        const trayAndTrolleyResult: TrayAndTrolleyModel[] = [];
        if (trayRollEnts.length == 0 && throwError) {
            return new TrayAndTrolleyResponse(false, 6280, 'Tray and Trolley information not found', trayAndTrolleyResult);
        }
        for (const rollinfo of trayRollEnts) {
            const rollTrayTrolleyinfo = new TrayAndTrolleyModel();
            rollTrayTrolleyinfo.rollId = rollinfo.item_lines_id;
            rollTrayTrolleyinfo.trayId = rollinfo.tray_id;
            rollTrayTrolleyinfo.trayName = rollinfo.tray_name;
            rollTrayTrolleyinfo.trayCode = rollinfo.tray_code;
            rollTrayTrolleyinfo.trayBarcode = rollinfo.tray_barcode;
            rollTrayTrolleyinfo.trollyId = rollinfo.trolley_id;
            rollTrayTrolleyinfo.trollyCode = rollinfo.trolley_code;
            rollTrayTrolleyinfo.trollyName = rollinfo.trolley_name;
            rollTrayTrolleyinfo.trollyBarcode = rollinfo.trolley_barcode;
            trayAndTrolleyResult.push(rollTrayTrolleyinfo);
        }
        // const trayIds = trayRollEnts.map(r => r.confirmedTrayId);
        // const trayInfo = await this.trayService.getTraysByTrayIdsInternal(trayIds, req.companyCode, req.unitCode, false, true);
        return new TrayAndTrolleyResponse(true, 6281, 'Tray and trollesys rretrieved successfully', trayAndTrolleyResult);
    }
}