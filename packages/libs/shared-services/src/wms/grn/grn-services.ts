import { GlobalResponseObject, GrnConfirmRequest, GrnUnLoadingRequest, GrnUnLoadingResponse, PackListIdRequest, PackListVehicleIdModel, PhBatchLotRollRequest,PackingListDeliveryDateResp, RollsGrnRequest, SecurityCheckRequest, SecurityCheckResponse, GrnVehiclesInThePlantResp, SystemPreferenceModel, SystemPreferenceResp, VehiclesResponse, GrnDetailsReportResponse, DateUnitCompanyRequest, GetUnloadingDataResp, CommonRequestAttrs, GrnDetailsForDashboardResponse, ADDVehicleReqModal } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../common-axios-service';
import { AxiosRequestConfig } from 'axios';

export class GrnServices extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/grn/' + childUrl;
    }

    async saveSecurityCheckIn(reqModel: ADDVehicleReqModal, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSecurityCheckIn'), reqModel, config);
    }

    async saveSecurityCheckOut(reqModel: SecurityCheckRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSecurityCheckOut'), reqModel, config);
    }

    async getSecurityCheckDetails(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<SecurityCheckResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSecurityCheckDetails'), reqModel, config);
    }

    async getGrnUnloadingDetails(reqModel: PackListVehicleIdModel, config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnUnloadingDetails'), reqModel, config);
    }

    async grnUnLoadingStartOrResumeUpdate(reqModel: GrnUnLoadingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('grnUnLoadingStartOrResumeUpdate'), reqModel, config);
    }

    async grnUnLoadingPauseUpdate(reqModel: GrnUnLoadingRequest, config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('grnUnLoadingPauseUpdate'), reqModel, config);
    }

    async grnUnLoadingCompleteUpdate(reqModel: GrnUnLoadingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('grnUnLoadingCompleteUpdate'), reqModel, config);
    }

    async saveRollLevelGRN(reqModel: RollsGrnRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveRollLevelGRN'), reqModel, config);
    }

    async confirmGrn(reqModel: GrnConfirmRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmGrn'), reqModel, config);
    }

    async saveSystemPreferences(reqModel: SystemPreferenceModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSystemPreferences'), reqModel, config);
    }

    async getSystemPreferences(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<SystemPreferenceResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSystemPreferences'), reqModel, config);
    }

    async getAvgVehicleUnloadingTime(config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAvgVehicleUnloadingTime'), config);
    }

    async getHowMuchTimeVehicleInThePlant(config?: AxiosRequestConfig): Promise<GrnVehiclesInThePlantResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getHowMuchTimeVehicleInThePlant'), config);
    }

    async getHowManyVechicleCurrentlyUnloading(config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getHowManyVechicleCurrentlyUnloading'), config);
    }

    async getNoOfVehiclesArrived(config?: AxiosRequestConfig): Promise<GrnVehiclesInThePlantResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfVehiclesArrived'), config);
    }

    async getNoOfVehiclesUnloadingInprogress(config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfVehiclesUnloadingInprogress'), config);
    }

    async getNoOfVehiclesToBeArrived(config?: AxiosRequestConfig): Promise<PackingListDeliveryDateResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfVehiclesToBeArrived '), config);
    }

    async getNoOfVehiclesWaitingForUnloading(config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfVehiclesWaitingForUnloading'), config);
    }

    async getNoOfvehiclesCompletedUnloading(config?: AxiosRequestConfig): Promise<GrnUnLoadingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfvehiclesCompletedUnloading'), config);
    }

    async getNoOfVehiclesInPlant(config?: AxiosRequestConfig): Promise<VehiclesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getNoOfVehiclesInPlant'), config);
    }

    async getUnloadingCompletedNotAtSecurityCheckOutVehicles(config?: AxiosRequestConfig): Promise<VehiclesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnloadingCompletedNotAtSecurityCheckOutVehicles'), config);
    }


    async getGrnDetailsReports(config?: AxiosRequestConfig): Promise<GrnDetailsReportResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnDetailsReports'), config);
    }

    async getVehicleUnloadingDetailsForGivenDate(reqModel: DateUnitCompanyRequest, config?: AxiosRequestConfig): Promise<GetUnloadingDataResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getVehicleUnloadingDetailsForGivenDate'), reqModel, config);
    }
    // async getGrnDetailsReports(config?: AxiosRequestConfig): Promise<GrnDetailsReportResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnDetailsReports'), config);
    // }
}