import { ActualPlannedMinutesResponse, ForecastPlanModel, ForecastPlanYearDataResponse, ForecastPlanYearMonthResponse, ForecastPlanYearResponse, ForecastQtyUpdateRequest, ForecastYearDataRequest, ForecastYearMonthRequest, ForecastYearRequest, GlobalResponseObject, IModuleIdRequest, LocationDataByDateRequest, P_LocationCodeRequest } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "./sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class ForecastPlanningService extends SPSCommonAxiosService{

    private getURLwithMainEndPoint(childUrl: string) {
        return '/forecast-planning/' + childUrl;
    }

    async saveForecastPlan(req: ForecastPlanModel[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveForecastPlan'),req, config);
    }

    async getForecastStatusByYearAndMonth(req: ForecastYearMonthRequest, config?: AxiosRequestConfig): Promise<ForecastPlanYearMonthResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getForecastStatusByYearAndMonth'),req, config);
    }

    async updateForecastQty(req: ForecastQtyUpdateRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateForecastQty'),req, config);
    }

    async getForecastDatesByYear(req: ForecastYearRequest, config?: AxiosRequestConfig): Promise<ForecastPlanYearResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getForecastDatesByYear'),req, config);
    }

    async getForecastPlansByDate(req: ForecastYearDataRequest, config?: AxiosRequestConfig): Promise<ForecastPlanYearDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getForecastPlansByDate'),req, config);
    }

    async getForecastDataByLocationCode(req: LocationDataByDateRequest, config?: AxiosRequestConfig): Promise<ActualPlannedMinutesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getForecastDataByLocationCode'),req, config);
    }
    
}