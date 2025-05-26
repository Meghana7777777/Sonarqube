import { CutTableDocketPlanRequest, CutTableDocketUnPlanRequest, CutTableDocketsResponse, CutTableIdRequest, CutTableOpenCloseDocketsCountResponse, CutTableOpenDocketsResponse, DateRangeRequestForPlannedDocket, DocMaterialAllocationRequest, GlobalResponseObject, MaterialRequestNoRequest, MaterialRequestToWhRequest, PlannedDocketReportResponse, PoProdutNameRequest, ValidatorResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class DocketPlanningServices extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/docket-planning/' + childUrl;
    }
    
    async saveDocketsToDocPlan(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveDocketsToDocPlan'), reqModel, config);
    }

    async planDocketRequestsToCutTable(reqModel: CutTableDocketPlanRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('planDocketRequestsToCutTable'), reqModel, config);
    }

    async unPlanDocketRequestsFromCutTable(reqModel: CutTableDocketUnPlanRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unPlanDocketRequestsFromCutTable'), reqModel, config);
    }

    async swapDocketRequestsToDiffCutTable(reqModel: CutTableDocketUnPlanRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('swapDocketRequestsToDiffCutTable'), reqModel, config);
    }

    async swapDocketRequestsPriority(reqModel: CutTableDocketUnPlanRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('swapDocketRequestsPriority'), reqModel, config);
    }

    async getPlannedDocketRequestsOfCutTable(reqModel: CutTableIdRequest, config?: AxiosRequestConfig): Promise<CutTableDocketsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedDocketRequestsOfCutTable'), reqModel, config);
    }

    async getYetToPlanDocketRequests(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<CutTableOpenDocketsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getYetToPlanDocketRequests'), reqModel, config);
    }

    async requestFabricForDocketRequest(reqModel: MaterialRequestToWhRequest, config?: AxiosRequestConfig): Promise<CutTableOpenDocketsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('requestFabricForDocketRequest'), reqModel, config);
    }

    
    async getActiveInactiveDocketsForCutTable(reqModel: CutTableIdRequest, config?: AxiosRequestConfig): Promise<CutTableOpenCloseDocketsCountResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getActiveInactiveDocketsForCutTable'), reqModel, config);
    }

    async getPlannedDocketReport(reqModel: DateRangeRequestForPlannedDocket, config?: AxiosRequestConfig): Promise<PlannedDocketReportResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedDocketReport'), reqModel, config);
    }
}