import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../../common-axios-service";
import { CommonRequestAttrs, CommonResponse, SupplierActivateRequest, SupplierCreateRequest } from "@xpparel/shared-models";

export class SupplierServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
           return '/supplier/' + childUrl;
       }
   
       async createSupplier(reqModel: SupplierCreateRequest, config?: AxiosRequestConfig) {
           return await this.axiosPostCall(this.getURLwithMainEndPoint('createSupplier'), reqModel, config);
       }
   
       async ActivateDeactivateSuppliers(reqModel: SupplierActivateRequest , config?: AxiosRequestConfig) {
           return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateSuppliers'), reqModel, config);
       }
   
       async getAllSuppliersData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig) {
           return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSuppliersData'), reqModel, config);
       }
    }