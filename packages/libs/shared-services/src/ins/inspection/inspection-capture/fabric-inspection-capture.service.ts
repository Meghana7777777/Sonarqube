import { GlobalResponseObject, InsBasicInspectionRequest, InsLabInspectionRequest, InsRelaxationInspectionRequest, InsShadeInspectionRequest, InsShrinkageInspectionRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class FabricInspectionCaptureService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fabric-inspection-capture/' + childUrl;
    }

    async captureInspectionResultsForBasicInspection(req: InsBasicInspectionRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForBasicInspection'), req, config)
    }

    async captureInspectionResultsForLabInspection(req: InsLabInspectionRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForLabInspection'), req, config)
    }

    async captureInspectionResultsForLabRelaxation(req: InsRelaxationInspectionRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForLabRelaxation'), req, config)
    }

    async captureInspectionResultsForLabShade(req: InsShadeInspectionRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForLabShade'), req, config)
    }

    async captureInspectionResultsForLabShrinkage(req: InsShrinkageInspectionRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForLabShrinkage'), req, config)
    } 
}