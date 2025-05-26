import { PlantDefaultUOMResponse, UOMConversionRequest, UOMConversionResponse } from "@xpparel/shared-models";
import { WMSCommonAxiosService } from "../../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class UOMConversionService extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/UOMConversion/' + childUrl;
    }
  
    async getAllUOMConversion(req: UOMConversionRequest, config?: AxiosRequestConfig): Promise<UOMConversionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUOMConversion'), req, config);
    }
  
    async getPlantDefaultUOMForGivenItem(req: UOMConversionRequest, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlantDefaultUOMForGivenItem'), req, config);
    }
}