import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { LocationDetailsResponse, LocationIdRequest, LocationContainerMappingRequest, CommonRequestAttrs, GlobalResponseObject, InspectionContainerCartonsResponse, PackListIdRequest, PackListContainerCfNcfPfendingCartonsResponse, FgContainerDetailsResponse, ContainerIdRequest, ContainerCartonMappingRequest, ContainerCartonsResponse, ContainerGroupIdRequest, PgCartonsResponse, RackLocationContainersResponse, PKMSCartonIdsRequest, CartonIssueQtyRequest, CartonLocationsResponse, CartonContainerMappingValidationResponse, WarehouseContainerCartonsResponse, FgWarehouseContainerCartonsResponse, ContainerAndLocationResponse, CartonIdsRequest, FgContainerFilterRequest, FgLocationFilterReq, PackOrderIdModel, CartonScanReqNoDto, CartonBarCodesReqDto } from '@xpparel/shared-models';
import { LocationInfoService } from './location-info.service';
import { LocationAllocationService } from './location-allocation.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { ContainerGroupCreationService } from './container-group-creation.service';
import { FGContainerGroupInfoService } from './container-group-info.service';
import { ContainerInfoService } from './container-info.service';
import { CartonContainerMappingService } from './carton-container-mapping.service';
import { ContainerLocationMappingService } from './container-location-mapping.service';

@ApiTags('Location Allocation Module')
@Controller('location-allocation')
export class LocationAllocationController {
  constructor(private readonly locationAllocationService: LocationAllocationService,
    private containerCartonMappingService: CartonContainerMappingService,
    private containerInfoService: ContainerInfoService,
    private containerLocationMappingService: ContainerLocationMappingService,
    private locationInfoService: LocationInfoService,
    private pgInfoService: FGContainerGroupInfoService,
    private pgCreationService: ContainerGroupCreationService,
    private materialIssuanceService: MaterialIssuanceService,
  ) { }


  // ------------------------------------------ ROLL PALLET -----------------------------------------

