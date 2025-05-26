import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponseObject, PoProdutNameRequest, MaterialRequestNoRequest, CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableOpenDocketsResponse, CutTableDocketsResponse, CutTableIdRequest, MaterialRequestToWhRequest, PoDocketNumberRequest, LayIdRequest, LayIdConfirmationRequest, LayItemAddRequest, LayItemIdRequest, DocketLaysResponse, LayingPauseRequest, LayIdsRequest, AdResponse, PoDocketGroupRequest, LayerMeterageRequest, LayReportingCuttingResponse, CommonResponse, LayMeterageResponse, EndBitsResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { LayReportingInfoService } from './lay-reporting-info.service';
import { LayReportingService } from './lay-reporting.service';

@ApiTags('Lay Reporting')
@Controller('lay-reporting')
export class LayReportingController {
  constructor(
    private service: LayReportingService,
    private infoService: LayReportingInfoService
  ) {

  }

  @ApiBody({ type: PoDocketGroupRequest })
  @Post('/startLayingForDocket')
  async startLayingForDocket(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * validations:
       * if any record the the docket_lay with status <> 'COMPLETED' then throw an error : A lay is already initiated. You can add a new lay without completing it
       * if the docket_plies < sum(layed_plies) in docket_lay_item, throw an error: All docket plies are layed
       * insert the laying record. laying status default is INPROGRESS. plies is 0
        */
      return await this.service.startLayingForDocket(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: LayingPauseRequest })
  @Post('/pauseLayingForDocket')
  async pauseLayingForDocket(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * insert the record into the lay downtime everytime this API is called. updtae the reasonid and the reason later
       * if downtimeCompleted = false, for any of the records in the lay-downtime table then throw an error as downtime is already running
       * update the layingStatus to HOLD in the docket_lay
       */
      return await this.service.pauseLayingForDocket(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: LayIdRequest })
  @Post('/resumeLayingForDocket')
  async resumeLayingForDocket(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * when the downtime is resumed for a lay, the following has to happen
       * for the last lay-downtime record in lay-downtime table,
       *    if downtimeCompleted = true then throw an error as nothing to complete
       *    if no records in lay-downtime table throw an error  downtime is not logged
       * have to update the downtimeCompleted = true
       * also update the total minutes between downtimeStartDateTime - downtimeEndDateTime in the downTimeMins column
       * update the layingStatus to INPROGRESS in the docket_lay
       */
      return await this.service.resumeLayingForDocket(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: LayIdConfirmationRequest })
  @Post('/confirmLayingForLayId')
  async confirmLayingForLayId(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * if no records in the docket-lay-item, then throw error: Lay cannot be completed with 0 rolls
       * if any record with downtimeCompleted = false in lay-downtime table, then throw an error
       * update the staus of laying, layCompleteTime in docket_lay table to COMPLETED, 
       */
      return await this.service.confirmLayingForLayId(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: LayItemAddRequest })
  @Post('/addLayedRollsForLayId')
  async addLayedRollsForLayId(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * validations to ensure 
       *  1. incoming roll must be a part of the docket material (helper: getPoDocketMaterialRecordsByDocNumber)
       *  2. layid must not be layingStatus = completed
       *  3. other validaitons we can add later.
       * create a new records in the docket_lay_item
       */
      return await this.service.addLayedRollsForLayId(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }


  @ApiBody({ type: LayItemIdRequest })
  @Post('/removeLayedRollForLayId')
  async removeLayedRollForLayId(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      /**
       * validations to ensure 
       *  1. layid must not be layingStatus = completed
       * delete the records in the docket_lay_item for the roll id
       */
      return await this.service.removeLayedRollForLayId(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: PoDocketGroupRequest })
  @Post('/getLayInfoForDocketGroup')
  async getLayInfoForDocketGroup(@Body() req: any): Promise<DocketLaysResponse> {
    try {
      return await this.infoService.getLayInfoForDocketGroup(req);
    } catch (err) {
      return returnException(DocketLaysResponse, err);
    }
  }


  /**
   * READER
   * Gets the actual docket info, bundles and size wise info also if requested
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdsRequest })
  @Post('/getActualDocketInfo')
  async getActualDocketInfo(@Body() req: LayIdsRequest): Promise<AdResponse> {
    try {
      return await this.infoService.getActualDocketInfo(req, true);
    } catch (err) {
      console.log(err);
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * WRITER
   * Gets the actual docket info, bundles and size wise info also if requested
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdsRequest })
  @Post('/printBundleTagsForLay')
  async printBundleTagsForLay(@Body() req: LayIdsRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.printBundleTagsForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }


  /**
   * WRITER
   * Gets the actual docket info, bundles and size wise info also if requested
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdsRequest })
  @Post('/releaseBundleTagsPrintForLay')
  async releaseBundleTagsPrintForLay(@Body() req: LayIdsRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.releaseBundleTagsPrintForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @Post('/getTotalLayedMeterageToday')
  async getTotalLayedMeterageToday(@Body() req: LayerMeterageRequest): Promise<LayMeterageResponse> {

    try {
      return await this.infoService.getTotalLayedMeterageToday(req);

    } catch (err) {
      return returnException(LayMeterageResponse, err);
    }
  }

  @Post('/getTotalEndBitsToday')
  async getTotalEndBitsToday(@Body() req: LayerMeterageRequest): Promise<EndBitsResponse> {

    try {
      return await this.infoService.getTotalEndBitsToday(req);
    } catch (err) {
      return returnException(EndBitsResponse, err);
    }
  }

  @Post('/getKPICardDetailsForCutting')
  async getKPICardDetailsForCutting(@Body() req: LayerMeterageRequest): Promise<LayReportingCuttingResponse> {

    try {
      return await this.infoService.getKPICardDetailsForCutting(req);
    } catch (err) {
      return returnException(LayReportingCuttingResponse, err);
    }
  }


}
