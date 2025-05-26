import { CommonRequestAttrs, CustomerCreateRequest, CustomerDropDownResponse, CustomerIdRequest, CustomerModel, CustomerResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OMSCommonAxiosService } from "../oms-common-axios-service";

export class CustomerSharedService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/customer/' + childUrl;
    }

    async createCustomer(reqModel: CustomerCreateRequest, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCustomer'), reqModel, config);
    }

    async deleteCustomer(reqModel: CustomerIdRequest, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCustomer'), reqModel, config);
    }

    async getAllCustomers(reqModel: CustomerIdRequest, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllCustomers'), reqModel, config);
    }

    async activateDeactivateCustomer(reqModel?: CustomerIdRequest, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateCustomer'), reqModel, config);
    }

    async customerUpdateImage(reqModel?: FormData, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('customerUpdateImage'), reqModel, config);
    }

    async getCustomerByCustomerCode(reqModel: CustomerIdRequest, config?: AxiosRequestConfig): Promise<CustomerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCustomerByCustomerCode'), reqModel, config);
    } 

    async getAllCustomersForDropDown(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CustomerDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllCustomersForDropDown'), reqModel, config);
    }

}