  // VALIDATOR
  // MANUAL CONFIRMATION
  @Post('/validateConfirmCartonsToContainer')
  async validateConfirmCartonsToContainer(@Body() req: ContainerCartonMappingRequest): Promise<CartonContainerMappingValidationResponse> {
    try {
      return await this.containerCartonMappingService.validateConfirmCartonsToContainer(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  // FUNCTIONALITY
  // MANUAL CONFIRMATION
  @Post('/confirmCartonsToContainer')
  async confirmCartonsToContainer(@Body() req: ContainerCartonMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerCartonMappingService.confirmCartonsToContainer(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  // FUNCTIONALITY
  // NEW 
  // MANUAL CONFIRMATION
  @Post('/deAllocateCartonsToContainerAtFgOutLocation')
  async deAllocateCartonsToContainerAtFgOutLocation(@Body() req: CartonBarCodesReqDto): Promise<GlobalResponseObject> {
    try {
      return await this.containerCartonMappingService.deAllocateCartonsToContainerAtFgOutLocation(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  };



  @Post('/deAllocateCartonsToContainer')
  async deAllocateCartonsToContainer(@Body() req: ContainerCartonMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerCartonMappingService.deAllocateCartonsToContainer(req, req.markAsIssued);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/deAllocateCartonByBarCode')
  async deAllocateCartonByBarCode(@Body() req: CartonScanReqNoDto): Promise<GlobalResponseObject> {
    try {
      return await this.containerCartonMappingService.deAllocateCartonByBarCode(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  // Modifed Above API Due to Client Reqirement while issuing material
  @Post('/deAllocateCartonsToContaineratIssuance')
  async deAllocateCartonsToContaineratIssuance(@Body() req: ContainerCartonMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerCartonMappingService.deAllocateCartonsToContaineratIssuance(req, null, req.markAsIssued);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  // FUNCTIONALITY
  @Post('/allocateCartonsToContainer')
  async allocateCartonsToContainer(@Body() req: ContainerCartonMappingRequest): Promise<GlobalResponseObject> {
    try {
      // return await this.containerCartonMappingService.allocateCartonsToContainer(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }


  // RETRIEVAL
  @Post('/getContainerMappingInfoWithoutCartons')
  async getContainerMappingInfoWithoutCartons(@Body() req: ContainerIdRequest): Promise<FgContainerDetailsResponse> {
    try {
      return await this.containerInfoService.getContainerMappingInfoWithoutCartons(req);
    } catch (error) {
      return returnException(FgContainerDetailsResponse, error);
    }
  }

  // RETRIEVAL
  @Post('/getContainerMappingInfoWithCartons')
  async getContainerMappingInfoWithCartons(@Body() req: ContainerIdRequest): Promise<ContainerCartonsResponse> {
    try {
      return await this.containerInfoService.getContainerMappingInfoWithCartons(req);
    } catch (error) {
      return returnException(ContainerCartonsResponse, error);
    }
  }

  // RETRIEVAL
  @Post('/getContainersMappedForPackingList')
  async getContainersMappedForPackingList(@Body() req: PackListIdRequest): Promise<FgContainerDetailsResponse> {
    try {
      return await this.containerInfoService.getContainersMappedForPackingList(req);
    } catch (error) {
      return returnException(FgContainerDetailsResponse, error);
    }
  }

  // RETRIEVAL
  @Post('/getInspectionContainerMappingInfoWithCartons')
  async getInspectionContainerMappingInfoWithCartons(@Body() req: ContainerIdRequest): Promise<InspectionContainerCartonsResponse> {
    try {
      return await this.containerInfoService.getInspectionContainerMappingInfoWithCartons(req);
    } catch (error) {
      return returnException(InspectionContainerCartonsResponse, error);
    }
  }

  // RETRIEVAL
  @Post('/getWarehouseContainerMappingInfoWithCartons')
  async getWarehouseContainerMappingInfoWithCartons(@Body() req: ContainerIdRequest): Promise<FgWarehouseContainerCartonsResponse> {
    try {
      return await this.containerInfoService.getWarehouseContainerMappingInfoWithCartons(req);
    } catch (error) {
      return returnException(FgWarehouseContainerCartonsResponse, error);
    }
  }




  // -------------------------------------------- PALLET BIN ----------------------------------------------------
  @Post('/getAllSpaceFreeContainersInWarehouse')
  async getAllSpaceFreeContainersInWarehouse(@Body() req: FgContainerFilterRequest): Promise<FgContainerDetailsResponse> {
    try {
      return await this.containerInfoService.getAllSpaceFreeContainersInWarehouse(req);
    } catch (error) {
      return returnException(FgContainerDetailsResponse, error);
    }
  }

  @Post('/getAllOccupiedContainersInWarehouse')
  async getAllOccupiedContainersInWarehouse(@Body() req: CommonRequestAttrs): Promise<FgContainerDetailsResponse> {
    try {
      return await this.containerInfoService.getAllOccupiedContainersInWarehouse(req);
    } catch (error) {
      return returnException(FgContainerDetailsResponse, error);
    }
  }

  @Post('/confirmContainersToLocation')
  async confirmContainersToLocation(@Body() req: LocationContainerMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerLocationMappingService.confirmContainersToLocation(req);
    } catch (error) {
      return returnException(WarehouseContainerCartonsResponse, error);
    }
  }

  @Post('/allocatePakcListContainersToLocation')
  async allocatePakcListContainersToLocation(@Body() req: PackOrderIdModel): Promise<GlobalResponseObject> {
    try {
      return await this.containerLocationMappingService.allocatePakcListContainersToLocation(req);
    } catch (error) {
      return returnException(WarehouseContainerCartonsResponse, error);
    }
  }

  @Post('/allocateContainersToLocation')
  async allocateContainersToLocation(@Body() req: LocationContainerMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerLocationMappingService.allocateContainersToLocation(req);
    } catch (error) {
      return returnException(WarehouseContainerCartonsResponse, error);
    }
  }

  @Post('/getLocationInfoWithoutContainers')
  async getLocationInfoWithoutContainers(@Body() req: LocationIdRequest): Promise<LocationDetailsResponse> {
    try {
      return await this.locationInfoService.getLocationInfoWithoutContainers(req);
    } catch (error) {
      return returnException(LocationDetailsResponse, error);
    }
  }

  @Post('/getLocationsMappedForPackingList')
  async getLocationsMappedForPackingList(@Body() req: PackListIdRequest): Promise<LocationDetailsResponse> {
    try {
      return await this.locationInfoService.getLocationsMappedForPackingList(req);
    } catch (error) {
      return returnException(LocationDetailsResponse, error);
    }
  }

  @Post('/getLocationContainersWithCartons')
  async getLocationContainersWithCartons(@Body() req: LocationIdRequest): Promise<RackLocationContainersResponse> {
    try {
      return await this.locationInfoService.getLocationContainersWithCartons(req);
    } catch (error) {
      return returnException(RackLocationContainersResponse, error);
    }
  }

  @Post('/getLocationContainersWithoutCartons')
  async getLocationContainersWithoutCartons(@Body() req: LocationIdRequest): Promise<RackLocationContainersResponse> {
    try {
      return await this.locationInfoService.getLocationContainersWithoutCartons(req);
    } catch (error) {
      return returnException(RackLocationContainersResponse, error);
    }
  }


  @Post('/getAllSpaceFreeLocationsInWarehouse')
  async getAllSpaceFreeLocationsInWarehouse(@Body() req: FgLocationFilterReq): Promise<LocationDetailsResponse> {
    try {
      return await this.locationInfoService.getAllSpaceFreeLocationsInWarehouse(req);
    } catch (error) {
      return returnException(LocationDetailsResponse, error);
    }
  }


  // ---------------------------- PALLET GRPOUPING ---------------------------
  @Post('/getPgIdsForPackListId')
  async getPgIdsForPackListId(@Body() req: PackListIdRequest): Promise<PgCartonsResponse> {
    try {
      return await this.pgInfoService.getPgIdsForPackListId(req);
    } catch (error) {
      return returnException(PgCartonsResponse, error);
    }
  }

  @Post('/getInspectionCartonsForPgId')
  async getInspectionCartonsForPgId(@Body() req: ContainerGroupIdRequest): Promise<PgCartonsResponse> {
    try {
      return await this.pgInfoService.getInspectionCartonsForPgId(req);
    } catch (error) {
      return returnException(PgCartonsResponse, error);
    }
  }

  @Post('/getWarehouseCartonsForForPgId')
  async getWarehouseCartonsForForPgId(@Body() req: ContainerGroupIdRequest): Promise<PgCartonsResponse> {
    try {
      return await this.pgInfoService.getWarehouseCartonsForForPgId(req);
    } catch (error) {
      return returnException(PgCartonsResponse, error);
    }
  }

  @Post('/createContainerGroupsForPackList')
  async createContainerGroupsForPackList(@Body() req: PackListIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.pgCreationService.createContainerGroupsForPackList(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/getAllPendingToContainerConfirmationCartonsInPackingList')
  async getAllPendingToContainerConfirmationCartonsInPackingList(@Body() req: PackListIdRequest): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
    try {
      return await this.containerInfoService.getAllPendingToContainerConfirmationCartonsInPackingList(req);
    } catch (error) {
      return returnException(PackListContainerCfNcfPfendingCartonsResponse, error);
    }
  }


  @Post('/getAllContainerConfirmationCartonsInPackingList')
  async getAllContainerConfirmationCartonsInPackingList(@Body() req: PackListIdRequest): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
    try {
      return await this.containerInfoService.getAllContainerConfirmationCartonsInPackingList(req);
    } catch (error) {
      return returnException(PackListContainerCfNcfPfendingCartonsResponse, error);
    }
  }

  // NEW 
  // FUNCTIONALITY
  @Post('/issueCartonQuantity')
  async issueCartonQuantity(@Body() req: CartonIssueQtyRequest): Promise<GlobalResponseObject> {
    try {
      return await this.materialIssuanceService.issueCartonQuantity(req, req.deAllocateFromContainer);
    } catch (error) {
      return returnException(PackListContainerCfNcfPfendingCartonsResponse, error);
    }
  }


  // End Point to Unmap container from Location
  @Post('/unmapContainerFromALocation')
  async unmapContainerFromALocation(@Body() req: ContainerIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.containerLocationMappingService.unmapContainerFromALocation(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }


  @Post('/getContainerAndLocationByCartonIdData')
  async getContainerAndLocationByCartonIdData(@Body() req: CartonIdsRequest): Promise<ContainerAndLocationResponse> {
    try {
      return await this.containerInfoService.getContainerAndLocationByCartonIdData(req);
    } catch (error) {
      return returnException(ContainerAndLocationResponse, error);
    }
  }


  @Post('/getLocationDetailsForCartonIds')
  async getLocationDetailsForCartonIds(@Body() req: PKMSCartonIdsRequest): Promise<CartonLocationsResponse> {
    try {
      return await this.locationAllocationService.getLocationDetailsForCartonIds(req);
    } catch (error) {
      return returnException(CartonLocationsResponse, error);
    }
  }

}
