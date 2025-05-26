import { AttributesMasterCreateReq, AttributesMasterResponse, CommonIdReqModal, CommonRequestAttrs, CommonResponse, ConfigGcIdModelDto, ConfigMasterModelIdDto, ConfigMasterResponse, DepartmentCreateModel, GbDepartmentReqDto, GbGetAllDepartmentsResponseModal, GbGetAllLocationsResponseModal, GbGetAllSectionsResponseModal, GBLocationRequest, GbSectionReqDto, GBSectionRequest, GetAttributesByGcIdResponseDto, LocationCreateRequest, LocationResponse, LocationsIdRequest, MasterModelDto, MasterResponse, SectionsCreateRequest, SectionsIdRequest, SectionsResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class GbConfigHelperService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/global-config-helper/' + childUrl;
    }



    async getAllDepartmentsFromGbC(reqModel: GbDepartmentReqDto, config?: AxiosRequestConfig): Promise<GbGetAllDepartmentsResponseModal> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllDepartmentsFromGbC'), reqModel, config);
    }

    async getAllSectionsByDepartmentsFromGbC(reqModel: GBSectionRequest, config?: AxiosRequestConfig): Promise<GbGetAllSectionsResponseModal> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSectionsByDepartmentsFromGbC'), reqModel, config);
         }

    async getAllLocationsByDeptAndSectionsFromGbC(reqModel: GBLocationRequest, config?: AxiosRequestConfig): Promise<GbGetAllLocationsResponseModal> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllLocationsByDeptAndSectionsFromGbC'), reqModel, config);
    }


    // getAllSections -> unit + department

    // getAllLocations -> unit -> depart + section

    async createDepartment(req:DepartmentCreateModel,config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createDepartment'), req,config);
    }

    async GetAllDepartments( req: CommonRequestAttrs , config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('GetAllDepartments'),req, config);
    }

    async deleteDepartment(req: DepartmentCreateModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteDepartment'), req, config);
    }
    async toggleDepartment(req: DepartmentCreateModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleDepartment'), req, config);
    }

     //section

    
     async createSection(reqModel: SectionsCreateRequest, config?: AxiosRequestConfig): Promise<SectionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSection'), reqModel, config);
    }
    async deleteSection(reqModel: SectionsIdRequest, config?: AxiosRequestConfig): Promise<SectionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSection'), reqModel, config);
    }
    async getSection(reqModel?: SectionsIdRequest, config?: AxiosRequestConfig): Promise<SectionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSection'), reqModel, config);
    }
    
    async activeDeactiveSection(reqModel:SectionsIdRequest, config?: AxiosRequestConfig): Promise<SectionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activeDeactiveSection'), reqModel, config);
    }

    async getAllSections(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SectionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('/getAllSections'), reqModel, config);
    }

    //location

    async createLocation(reqModel: LocationCreateRequest, config?: AxiosRequestConfig): Promise<LocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createLocation'), reqModel, config);
    }
    async deleteLocation(reqModel: LocationsIdRequest, config?: AxiosRequestConfig): Promise<LocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteLocation'), reqModel, config);
    }
    async getLocation(reqModel?: LocationsIdRequest, config?: AxiosRequestConfig): Promise<LocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocation'), reqModel, config);
    }
   
    async activateDeactivateLocation(reqModel:LocationsIdRequest,config?:AxiosRequestConfig): Promise<LocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateLocation'), reqModel, config);

    }

    async getUniqueDepartmentTypesByUnitCode(reqModel:GBSectionRequest,config?:AxiosRequestConfig): Promise<LocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUniqueDepartmentTypesByUnitCode'), reqModel, config);

    }




}
