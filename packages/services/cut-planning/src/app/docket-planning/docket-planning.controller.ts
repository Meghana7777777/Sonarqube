import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponseObject, PoProdutNameRequest, MaterialRequestNoRequest, CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableOpenDocketsResponse, CutTableDocketsResponse, CutTableIdRequest, MaterialRequestToWhRequest, CutTableOpenCloseDocketsCountResponse, DocketGroupResponseModel, MaterialAllocatedDocketsResponse, PlannedDocketInfoResponse, DateRangeRequestForPlannedDocket, PlannedDocketReportResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { DocketPlanningInfoService } from './docket-planning-info.service';
import { DocketPlanningService } from './docket-planning.service';

@ApiTags('Docket Planning')
@Controller('docket-planning')
export class DocketPlanningController {
  constructor(
    private service: DocketPlanningService,
    private infoService: DocketPlanningInfoService
  ) {

  }

  @ApiBody({ type: MaterialRequestNoRequest })
  @Post('/saveDocketsToDocPlan')
  async saveDocketsToDocPlan(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.saveDocketsToDocPlan(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: CutTableDocketPlanRequest })
  @Post('/planDocketRequestsToCutTable')
  async planDocketRequestsToCutTable(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.planDocketRequestsToCutTable(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: CutTableDocketUnPlanRequest })
  @Post('/unPlanDocketRequestsFromCutTable')
  async unPlanDocketRequestsFromCutTable(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.unPlanDocketRequestsFromCutTable(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: CutTableDocketPlanRequest })
  @Post('/swapDocketRequestsToDiffCutTable')
  async swapDocketRequestsToDiffCutTable(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.swapDocketRequestsToDiffCutTable(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: PoProdutNameRequest })
  @Post('/swapDocketRequestsPriority')
  async swapDocketRequestsPriority(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.swapDocketRequestsPriority(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: CutTableIdRequest })
  @Post('/getPlannedDocketRequestsOfCutTable')
  async getPlannedDocketRequestsOfCutTable(@Body() req: any): Promise<CutTableDocketsResponse> {
    try {
      return await this.infoService.getPlannedDocketRequestsOfCutTable(req);
    } catch (err) {
      console.log(err);
      return returnException(CutTableDocketsResponse, err);
    }
  }

  @ApiBody({ type: PoProdutNameRequest })
  @Post('/getYetToPlanDocketRequests')
  async getYetToPlanDocketRequests(@Body() req: any): Promise<CutTableOpenDocketsResponse> {
    try {
      return await this.infoService.getYetToPlanDocketRequests(req);
    } catch (err) {
      console.log(err);
      return returnException(CutTableOpenDocketsResponse, err);
    }
  }

  @ApiBody({ type: MaterialRequestToWhRequest })
  @Post('/requestFabricForDocketRequest')
  async requestFabricForDocketRequest(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.requestFabricForDocketRequest(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: MaterialRequestToWhRequest })
  @Post('/unRequestFabricForDocketRequest')
  async unRequestFabricForDocketRequest(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.service.unRequestFabricForDocketRequest(req);
    } catch (err) {
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: CutTableIdRequest })
  @Post('/getActiveInactiveDocketsForCutTable')
  async getActiveInactiveDocketsForCutTable(@Body() req: any): Promise<CutTableOpenCloseDocketsCountResponse> {
    try {
      return await this.infoService.getActiveInactiveDocketsForCutTable(req);
    } catch (err) {
      return returnException(CutTableOpenCloseDocketsCountResponse, err);
    }
  }

  
  @ApiBody({ type: DocketGroupResponseModel })
  @Post('/getTotalDocketsPlannedToday')
  async getTotalDocketsPlannedToday(@Body() req: DocketGroupResponseModel): Promise<PlannedDocketInfoResponse> {
    try {
      return await this.infoService.getTotalDocketsPlannedToday(req);
    } catch (err) {
      return returnException(PlannedDocketInfoResponse, err);
    }
  }

  @ApiBody({ type: DateRangeRequestForPlannedDocket })
  @Post('/getPlannedDocketReport')
  async getPlannedDocketReport(@Body() req: DateRangeRequestForPlannedDocket): Promise<PlannedDocketReportResponse> {
    try {
      return await this.infoService.getPlannedDocketReport(req);
    } catch (err) {
      return returnException(PlannedDocketReportResponse, err);
    }
  }
}
