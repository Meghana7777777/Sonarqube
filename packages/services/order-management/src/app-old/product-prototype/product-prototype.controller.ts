import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { ProductPrototypeService } from './product-prototype.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { ProductPrototypeInfoService } from './product-prototype-info.service';


@ApiTags('Product prototype')
@Controller('product-prototype')
export class ProductPrototypeController {
    constructor(
        private service: ProductPrototypeService,
        private infoService: ProductPrototypeInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: SubProductItemMapRequest})
    @Post('/saveSubProductRmItemComps')
    async saveSubProductRmItemComps(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // maps the components to the RM skus for the sub product types
            return await this.service.saveSubProductRmItemComps(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    // deletes the components to the RM skus withtin the product -> subproduct -> rm -> components
    @ApiBody({type: ProductIdRequest})
    @Post('/deleteSubProductRmItemComps')
    async deleteSubProductRmItemComps(@Body() req: ProductIdRequest): Promise<ProductItemResponse> {
        try {
            // unmaps the components to the RM skus for the sub product types
            return await this.service.deleteSubProductRmItemComps(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: ProductIdRequest})
    @Post('/confirmProductRmItemComps')
    async confirmProductRmItemComps(@Body() req: ProductIdRequest): Promise<GlobalResponseObject> {
        try {
            // confirm the status falg so can proceed to PPS
            return await this.service.confirmProductRmItemComps(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: ProductIdRequest})
    @Post('/unConfirmProductRmItemComps')
    async unConfirmProductRmItemComps(@Body() req: ProductIdRequest): Promise<GlobalResponseObject> {
        try {
            // un confirm the status falg so can do some alters
            return await this.service.unConfirmProductRmItemComps(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    // gets the components to the RM skus withtin the product -> subproduct -> rm -> components
    @ApiBody({type: ProductIdRequest})
    @Post('/getProductRmItemComps')
    async getProductRmItemComps(@Body() req: ProductIdRequest): Promise<ProductItemResponse> {
        try {
            // get it from infoService
            return await this.infoService.getProductRmItemComps(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    // saves the default product and sub product for the given SO after its confirmation
    @ApiBody({type: RawOrderIdRequest})
    @Post('/saveProductAndSubProduct')
    async saveProductAndSubProduct(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // get it from infoService
            return await this.service.saveProductAndSubProduct(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    //  delete the product and sub product
    @ApiBody({type: RawOrderIdRequest})
    @Post('/deleteProductAndSubProduct')
    async deleteProductAndSubProduct(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // get it from infoService
            return await this.service.deleteProductAndSubProduct(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}