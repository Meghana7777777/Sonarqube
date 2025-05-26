import { LocationDetailsResponse, LocationIdRequest, LocationContainerMappingRequest, CommonRequestAttrs, GlobalResponseObject, InspectionContainerCartonsResponse, PackListIdRequest, PackListContainerCfNcfPfendingCartonsResponse, ContainerAndLocationResponse, ContainerDetailsResponse, ContainerIdRequest, ContainerCartonMappingRequest, ContainerCartonsResponse, PgIdRequest, PgCartonsResponse, RackLocationContainersResponse, CartonIdsRequest, CartonIssueQtyRequest, CartonContainerMappingValidationResponse, WarehouseContainerCartonsResponse, FgContainerFilterRequest, CartonBarCodesReqDto } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../pkms-common-axios-service';

export class FGLocationAllocationService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/location-allocation/' + childUrl;
    }

    async validateConfirmCartonsToContainer(reqModel: ContainerCartonMappingRequest, config?: AxiosRequestConfig): Promise<CartonContainerMappingValidationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateConfirmCartonsToContainer'), reqModel, config);
    }

    async confirmCartonsToContainer(reqModel: ContainerCartonMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmCartonsToContainer'), reqModel, config);
    }

    async allocateCartonsToContainer(reqModel: ContainerCartonMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateCartonsToContainer'), reqModel, config);
    }

    async getContainerMappingInfoWithoutCartons(reqModel: ContainerIdRequest, config?: AxiosRequestConfig): Promise<ContainerDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getContainerMappingInfoWithoutCartons'), reqModel, config);
    }

    async getContainersMappedForPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<ContainerDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getContainersMappedForPackingList'), reqModel, config);
    }

    async getInspectionContainerMappingInfoWithCartons(reqModel: ContainerIdRequest, config?: AxiosRequestConfig): Promise<InspectionContainerCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionContainerMappingInfoWithCartons'), reqModel, config);
    }

    async getWarehouseContainerMappingInfoWithCartons(reqModel: ContainerIdRequest, config?: AxiosRequestConfig): Promise<WarehouseContainerCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehouseContainerMappingInfoWithCartons'), reqModel, config);
    }

    async allocateContainersToLocation(reqModel: LocationContainerMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateContainersToLocation'), reqModel, config);
    }

    async confirmContainersToLocation(reqModel: LocationContainerMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmContainersToLocation'), reqModel, config);
    }

    async allocatePakcListContainersToLocation(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocatePakcListContainersToLocation'), reqModel, config);
    }

    async getLocationInfoWithoutContainers(reqModel: LocationIdRequest, config?: AxiosRequestConfig): Promise<LocationDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationInfoWithoutContainers'), reqModel, config);
    }

    async getLocationsMappedForPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<LocationDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationsMappedForPackingList'), reqModel, config);
    }

    async getLocationContainersWithCartons(reqModel: LocationIdRequest, config?: AxiosRequestConfig): Promise<RackLocationContainersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationContainersWithCartons'), reqModel, config);
    }

    async getLocationContainersWithoutCartons(reqModel: LocationIdRequest, config?: AxiosRequestConfig): Promise<RackLocationContainersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationContainersWithoutCartons'), reqModel, config);
    }

    async getPgIdsForPackListId(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PgCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPgIdsForPackListId'), reqModel, config);
    }

    async getInspectionCartonsForPgId(reqModel: PgIdRequest, config?: AxiosRequestConfig): Promise<PgCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionCartonsForPgId'), reqModel, config);
    }

    async getWarehouseCartonsForForPgId(reqModel: PgIdRequest, config?: AxiosRequestConfig): Promise<PgCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehouseCartonsForForPgId'), reqModel, config);
    }

    async createContainerGroupsForPackList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createContainerGroupsForPackList'), reqModel, config);
    }

    async getAllSpaceFreeContainersInWarehouse(reqModel: FgContainerFilterRequest, config?: AxiosRequestConfig): Promise<ContainerDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSpaceFreeContainersInWarehouse'), reqModel, config);
    }


    async getAllPendingToContainerConfirmationCartonsInPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPendingToContainerConfirmationCartonsInPackingList'), reqModel, config);
    }

    async getAllContainerConfirmationCartonsInPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PackListContainerCfNcfPfendingCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllContainerConfirmationCartonsInPackingList'), reqModel, config);
    }

    async getAllSpaceFreeLocationsInWarehouse(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<LocationDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSpaceFreeLocationsInWarehouse'), reqModel, config);
    }

    // NEW 12-11-2023
    async getContainerMappingInfoWithCartons(reqModel: ContainerIdRequest, config?: AxiosRequestConfig): Promise<ContainerCartonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getContainerMappingInfoWithCartons'), reqModel, config);
    }

    // NEW 12-11-2023
    async deAllocateCartonsToContainer(reqModel: ContainerCartonMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deAllocateCartonsToContainer'), reqModel, config);
    }

    // NEW 12-11-2023
    async issueCartonQuantity(reqModel: CartonIssueQtyRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueCartonQuantity'), reqModel, config);
    }

    // NEW 12-11-2023
    async unmapContainerFromALocation(reqModel: ContainerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unmapContainerFromALocation'), reqModel, config);
    }

    async getContainerAndLocationByCartonIdData(reqModel: CartonIdsRequest, config?: AxiosRequestConfig): Promise<ContainerAndLocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getContainerAndLocationByCartonIdData'), reqModel, config);
    }

    async deAllocateCartonsToContainerAtFgOutLocation(reqModel: CartonBarCodesReqDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deAllocateCartonsToContainerAtFgOutLocation'), reqModel, config);
    }



}