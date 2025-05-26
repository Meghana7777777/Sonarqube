import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, GlobalResponseObject, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackingListInfoModel, PackingListInfoResponse, PackingListUploadTypeEnum, PalletIdRequest, PalletRollMappingRequest, PhBatchLotRollRequest, RollIdsRequest, RollLocationModel, RollLocationsResponse, RollsGrnRequest, SpoLogDownloadMethodEnum, rollLocationInfoModel } from '@xpparel/shared-models';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PalletGroupInfoService } from './pallet-group-info.service';
import { PalletGroupCreationService } from './pallet-group-creation.service';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { DataSource } from 'typeorm';
import { PalletInfoService } from './pallet-info.service';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { TrayRollInfoService } from '../tray-trolly/tray-roll-info.service';



@Injectable()
export class LocationAllocationService {
  constructor(
    private dataSource: DataSource,
    private palletInfoService: PalletInfoService,
    private trayRollInfoService: TrayRollInfoService,
    private palletRollMapRepo: PalletRollMapRepo,
    @Inject(forwardRef(() => LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
    @Inject(forwardRef(() => PalletGroupCreationService)) private pgCreationService: PalletGroupCreationService,
    @Inject(forwardRef(() => PalletGroupInfoService)) private pgInfoService: PalletGroupInfoService,
    @Inject(forwardRef(() => PalletsDataService)) private palletsMasterService: PalletsDataService,
    @Inject(forwardRef(() => MaterialIssuanceService)) private materialIssuanceService: MaterialIssuanceService,
  ) {

  }

  /**
   * gets the location info for the given roll ids
   * @param req 
   */
  async getLocationDetailsForRollIds(req: RollIdsRequest): Promise<RollLocationsResponse> {
    if (!req?.rollIds?.length) {
      throw new ErrorResponse(6079, 'Objects ids are not provided');
    }
    const rollLocations: RollLocationModel[] = [];

    for (const roll of req.rollIds) {
      const rollLevelReq: RollIdsRequest = {
        ...req,
        rollIds: [roll]
      }
      const palletInfoService = await this.palletInfoService.getPalletAndBinbyRollIdData(rollLevelReq);
      const trayRollInfoService = await this.trayRollInfoService.getTrayAndTrolleyInfoForRollIdData(rollLevelReq);

    }



    // const palletAndBinInfo = await this.helperService.getPalletAndBinData(rollInfoReq);
    // const trayAndTrolleyInfo = await this.helperService.getTrayAndTrolleyData(rollInfoReq);

    return new RollLocationsResponse(true, 6080, 'Object location info retrieved successfully', rollLocations);
  }
  
}
