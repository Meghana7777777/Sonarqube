import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, ShiftCreateRequest, ShiftModel, ShiftResponse, SizesResponse, SizescreateRequest, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { SizesService } from './sizes.service';


@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
    constructor(
        private service: SizesService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: SizescreateRequest})
    @Post('createSize')
    async createSize(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createSize(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: SizescreateRequest})
    @Post('/deleteSize')
    async deleteSize(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteSize(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: CommonRequestAttrs})
    @Post('/getAllSizes')
    async getAllSizes(@Body() req: any): Promise<SizesResponse> {
        try {
            return await this.service.getAllSizes(req);
        } catch (error) {
            return returnException(SizesResponse, error);
        }
    }

    @ApiBody({type: SizescreateRequest})
    @Post('/saveSizeIndex')
    async saveSizeIndex(@Body() req: SizescreateRequest[]): Promise<SizesResponse> {
        try {
            return await this.service.saveSizeIndex(req);
        } catch (error) {
            return returnException(SizesResponse, error);
        }
    }

}