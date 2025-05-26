import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, PkDSetIdsRequest, GlobalResponseObject, PkShippingRequestItemIdRequest, PkShippingRequestFilterRequest, PkShippingRequestResponse, PkShippingRequestTruckRequest, PkShippingRequestVendorRequest, PkShippingRequestIdRequest, PkShippingRequestTruckIdRequest, PkDSetItemIdsRequest, PkShippingRequestCheckoutRequest, PkAodAbstractResponse, PkShippingDispatchRequest, PkShippingDispatchResponse, PKMSPackListIdReqDto, ShippingRequestIdRequest, PkSrFinalItemsResponse, PkTruckItemsMapRequest, PkTruckItemsResponse, VendorDetailsReq, UpdateVendorResponseModel } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { PkShippingRequestInfoService } from './pk-shipping-request-info.service';
import { PkShippingRequestService } from './pk-shipping-request.service';
import { PkTruckItemsService } from './pk-truct-items.service';


@ApiTags('Shipping Request')
@Controller('shipping-request')
export class PkShippingRequestController {
    constructor(
        private service: PkShippingRequestService,
        private infoService: PkShippingRequestInfoService,
        private truckItemService: PkTruckItemsService
    ) {

    }

    @Post('/createShippingRequest')
    async createShippingRequest(@Body() req: PkDSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteShippingRequest')
    async deleteShippingRequest(@Body() req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/approveShippingRequest')
    async approveShippingRequest(@Body() req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.approveShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/rejectShippingRequest')
    async rejectShippingRequest(@Body() req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.rejectShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getShippingRequestByIds')
    async getShippingRequestByIds(@Body() req: PkShippingRequestIdRequest): Promise<PkShippingRequestResponse> {
        try {
            return await this.infoService.getShippingRequestByIds(req);
        } catch (error) {
            return returnException(PkShippingRequestResponse, error);
        }
    }

    @Post('/getShippingRequestByFilterRequest')
    async getShippingRequestByFilterRequest(@Body() req: PkShippingRequestFilterRequest): Promise<PkShippingRequestResponse> {
        try {
            return await this.infoService.getShippingRequestByFilterRequest(req);
        } catch (error) {
            return returnException(PkShippingRequestResponse, error);
        }
    }

    @Post('/saveVendorInfoForShippingRequest')
    async saveVendorInfoForShippingRequest(@Body() req: PkShippingRequestVendorRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveVendorInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/saveTruckInfoForShippingRequest')
    async saveTruckInfoForShippingRequest(@Body() req: PkShippingRequestTruckRequest[]): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveTruckInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteTruckForShippingRequest')
    async deleteTruckForShippingRequest(@Body() req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteTruckForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteVendorInfoForShippingRequest')
    async deleteVendorInfoForShippingRequest(@Body() req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteVendorInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/checkoutShippingRequest')
    async checkoutShippingRequest(@Body() req: PkShippingRequestCheckoutRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.checkoutShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    // NOT USED ATM
    @Post('/deleteItemFromShippingRequest')
    async deleteItemFromShippingRequest(@Body() req: PkShippingRequestItemIdRequest): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getShippingRequestItemAodAbrstactInfo')
    async getShippingRequestItemAodAbrstactInfo(@Body() req: PkShippingRequestItemIdRequest): Promise<PkAodAbstractResponse> {
        try {
            return await this.infoService.getShippingRequestItemAodAbrstactInfo(req);
        } catch (error) {
            return returnException(PkAodAbstractResponse, error);
        }
    }

    @Post('/getAlreadyDispatchedSRCount')
    async getAlreadyDispatchedSRCount(@Body() req: PkShippingDispatchRequest): Promise<PkShippingDispatchResponse> {
        try {
            return await this.infoService.getAlreadyDispatchedSRCount(req);
        } catch (error) {
            return returnException(PkShippingDispatchResponse, error);
        }
    }

    @Post('/validateCheckoutShippingRequest')
    async validateCheckoutShippingRequest(@Body() req: PkShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.validateCheckoutShippingRequest(req);
        } catch (error) {
            return returnException(PkShippingDispatchResponse, error);
        }
    }

    @Post('/getShippingDispatchStatus')
    async getShippingDispatchStatus(@Body() req: PKMSPackListIdReqDto): Promise<GlobalResponseObject> {
        try {
            return await this.service.getShippingDispatchStatus(req);
        } catch (error) {
            return returnException(PkShippingDispatchResponse, error);
        }
    }

    @Post('/getDSetSubItemsForSrId')
    async getDSetSubItemsForSrId(@Body() req: ShippingRequestIdRequest): Promise<PkSrFinalItemsResponse> {
        try {
            return await this.truckItemService.getDSetSubItemsForSrId(req);
        } catch (error) {
            return returnException(PkSrFinalItemsResponse, error);
        }
    }

    @Post('/mapDSetSubItemsToTruck')
    async mapDSetSubItemsToTruck(@Body() req: PkTruckItemsMapRequest): Promise<GlobalResponseObject> {
        try {
            return await this.truckItemService.mapDSetSubItemsToTruck(req);
        } catch (error) {
            return returnException(PkSrFinalItemsResponse, error);
        }
    }

    @Post('/unMapDSetSubItemsToTruck')
    async unMapDSetSubItemsToTruck(@Body() req: PkTruckItemsMapRequest): Promise<GlobalResponseObject> {
        try {
            return await this.truckItemService.unMapDSetSubItemsToTruck(req);
        } catch (error) {
            return returnException(PkSrFinalItemsResponse, error);
        }
    }

    @Post('/getTruckMappedItemsForSrId')
    async getTruckMappedItemsForSrId(@Body() req: ShippingRequestIdRequest): Promise<PkTruckItemsResponse> {
        try {
            return await this.truckItemService.getTruckMappedItemsForSrId(req);
        } catch (error) {
            return returnException(PkTruckItemsResponse, error);
        }
    }

    @Post('/updateTruckLoadingComplete')
    async updateTruckLoadingComplete(@Body() req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.truckItemService.updateTruckLoadingComplete(req);
        } catch (error) {
            return returnException(PkTruckItemsResponse, error);
        }
    }
    @Post('/updateTruckLoadingProgress')
    async updateTruckLoadingProgress(@Body() req: PkShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.truckItemService.updateTruckLoadingProgress(req);
        } catch (error) {
            return returnException(PkTruckItemsResponse, error);
        }
    }

    @Post('/getVendorDetailsByShippingRequest')
    async getVendorDetailsByShippingRequest(@Body() req: VendorDetailsReq): Promise<UpdateVendorResponseModel> {
        try {
            return await this.infoService.getVendorDetailsByShippingRequest(req);
        } catch (error) {
            return returnException(UpdateVendorResponseModel, error);
        }
    }
}