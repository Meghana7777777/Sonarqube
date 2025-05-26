import { Controller, Post, Body, } from '@nestjs/common';
import { GrnService } from './grn.service';
import { ApiTags } from '@nestjs/swagger';
import { PhBatchLotRollRequest, GrnUnLoadingRequest, RollsGrnRequest, GrnConfirmRequest, GlobalResponseObject, SecurityCheckRequest, PackListIdRequest, SecurityCheckResponse, PackListVehicleIdModel, GrnUnLoadingResponse, SystemPreferenceModel, SystemPreferenceResp, GrnVehiclesInThePlantResp, PackingListDeliveryDateResp, VehiclesResponse, GrnDetailsReportResponse, GetUnloadingDataResp, DateUnitCompanyRequest, CommonRequestAttrs, GrnDetailsForDashboardResponse, ADDVehicleReqModal } from '@xpparel/shared-models';
import { ReturnDocument } from 'typeorm';
import { CommonResponse, returnException } from '@xpparel/backend-utils';


@ApiTags('GRN Module')
@Controller('grn')
export class GrnController {
  constructor(private readonly grnService: GrnService,

  ) { }





  @Post('saveRollLevelGRN')
  async saveRollLevelGRN(@Body() reqModel: RollsGrnRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.saveRollLevelGRN(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('confirmGrn')
  async confirmGrn(@Body() reqModel: GrnConfirmRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.confirmGrn(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('saveSecurityCheckIn')
  async saveSecurityCheckIn(@Body() reqModel: ADDVehicleReqModal): Promise<CommonResponse> {
    try {
      return await this.grnService.saveSecurityCheckIn(reqModel);
    } catch (error) {
      return returnException(CommonResponse, error)
    }
  }

  @Post('saveSecurityCheckOut')
  async saveSecurityCheckInOut(@Body() reqModel: SecurityCheckRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.saveSecurityCheckOut(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('/saveSystemPreferences')
  async saveSystemPreferences(@Body() reqModel: SystemPreferenceModel): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.saveSystemPreferences(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('/getSystemPreferences')
  async getSystemPreferences(@Body() reqModel: PackListIdRequest): Promise<SystemPreferenceResp> {
    try {
      return await this.grnService.getSystemPreferenceForPackListId(reqModel.packListId, reqModel.unitCode, reqModel.companyCode, reqModel.username, reqModel.userId);
    } catch (error) {
      return returnException(SystemPreferenceResp, error)
    }
  }

  @Post('grnUnLoadingStartOrResumeUpdate')
  async grnUnLoadingStartOrResumeUpdate(@Body() reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.updateGrnUnLoadingStartOrResume(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('grnUnLoadingPauseUpdate')
  async grnUnLoadingPauseUpdate(@Body() reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.updateGrnUnLoadingPause(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('grnUnLoadingCompleteUpdate')
  async grnUnLoadingCompleteUpdate(@Body() reqModel: GrnUnLoadingRequest): Promise<GlobalResponseObject> {
    try {
      return await this.grnService.grnUnLoadingCompleteUpdate(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }



  @Post('/getGrnUnloadingDetails')
  async getGrnUnloadingDetails(@Body() reqObj: PackListVehicleIdModel): Promise<GrnUnLoadingResponse> {
    try {
      return await this.grnService.getGrnUnloadingDetails(reqObj);
    } catch (error) {
      return returnException(GrnUnLoadingResponse, error)
    }
  }
}
