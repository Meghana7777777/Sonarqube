import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PackingListDashboardService } from "./packing-list-dashboard-service";
import { GlobalResponseObject, StagesRequest, StagesResoponse, TimeBasedCountResponse, UnitDatetimeRequest } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('Packing List Dashboards')
@Controller('packing-list-dashboards')
export class PackingListDashboardController {
  constructor(
    private readonly packingListDashboard: PackingListDashboardService,
    ) { }

  @Post('getSupplierWisePaclingLists')
  async getSupplierWisePaclingLists(@Body() reqModel: UnitDatetimeRequest): Promise<GlobalResponseObject> {
    try {
      return await this.packingListDashboard.getSupplierWisePaclingLists(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @Post('getStagesForPackingList')
  async getStagesForPackingList(@Body() reqModel: StagesRequest): Promise<StagesResoponse> {
    try {
      return await this.packingListDashboard.getStagesForPackingList(reqModel);
    } catch (error) {
      return returnException(StagesResoponse, error)
    }
  }

  @Post('getChartData')
  async getChartData(@Body() reqModel: UnitDatetimeRequest): Promise<TimeBasedCountResponse> {
    try {
      return await this.packingListDashboard.getChartData(reqModel);
    } catch (error) {
      return returnException(TimeBasedCountResponse, error)
    }
  }

}