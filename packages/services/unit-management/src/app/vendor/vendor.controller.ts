import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, VendorCategoryRequest, VendorCreateRequest, VendorIdRequest, VendorResponse } from '@xpparel/shared-models';
import { VendorService } from './vendor.service';
import { returnException } from '@xpparel/backend-utils';
import { VendorInfoService } from './vendor-info.service';


@ApiTags('Vendor')
@Controller('vendor')
export class VendorController {
    constructor(
        private service: VendorService,
        private infoService: VendorInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: VendorCreateRequest})
    @Post('/createVendor')
    async createVendor(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createVendor(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: VendorCreateRequest})
    @Post('/deleteVendor')
    async deleteVendor(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.deleteVendor(req);
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
    @Post('/getAllVendors')
    async getAllVendors(@Body() req: any): Promise<VendorResponse> {
        try {
            return await this.service.getAllVendors(req);
        } catch (error) {
            return returnException(VendorResponse, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: VendorCategoryRequest})
    @Post('/getAllVendorsByVendorCategory')
    async getAllVendorsByVendorCategory(@Body() req: any): Promise<VendorResponse> {
        try {
            return await this.service.getAllVendorsByVendorCategory(req);
        } catch (error) {
            return returnException(VendorResponse, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: VendorIdRequest})
    @Post('/getVendorInfoById')
    async getVendorInfoById(@Body() req: any): Promise<VendorResponse> {
        try {
            return await this.service.getVendorInfoById(req);
        } catch (error) {
            return returnException(VendorResponse, error);
        }
    }

}