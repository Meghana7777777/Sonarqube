import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationAllocationService } from './location-allocation.service';
import { CreateLocationAllocationDto } from './dto/create-location-allocation.dto';
import { UpdateLocationAllocationDto } from './dto/update-location-allocation.dto';
import { ApiTags } from '@nestjs/swagger';
import { PhBatchLotRollRequest, RollsGrnRequest ,PalletIdRequest, PalletRollMappingRequest, InspectionPalletRollConfirmationRequest, PackingListInfoResponse, GlobalResponseObject, InspectionPalletRollsResponse, PalletDetailsResponse, PackListIdRequest, WarehousePalletRollsResponse, BinPalletMappingRequest, BinIdRequest, BinDetailsResponse, RackBinPalletsResponse, PgIdRequest, PgRollsResponse, CommonRequestAttrs, PackListPalletCfNcfPfendingRollsResponse, RollIssueQtyRequest, PalletRollsResponse, RollPalletMappingValidationResponse, RollIdsRequest, PalletAndBinResponse, RollLocationsResponse} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { RollPalletMappingService } from './roll-pallet-mapping.service';
import { PalletInfoService } from './pallet-info.service';
import { PalletBinMappingService } from './pallet-bin-mapping.service';
import { BinInfoService } from './bin-info.service';
import { PalletGroupInfoService } from './pallet-group-info.service';
import { PalletGroupCreationService } from './pallet-group-creation.service';
import { MaterialIssuanceService } from './material-issuance.service';

@ApiTags('Location Allocation Module')
@Controller('location-allocation')
export class LocationAllocationController {
  constructor(private readonly locationAllocationService: LocationAllocationService,
      private palletRollMappingService: RollPalletMappingService,
      private palletInfoService: PalletInfoService,
      private palletBinMappingService: PalletBinMappingService,
      private binInfoService: BinInfoService,
      private pgInfoService: PalletGroupInfoService,
      private pgCreationService: PalletGroupCreationService,
      private materialIssuanceService: MaterialIssuanceService,
    ) {}


  // ------------------------------------------ ROLL PALLET -----------------------------------------

