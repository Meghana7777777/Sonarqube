import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CutDispatchCreateRequest, DSetIdsRequest, GlobalResponseObject, ShippingRequestItemIdRequest, ShippingRequestFilterRequest, ShippingRequestResponse, ShippingRequestTruckRequest, ShippingRequestVendorRequest, ShippingRequestIdRequest, ShippingRequestTruckIdRequest, DSetItemIdsRequest, ShippingRequestCheckoutRequest, AodAbstractResponse, ShippingDispatchRequest, ShippingDispatchResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { ShippingRequestInfoService } from './shipping-request-info.service';
import { ShippingRequestService } from './shipping-request.service';


@ApiTags('Shipping Request')
@Controller('shipping-request')
export class ShippingRequestController {
    constructor(
        private service: ShippingRequestService,
        private infoService: ShippingRequestInfoService,
    ) {

    }

    @Post('/createShippingRequest')
    async createShippingRequest(@Body() req: DSetIdsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteShippingRequest')
    async deleteShippingRequest(@Body() req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/approveShippingRequest')
    async approveShippingRequest(@Body() req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.approveShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/rejectShippingRequest')
    async rejectShippingRequest(@Body() req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.rejectShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getShippingRequestByIds')
    async getShippingRequestByIds(@Body() req: ShippingRequestIdRequest): Promise<ShippingRequestResponse> {
        try {
            return await this.infoService.getShippingRequestByIds(req);
        } catch (error) {
            return returnException(ShippingRequestResponse, error);
        }
    }

    @Post('/getShippingRequestByFilterRequest')
    async getShippingRequestByFilterRequest(@Body() req: ShippingRequestFilterRequest): Promise<ShippingRequestResponse> {
        try {
            return await this.infoService.getShippingRequestByFilterRequest(req);
        } catch (error) {
            return returnException(ShippingRequestResponse, error);
        }
    }

    @Post('/saveVendorInfoForShippingRequest')
    async saveVendorInfoForShippingRequest(@Body() req: ShippingRequestVendorRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveVendorInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/saveTruckInfoForShippingRequest')
    async saveTruckInfoForShippingRequest(@Body() req: ShippingRequestTruckRequest[]): Promise<GlobalResponseObject> {
        try {
            return await this.service.saveTruckInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteTruckForShippingRequest')
    async deleteTruckForShippingRequest(@Body() req: ShippingRequestTruckIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteTruckForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteVendorInfoForShippingRequest')
    async deleteVendorInfoForShippingRequest(@Body() req: ShippingRequestIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteVendorInfoForShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/checkoutShippingRequest')
    async checkoutShippingRequest(@Body() req: ShippingRequestCheckoutRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.checkoutShippingRequest(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    // NOT USED ATM
    @Post('/deleteItemFromShippingRequest')
    async deleteItemFromShippingRequest(@Body() req: ShippingRequestItemIdRequest): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getShippingRequestItemAodAbrstactInfo')
    async getShippingRequestItemAodAbrstactInfo(@Body() req: ShippingRequestItemIdRequest): Promise<AodAbstractResponse> {
        try {
            return await this.infoService.getShippingRequestItemAodAbrstactInfo(req);
        } catch (error) {
            return returnException(AodAbstractResponse, error);
        }
    }

    @Post('/getAlreadyDispatchedSRCount')
    async getAlreadyDispatchedSRCount(@Body() req: ShippingDispatchRequest): Promise<ShippingDispatchResponse> {
        try {
            return await this.infoService.getAlreadyDispatchedSRCount(req);
        } catch (error) {
            return returnException(ShippingDispatchResponse, error);
        }
    }
}