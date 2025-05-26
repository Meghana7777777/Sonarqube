import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ForecastPlanningService } from "./forecast-planning.service";
import { ForecastPlanDto } from "./forecast-planning.dto";
import { ActualPlannedMinutesResponse, ForecastPlanYearDataResponse, ForecastPlanYearMonthResponse, ForecastPlanYearResponse, ForecastQtyUpdateRequest, ForecastYearDataRequest, ForecastYearMonthRequest, ForecastYearRequest, GlobalResponseObject, IModuleIdRequest, LocationDataByDateRequest } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('Forecast Planning')
@Controller('forecast-planning')
export class ForecastPlanningController {
    constructor(
        private forecastJobService: ForecastPlanningService,
    ) {

    }

    @Post('saveForecastPlan')
    @ApiBody({ type: ForecastPlanDto })
    async saveForecastPlan(@Body() req: any[]): Promise<GlobalResponseObject> {
        try {
            return await this.forecastJobService.saveForecastPlan(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('getForecastStatusByYearAndMonth')
    @ApiBody({ type: ForecastYearMonthRequest })
    async getForecastStatusByYearAndMonth(@Body() req: any): Promise<ForecastPlanYearMonthResponse> {
        try {
            return await this.forecastJobService.getForecastStatusByYearAndMonth(req);
        } catch (error) {
            return returnException(ForecastPlanYearMonthResponse, error);
        }
    }

    @Post('updateForecastQty')
    @ApiBody({ type: ForecastQtyUpdateRequest })
    async updateForecastQty(@Body() req: any[]): Promise<GlobalResponseObject> {
        try {
            return await this.forecastJobService.updateForecastQty(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('getForecastDatesByYear')
    @ApiBody({ type: ForecastYearRequest })
    async getForecastDatesByYear(@Body() req: any): Promise<ForecastPlanYearResponse> {
        try {
            return await this.forecastJobService.getForecastDatesByYear(req);
        } catch (error) {
            return returnException(ForecastPlanYearResponse, error);
        }
    }

    @Post('getForecastPlansByDate')
    @ApiBody({ type: ForecastYearDataRequest })
    async getForecastPlansByDate(@Body() req: any): Promise<ForecastPlanYearDataResponse> {
        try {
            return await this.forecastJobService.getForecastPlansByDate(req);
        } catch (error) {
            return returnException(ForecastPlanYearDataResponse, error);
        }
    }

    @Post('getForecastDataByLocationCode')
    @ApiBody({ type: LocationDataByDateRequest })
    async getForecastDataByLocationCode(@Body() req: any): Promise<ActualPlannedMinutesResponse> {
        try {
            return await this.forecastJobService.getForecastDataByLocationCode(req);
        } catch (error) {
            return returnException(ActualPlannedMinutesResponse, error);
        }
    }

}