  // VALIDATOR
  // MANUAL CONFIRMATION
  @Post('/validateConfirmRollsToPallet')
  async validateConfirmRollsToPallet(@Body() req: PalletRollMappingRequest): Promise<RollPalletMappingValidationResponse> {
    try {
      return await this.palletRollMappingService.validateConfirmRollsToPallet(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

  // FUNCTIONALITY
  // MANUAL CONFIRMATION
  @Post('/confirmRollsToPallet')
  async confirmRollsToPallet(@Body() req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletRollMappingService.confirmRollsToPallet(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

  // FUNCTIONALITY
  // NEW 
  // MANUAL CONFIRMATION
  @Post('/deAllocateRollsToPallet')
  async deAllocateRollsToPallet(@Body() req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletRollMappingService.deAllocateRollsToPallet(req, req.markAsIssued);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

    // Modifed Above API Due to Client Reqirement while issuing material
    @Post('/deAllocateRollsToPalletatIssuance')
    async deAllocateRollsToPalletatIssuance(@Body() req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
      try {
        return await this.palletRollMappingService.deAllocateRollsToPalletatIssuance(req, null, req.markAsIssued);
      } catch (error) {
        return returnException(GlobalResponseObject,error);
      }
    }

  // FUNCTIONALITY
  @Post('/allocateRollsToPallet')
  async allocateRollsToPallet(@Body() req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
    try {
      // return await this.palletRollMappingService.allocateRollsToPallet(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }


  // RETRIEVAL
  @Post('/getPalletMappingInfoWithoutRolls')
  async getPalletMappingInfoWithoutRolls(@Body() req: PalletIdRequest): Promise<PalletDetailsResponse> {
    try {
      return await this.palletInfoService.getPalletMappingInfoWithoutRolls(req);
    } catch (error) {
      return returnException(PalletDetailsResponse,error);
    }
  }

  // RETRIEVAL
  @Post('/getPalletMappingInfoWithRolls')
  async getPalletMappingInfoWithRolls(@Body() req: PalletIdRequest): Promise<PalletRollsResponse> {
    try {
      return await this.palletInfoService.getPalletMappingInfoWithRolls(req);
    } catch (error) {
      return returnException(PalletRollsResponse,error);
    }
  }

  // RETRIEVAL
  @Post('/getPalletsMappedForPackingList')
  async getPalletsMappedForPackingList(@Body() req: PackListIdRequest): Promise<PalletDetailsResponse> {
    try {
      return await this.palletInfoService.getPalletsMappedForPackingList(req);
    } catch (error) {
      return returnException(PalletDetailsResponse,error);
    }
  }

  // RETRIEVAL
  @Post('/getInspectionPalletMappingInfoWithRolls')
  async getInspectionPalletMappingInfoWithRolls(@Body() req: PalletIdRequest): Promise<InspectionPalletRollsResponse> {
    try {
      return await this.palletInfoService.getInspectionPalletMappingInfoWithRolls(req);
    } catch (error) {
      return returnException(InspectionPalletRollsResponse,error);
    }
  }

  // RETRIEVAL
  @Post('/getWarehousePalletMappingInfoWithRolls')
  async getWarehousePalletMappingInfoWithRolls(@Body() req: PalletIdRequest): Promise<WarehousePalletRollsResponse> {
    try {
      return await this.palletInfoService.getWarehousePalletMappingInfoWithRolls(req);
    } catch (error) {
      return returnException(WarehousePalletRollsResponse,error);
    }
  }




  // -------------------------------------------- PALLET BIN ----------------------------------------------------
  @Post('/getAllSpaceFreePalletsInWarehouse')
  async getAllSpaceFreePalletsInWarehouse(@Body() req: CommonRequestAttrs): Promise<PalletDetailsResponse> {
    try {
      return await this.palletInfoService.getAllSpaceFreePalletsInWarehouse(req);
    } catch (error) {
      return returnException(PalletDetailsResponse,error);
    }
  }

  @Post('/getAllOccupiedPalletsInWarehouse')
  async getAllOccupiedPalletsInWarehouse(@Body() req: CommonRequestAttrs): Promise<PalletDetailsResponse> {
    try {
      return await this.palletInfoService.getAllOccupiedPalletsInWarehouse(req);
    } catch (error) {
      return returnException(PalletDetailsResponse,error);
    }
  }

  @Post('/confirmPalletsToBin')
  async confirmPalletsToBin(@Body() req: BinPalletMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletBinMappingService.confirmPalletsToBin(req);
    } catch (error) {
      return returnException(WarehousePalletRollsResponse,error);
    }
  }

  @Post('/allocatePakcListPalletsToBin')
  async allocatePakcListPalletsToBin(@Body() req: PackListIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletBinMappingService.allocatePakcListPalletsToBin(req);
    } catch (error) {
      return returnException(WarehousePalletRollsResponse,error);
    }
  }

  @Post('/allocatePalletsToBin')
  async allocatePalletsToBin(@Body() req: BinPalletMappingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletBinMappingService.allocatePalletsToBin(req);
    } catch (error) {
      return returnException(WarehousePalletRollsResponse,error);
    }
  }

  @Post('/getBinInfoWithoutPallets')
  async getBinInfoWithoutPallets(@Body() req: BinIdRequest): Promise<BinDetailsResponse> {
    try {
      return await this.binInfoService.getBinInfoWithoutPallets(req);
    } catch (error) {
      return returnException(BinDetailsResponse,error);
    }
  }

  @Post('/getBinsMappedForPackingList')
  async getBinsMappedForPackingList(@Body() req: PackListIdRequest): Promise<BinDetailsResponse> {
    try {
      return await this.binInfoService.getBinsMappedForPackingList(req);
    } catch (error) {
      return returnException(BinDetailsResponse,error);
    }
  }

  @Post('/getBinPalletsWithRolls')
  async getBinPalletsWithRolls(@Body() req: BinIdRequest): Promise<RackBinPalletsResponse> {
    try {
      return await this.binInfoService.getBinPalletsWithRolls(req);
    } catch (error) {
      return returnException(RackBinPalletsResponse,error);
    }
  }

  @Post('/getBinPalletsWithoutRolls')
  async getBinPalletsWithoutRolls(@Body() req: BinIdRequest): Promise<RackBinPalletsResponse> {
    try {
      return await this.binInfoService.getBinPalletsWithoutRolls(req);
    } catch (error) {
      return returnException(RackBinPalletsResponse,error);
    }
  }


  @Post('/getAllSpaceFreeBinsInWarehouse')
  async getAllSpaceFreeBinsInWarehouse(@Body() req: CommonRequestAttrs): Promise<BinDetailsResponse> {
    try {
      return await this.binInfoService.getAllSpaceFreeBinsInWarehouse(req);
    } catch (error) {
      return returnException(BinDetailsResponse,error);
    }
  }


  // ---------------------------- PALLET GRPOUPING ---------------------------
  @Post('/getPgIdsForPackListId')
  async getPgIdsForPackListId(@Body() req: PackListIdRequest): Promise<PgRollsResponse> {
    try {
      return await this.pgInfoService.getPgIdsForPackListId(req);
    } catch (error) {
      return returnException(PgRollsResponse,error);
    }
  }

  @Post('/getInspectionRollsForPgId')
  async getInspectionRollsForPgId(@Body() req: PgIdRequest): Promise<PgRollsResponse> {
    try {
      return await this.pgInfoService.getInspectionRollsForPgId(req);
    } catch (error) {
      return returnException(PgRollsResponse,error);
    }
  }

  @Post('/getWarehouseRollsForForPgId')
  async getWarehouseRollsForForPgId(@Body() req: PgIdRequest): Promise<PgRollsResponse> {
    try {
      return await this.pgInfoService.getWarehouseRollsForForPgId(req);
    } catch (error) {
      return returnException(PgRollsResponse,error);
    }
  }

  @Post('/createPalletGroupsForPackList')
  async createPalletGroupsForPackList(@Body() req: PackListIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.pgCreationService.createPalletGroupsForPackList(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

  @Post('/getAllPendingToPalletConfirmationRollsInPackingList')
  async getAllPendingToPalletConfirmationRollsInPackingList(@Body() req: PackListIdRequest): Promise<PackListPalletCfNcfPfendingRollsResponse> {
    try {
      return await this.palletInfoService.getAllPendingToPalletConfirmationRollsInPackingList(req);
    } catch (error) {
      return returnException(PackListPalletCfNcfPfendingRollsResponse,error);
    }
  }


  @Post('/getAllPalletConfirmationRollsInPackingList')
  async getAllPalletConfirmationRollsInPackingList(@Body() req: PackListIdRequest): Promise<PackListPalletCfNcfPfendingRollsResponse> {
    try {
      return await this.palletInfoService.getAllPalletConfirmationRollsInPackingList(req);
    } catch (error) {
      return returnException(PackListPalletCfNcfPfendingRollsResponse,error);
    }
  }

  // NEW 
  // FUNCTIONALITY
  @Post('/issueRollQuantity')
  async issueRollQuantity(@Body() req: RollIssueQtyRequest): Promise<GlobalResponseObject> {
    try {
      return await this.materialIssuanceService.issueRollQuantity(req, req.deAllocateFromPallet);
    } catch (error) {
      return returnException(PackListPalletCfNcfPfendingRollsResponse,error);
    }
  }
  

  // End Point to Unmap pallet from Bin
  @Post('/unmapPalletFromABin')
  async unmapPalletFromABin(@Body() req: PalletIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.palletBinMappingService.unmapPalletFromABin(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

  
  @Post('/getPalletAndBinbyRollIdData')
  async getPalletAndBinbyRollIdData(@Body() req: RollIdsRequest): Promise<PalletAndBinResponse> {
    try {
      return await this.palletInfoService.getPalletAndBinbyRollIdData(req);
    } catch (error) {
      return returnException(PalletAndBinResponse,error);
    }
  }

  
  @Post('/getLocationDetailsForRollIds')
  async getLocationDetailsForRollIds(@Body() req: RollIdsRequest): Promise<RollLocationsResponse> {
    try {
      return await this.locationAllocationService.getLocationDetailsForRollIds(req);
    } catch (error) {
      return returnException(RollLocationsResponse,error);
    }
  }

  @Post('/getPalletGroupInfo')
  async getPalletGroupInfo(@Body() req: PackListIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.pgCreationService.getPalletGroupInfo(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

}
