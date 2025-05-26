import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponseObject, PoProdutNameRequest, MaterialRequestNoRequest, CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableOpenDocketsResponse, CutTableDocketsResponse, CutTableIdRequest, MaterialRequestToWhRequest, LayIdRequest, CutReportRequest, DbCutReportRequest, PoSerialRequest, CutInventoryResponse, PoDocketNumberRequest, DocketLayingTimesResponse, LayIdsRequest, AdResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { CutReportingInfoService } from './cut-reporting-info.service';
import { CutReportingService } from './cut-reporting.service';

@ApiTags('Cut Reporting')
@Controller('cut-reporting')
export class CutReportingController {
  constructor(
    private service: CutReportingService,
    private infoService: CutReportingInfoService
  ) {

  }

  /**
   * validates the cut reporting and triggers a new job for the cut reporting
   * @param req 
   * @returns 
   */
  @ApiBody({ type: CutReportRequest })
  @Post('/validateAndTriggerReportCutForLay')
  async validateAndTriggerReportCutForLay(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.validateAndTriggerReportCutForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * gets all the docket bundles and trigger an individual job for every docket bundle
   * @param req 
   * @returns 
   */
  @ApiBody({ type: CutReportRequest })
  @Post('/processCutReportingForLay')
  async processCutReportingForLay(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.processCutReportingForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * creates the ADB for the docket bundle based on the no:of rolls in the lay and also updated the doc bundle table
   * @param req 
   * @returns 
   */
  @ApiBody({ type: DbCutReportRequest })
  @Post('/processCutReportingForDocBundle')
  async processCutReportingForDocBundle(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.processCutReportingForDocBundle(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * validates and triggers the cut reporting for the lay
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdRequest })
  @Post('/validateAndTriggerReverseCutForLay')
  async validateAndTriggerReverseCutForLay(req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.validateAndTriggerReverseCutForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * gets all the docket bundles and trigger an individual job for every docket bundle
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdRequest })
  @Post('/processCutReversalForLay')
  async processCutReversalForLay(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.processCutReversalForLay(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * gets all the docket bundles and trigger an individual job for every docket bundle
   * @param req 
   * @returns 
   */
  @ApiBody({ type: PoDocketNumberRequest })
  @Post('/getLayAndCutStatusForDocket')
  async getLayAndCutStatusForDocket(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.infoService.getLayAndCutStatusForDocket(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  /**
   * gets the cut inventory for the po
   * @param req 
   * @returns 
   */
  @ApiBody({ type: PoSerialRequest })
  @Post('/getCutInventoryForPo')
  async getCutInventoryForPo(@Body() req: any): Promise<CutInventoryResponse> {
    try {
      return await this.infoService.getCutInventoryForPo(req);
    } catch (err) {
      return returnException(CutInventoryResponse, err);
    }
  }


  /**
   * gets the laying downtimes for the docket
   * @param req 
   * @returns 
   */
  @ApiBody({ type: PoDocketNumberRequest })
  @Post('/getTotalLayingTimeForDocket')
  async getTotalLayingTimeForDocket(@Body() req: any): Promise<DocketLayingTimesResponse> {
    try {
      return await this.infoService.getTotalLayingTimeForDocket(req);
    } catch (err) {
      return returnException(DocketLayingTimesResponse, err);
    }
  }

  /**
   * gets the laying downtimes for all the dockets in the PO
   * @param req 
   * @returns 
   */
  @ApiBody({ type: PoSerialRequest })
  @Post('/getTotalLayingTimeForPo')
  async getTotalLayingTimeForPo(@Body() req: any): Promise<DocketLayingTimesResponse> {
    try {
      return await this.infoService.getTotalLayingTimeForPo(req);
    } catch (err) {
      return returnException(DocketLayingTimesResponse, err);
    }
  }

  /**
   * updates the consumed stock to the external systems. This is called from the 
   * @param req 
   * @returns 
   */
  @ApiBody({ type: LayIdRequest })
  @Post('/updateTheConsumedStockToExternalSystem')
  async updateTheConsumedStockToExternalSystem(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.updateTheConsumedStockToExternalSystem(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }


}
