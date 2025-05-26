import { BinDetailsResponse, GlobalResponseObject, RollIdsRequest, TrayAndTrolleyResponse, TrayIdsRequest, TrayResponse, TrayRollMappingRequest, TrayTrolleyMappingRequest, TrolleyBinMappingRequest, TrollyIdsRequest, TrollyResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../common-axios-service';
import { AxiosRequestConfig } from 'axios';


export class TrayTrolleyService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/tray-trolley/' + childUrl;
    }

    // ------------------------- TRAY ROLL --------------------
    async getTrayInfoForRollIds(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrayInfoForRollIds'), reqModel, config);
    }

    async mapRollToTray(reqModel: TrayRollMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapRollToTray'), reqModel, config);
    }

    async unmapRollFromTray(reqModel: TrayRollMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unmapRollFromTray'), reqModel, config);
    }


    // --------------------- TRAY TROLLEY ---------------
    async mapTrayToTrolley(reqModel: TrayTrolleyMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapTrayToTrolley'), reqModel, config);
    }

    async unmapTrayFromTrolley(reqModel: TrayTrolleyMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unmapTrayFromTrolley'), reqModel, config);
    }

    async getTrolleyInfoForTrayIds(reqModel: TrayIdsRequest, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrolleyInfoForTrayIds'), reqModel, config);
    }


    // ------------------------------ TROLLEY BIN ---------------------------

    async mapTrolleyToBin(reqModel: TrolleyBinMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapTrolleyToBin'), reqModel, config);
    }

    async unmapTrolleyFromBin(reqModel: TrolleyBinMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unmapTrolleyFromBin'), reqModel, config);
    }

    async getBinInfoForTrolleyIds(reqModel: TrollyIdsRequest, config?: AxiosRequestConfig): Promise<BinDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinInfoForTrolleyIds'), reqModel, config);
    }

    async getTrayAndTrolleyInfoForRollIdData(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<TrayAndTrolleyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrayAndTrolleyInfoForRollIdData'), reqModel, config);
    }
}