import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import moment = require('moment');
import { GrnInfoQryResp } from '../packing-list/repository/query-response/grn-info.qry.response';
import { GrnDetailsForDashboardResponse, GrnInfoForDashboard, GrnPackListInfo } from '@xpparel/shared-models';
import { PalletGroupInfoService } from '../location-allocation/pallet-group-info.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GrnDashboardService {
    constructor(
        private packListInfoService: PackingListInfoService,
        private palletRollInfoService: PalletGroupInfoService,
    ) {

    }
    
    async getGrnInfoForDashboard(unitCode: string, companyCode: string): Promise<GrnDetailsForDashboardResponse> {
        const nonCompletedGrnInfo: GrnInfoQryResp[] = await this.packListInfoService.getPackListGrnOpenInfo(unitCode, companyCode);
        const grnPackLists = [];
        for (const eachPackList of nonCompletedGrnInfo) {
            let binAllocated = true;
            const confirmedPallets = await this.palletRollInfoService.getConfirmedPalletIdsForPackList(companyCode, unitCode, eachPackList.phId);
            if (confirmedPallets.length == 0) {
                binAllocated = false
            }
            const grnPackListInfo = new GrnPackListInfo(eachPackList.phCode, eachPackList.style, eachPackList.pack_list_date, (eachPackList.open_count + eachPackList.done_count), eachPackList.done_count, eachPackList.updated_user, eachPackList.grn_status, eachPackList.unloaded_roll_count, eachPackList.unload_complete_at, eachPackList.grn_date,  binAllocated, eachPackList.supplier_name);
            grnPackLists.push(grnPackListInfo);
        }
        const grnInfoModel = new GrnInfoForDashboard(nonCompletedGrnInfo.length, nonCompletedGrnInfo.length, grnPackLists);
        return new GrnDetailsForDashboardResponse(true, 6003, 'Grn Info Received successfully', grnInfoModel)
    }   
}