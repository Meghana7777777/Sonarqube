import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, PoNumberRequest, ProductTypeCompModel, ProductTypeIdRequest, ProductTypeRequest, ProductTypeResponse, ManufacturingOrderResp, MoDumpModal, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { ProductTypeService } from './product-type.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';

@ApiTags('Product type')
@Controller('product-type')
export class ProductTypeController {
  constructor(
    private service: ProductTypeService,     
  ) {

  }

  @Post('createProductType')
  async createProductType(@Body() req: ProductTypeRequest): Promise<ProductTypeResponse> {
    try {
      return await this.service.createProductType(req);
    } catch (error) {
      return returnException(ProductTypeResponse, error)
    }
  }

  @Post('deleteProductType')
  // @ApiBody({ type: ProductTypeIdRequest })
  async deleteProductType(@Body() req: ProductTypeIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.deleteProductType(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }
  
  @Post('getProductType')
  async getProductType(@Body() req: ProductTypeIdRequest): Promise<ProductTypeResponse> {
    try {
      return await this.service.getProductType(req);
    } catch (error) {
      return returnException(ProductTypeResponse, error)
    }
  }

  @Post('getAllProductTypes')
  async getAllProductTypes(@Body() req: CommonRequestAttrs): Promise<ProductTypeResponse> {
    try {
      return await this.service.getAllProductTypes(req);
    } catch (error) {
      return returnException(ProductTypeResponse, error)
    }
  }

  @Post('mapCompsToProductType')
  async mapCompsToProductType(@Body() req: ProductTypeRequest): Promise<ProductTypeResponse> {
    try {
      return await this.service.mapCompsToProductType(req);
    } catch (error) {
      return returnException(ProductTypeResponse, error)
    }
  }

  async unMapCompsToProductType(req: ProductTypeIdRequest): Promise<ProductTypeResponse> {
    try {
      return null;
    } catch (error) {

    }
  }

}