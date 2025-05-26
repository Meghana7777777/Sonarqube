import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { StyleOpRoutingService } from './style-op-routing.service';
import { returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, GlobalResponseObject, OpVersionAbstractResponse, MOP_OpRoutingRetrievalRequest, MOP_OpRoutingVersionRequest, StyleOpRoutingResponse, StyleProductTypeOpVersionAbstractResponse, SI_MoNumberRequest, StyleProductCodeRequest, SI_SoNumberRequest } from '@xpparel/shared-models';
import { StyleOperationInfoService } from './style-product-type.service';


@ApiTags('style-op-routing')
@Controller('style-op-routing')
export class StyleOpRoutingController {
    constructor(
        private styleOpVersionService: StyleOpRoutingService,
        private styleOperationInfoService: StyleOperationInfoService
    ) {

    }



    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getStyleProductTypeOpVersionAbstract')
    async getStyleProductTypeOpVersionAbstract(@Body() reqObj: any): Promise<StyleProductTypeOpVersionAbstractResponse> {
        try {
            return await this.styleOpVersionService.getStyleProductTypeOpVersionAbstract(reqObj);
        } catch (error) {
            return returnException(StyleProductTypeOpVersionAbstractResponse, error)
        }
    }


    @ApiBody({ type: MOP_OpRoutingVersionRequest })
    @Post('/createOpVersionForStyleAndProductType')
    async createOpVersionForStyleAndProductType(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.styleOpVersionService.createOpVersionForStyleAndProductType(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: MOP_OpRoutingVersionRequest })
    @Post('/getOpVersionsForStyleAndProductType')
    async getOpVersionsForStyleAndProductType(@Body() reqObj: any): Promise<OpVersionAbstractResponse> {
        try {
            return await this.styleOpVersionService.getOpVersionsForStyleAndProductType(reqObj);
        } catch (error) {
            return returnException(OpVersionAbstractResponse, error)
        }
    }


    @ApiBody({ type: MOP_OpRoutingRetrievalRequest })
    @Post('/getOpVersionInfoForStyleAndProductType')
    async getOpVersionInfoForStyleAndProductType(@Body() reqObj: any): Promise<StyleOpRoutingResponse> {
        try {
            return await this.styleOpVersionService.getOpVersionInfoForStyleAndProductType(reqObj);
        } catch (error) {
            return returnException(StyleOpRoutingResponse, error)
        }
    }


    @ApiBody({ type: MOP_OpRoutingRetrievalRequest })
    @Post('/deleteOpVersionForStyleAndProductType')
    async deleteOpVersionForStyleAndProductType(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.styleOpVersionService.deleteOpVersionForStyleAndProductType(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/getAndSaveStyleProductTypeForMO')
    async getAndSaveStyleProductTypeForMO(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.styleOperationInfoService.getAndSaveStyleProductTypeForMO(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }


    @ApiBody({ type: SI_SoNumberRequest })
    @Post('/getAndSaveStyleProductTypeForSO')
    async getAndSaveStyleProductTypeForSO(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.styleOperationInfoService.getAndSaveStyleProductTypeForSO(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    
    @ApiBody({ type: StyleProductCodeRequest })
    @Post('/getProcessTypesForStyle')
    async getProcessTypesForStyle(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.styleOperationInfoService.getProcessTypesForStyle(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

}
