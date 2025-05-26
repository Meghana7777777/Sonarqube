import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, InsBasicInspectionRequest, InsDateGroupUnitRequest, InsDateUnitRequest, InsGetInspectionHeaderRollInfoResp, InsInsActPlanModelResp, InsInspectionBasicInfoResponse, InsInspectionCreateRequest, InsInspectionRequestsFilterRequest, InsInspectionTypeRequest, InsIrActivityChangeRequest, InsIrIdRequest, InsIrMaterialConfirmationRequest, InsIrRollIdsRequest, InsIrRollsResponse, InsLabInspectionRequest, InsLotNumberInspectionCategoryRequest, InsRelaxationInspectionRequest, InsRollBarcodeInspCategoryReq, InsShadeInspectionRequest, InsShrinkageInspectionRequest, PackingListInfoResponse, InsPackListWiseInspInfoHeaderResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { assignAndGetLoaingReqStatusForHeaders } from "../../loading-helper";
import { INSCommonAxiosService } from "../common-axios-service";

export class InsService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/ins-inspection/' + childUrl;
    }

    async getInspectionRequestRollsInfo(req: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsIrRollsResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestRollsInfo'), req, modifiedConfig)
    }

    // KEPT ASIDE FOR NOW
    async confirmMaterialReceivedForIr(req: InsIrMaterialConfirmationRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('confirmMaterialReceivedForIr'), req, config)
    }

    // KEPT ASIDE FOR NOW
    async confirmStartInspection(req: InsIrMaterialConfirmationRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('confirmStartInspection'), req, config)
    }

    // KEPT ASIDE FOR NOW
    async inspectionConfirm(req: InsInspectionCreateRequest[], dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('inspectionConfirm'), req, config)
    }

    async getInspectionDetailsForRequestIdReport(req: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsGetInspectionHeaderRollInfoResp> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailsForRequestIdReport'), req, modifiedConfig)
    }

    async getEligibleRollInfoForInspectionTypeForLot(req: InsLotNumberInspectionCategoryRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<PackingListInfoResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getEligibleRollInfoForInspectionTypeForLot'), req, modifiedConfig)
    }

    async mapRollIdsToInspectionRequest(req: InsIrRollIdsRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<PackingListInfoResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('mapRollIdsToInspectionRequest'), req, modifiedConfig)
    }

    async getKPICardDetailsForInspection(req?: CommonRequestAttrs, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getKPICardDetailsForInspection'), req, modifiedConfig) 
    }
    
    async getInfoForInspectionAnalysisDashboard(req: InsDateUnitRequest, dontNeedLoadingSymbol?: boolean,  config?: AxiosRequestConfig): Promise<InsPackListWiseInspInfoHeaderResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInfoForInspectionAnalysisDashboard'), req, modifiedConfig)
    }

    async getInspectionActualAndPlanData(req: InsDateGroupUnitRequest, dontNeedLoadingSymbol?: boolean,  config?: AxiosRequestConfig): Promise<InsInsActPlanModelResp> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionActualAndPlanData'), req, modifiedConfig)
    }
}