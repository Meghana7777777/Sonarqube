import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, GlobalResponseObject, ItemCodeRequest, PoCreateRequest, PoItemProductModel, PoItemRefCompProductModel, PoProdTypeAndFabResponse, PoProdutNameRequest, PoRmResponse, PoRmUpdateRequest, PoSerialRequest, PoSummaryModel, PoSummaryResponse, RawOrderNoRequest, RefComponentInfoResponse } from '@xpparel/shared-models';


export class PoMaterialService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/po-material/' + childUrl;
    }

    async updatePoMaterialProps(reqModel: PoRmUpdateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePoMaterialProps'), reqModel, config);
    }

    async getPoMaterialInfo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoRmResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoMaterialInfo'), reqModel, config);
    }

    async getPoProdTypeAndFabrics(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoProdTypeAndFabResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProdTypeAndFabrics'), reqModel, config);
    }

    async getPoProdTypeAndFabricsForProductName(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<PoProdTypeAndFabResponse> {
        console.log(reqModel);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProdTypeAndFabricsForProductName'), reqModel, config);
    }

    async getPoProdTypeAndFabricsAndItsSizes(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoProdTypeAndFabResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProdTypeAndFabricsAndItsSizes'), reqModel, config);
    }

    async getRefComponentForPoAndFabric(reqModel: PoItemProductModel, config?: AxiosRequestConfig): Promise<RefComponentInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRefComponentForPoAndFabric'), reqModel, config);
    }

    async getAcComponentForPoFabricAndRefComp(reqModel: PoItemRefCompProductModel, config?: AxiosRequestConfig): Promise<RefComponentInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAcComponentForPoFabricAndRefComp'), reqModel, config);
    }

    async getRefComponentsForPoAndProduct(reqModel: PoItemRefCompProductModel, config?: AxiosRequestConfig): Promise<RefComponentInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRefComponentsForPoAndProduct'), reqModel, config);
    }
}



