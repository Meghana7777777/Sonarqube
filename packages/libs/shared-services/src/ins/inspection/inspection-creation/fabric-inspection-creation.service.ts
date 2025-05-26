import { GlobalResponseObject, InsBatchNosRequest, InsFabInsCreateExtRefRequest, InsIrActivityChangeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class FabricInspectionCreationService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fabric-inspection-creation/' + childUrl; 
    } 

    async createFabricInspectionRequest(req?: InsFabInsCreateExtRefRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createFabricInspectionRequest'), req, config)
    }

    async deleteFabricInspectionRequest(req?: InsBatchNosRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteFabricInspectionRequest'), req, config)
    }

    async updateInspectionActivityStatus(req?: InsIrActivityChangeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateInspectionActivityStatus'), req, config)
    }


}