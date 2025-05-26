import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";
import { CartonDataResponse, CartonFillingResponse, CartonScanReqNoDto, CommonIdReqModal, CommonRequestAttrs, CommonResponse, ExtFgBarCodeReqDto, PackingListIdRequest, PackJobsResponse, PackListResponseModel, PLAndPackJobBarCodeRequest, PoIdRequest, PONoRequest, ScanToPackRequest, UpcBarCodeReqDto } from "@xpparel/shared-models";

export class PackListViewServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pack-list/' + childUrl;
    }

    async getPackListsForPo(req: PONoRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListsForPo'), req, config);
    }

    async getPackingListDataById(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<PackListResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackingListDataById'), req, config);
    }

    async getPackJobsForPackListId(req: PackingListIdRequest, config?: AxiosRequestConfig): Promise<PackJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackJobsForPackListId'), req, config);
    }

    async printBarcodesForPackListId(req: PLAndPackJobBarCodeRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('printBarcodesForPackListId'), req, config)
    }

    async releaseBarcodesPrintForPackListId(req: PLAndPackJobBarCodeRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseBarcodesPrintForPackListId'), req, config)
    }

    async printBarcodesForPackJob(req: PLAndPackJobBarCodeRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('printBarcodesForPackJob'), req, config)
    }

    async releaseBarcodesPrintForPackJob(req: PLAndPackJobBarCodeRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseBarcodesPrintForPackJob'), req, config)
    }

    async getFgCartonFillingData(req: CartonScanReqNoDto, config?: AxiosRequestConfig): Promise<CartonFillingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgCartonFillingData'), req, config)
    }

    async cartonsFillingInCartonsLevel(req: CartonScanReqNoDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('cartonsFillingInCartonsLevel'), req, config)
    }

    async getCartonDataForInspection(req: PoIdRequest, config?: AxiosRequestConfig): Promise<CartonDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonDataForInspection'), req, config)
    }

    async scanGarmentBarcode(req: UpcBarCodeReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('scanGarmentBarcode'), req, config)
    }

    async scanExtGarmentBarcode(req: ExtFgBarCodeReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('scanExtGarmentBarcode'), req, config)
    }

    async getPackListByPoId(req: PoIdRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListByPoId'), req, config)
    }


}