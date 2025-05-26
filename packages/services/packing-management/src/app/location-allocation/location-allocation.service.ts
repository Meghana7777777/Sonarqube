import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PKMSCartonIdsRequest, CartonLocationModel, CartonLocationsResponse } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { ContainerGroupCreationService } from './container-group-creation.service';
import { FGContainerGroupInfoService } from './container-group-info.service';
import { ContainerInfoService } from './container-info.service';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { FgContainerDataService } from '../__masters__/container/fg-container-data-service';



@Injectable()
export class LocationAllocationService {
  constructor(
    private dataSource: DataSource,
    private containerInfoService: ContainerInfoService,
    private containerCartonMapRepo: ContainerCartonMapRepo,
    @Inject(forwardRef(() => LocationMappingHelperService)) private locAllocHelper: LocationMappingHelperService,
    @Inject(forwardRef(() => ContainerGroupCreationService)) private pgCreationService: ContainerGroupCreationService,
    @Inject(forwardRef(() => FGContainerGroupInfoService)) private pgInfoService: FGContainerGroupInfoService,
    @Inject(forwardRef(() => FgContainerDataService)) private containersMasterService: FgContainerDataService,
    @Inject(forwardRef(() => MaterialIssuanceService)) private materialIssuanceService: MaterialIssuanceService,
  ) {

  }

  /**
   * gets the location info for the given carton ids
   * @param req 
   */
  async getLocationDetailsForCartonIds(req: PKMSCartonIdsRequest): Promise<CartonLocationsResponse> {
    if (!req?.cartonIds?.length) {
      throw new ErrorResponse(46070, 'Cartons ids are not provided');
    }
    const cartonLocations: CartonLocationModel[] = [];


    // const containerAndLocationInfo = await this.helperService.getContainerAndLocationData(cartonInfoReq);
    // const trayAndTcartoneyInfo = await this.helperService.getTrayAndTcartoneyData(cartonInfoReq);

    return new CartonLocationsResponse(true, 46071, 'Carton location info retrieved successfully', cartonLocations);
  }
}
