import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {CommonRequestAttrs, SupplierCreateRequest, SupplierResponse, SuppliersResponseK} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { SupplierDataService } from './supplier-service';




@ApiTags('Supplier Data Module')
@Controller('supplier')
export class SupplierDataController {
  constructor(private readonly supplierDataService: SupplierDataService) {}

  @Post('/createSupplier')
  async createSupplier(@Body() reqModel:  SupplierCreateRequest): Promise<SupplierResponse > {
    try {
      return await this.supplierDataService.createSupplier(reqModel);
    } catch (error) {
      return returnException(SupplierResponse ,error)
    }
  }
  @Post('/ActivateDeactivateSuppliers')
  async ActivateDeactivateSuppliers(@Body() reqModel: SupplierCreateRequest): Promise<SupplierResponse> {
    try {
      return await this.supplierDataService.activateDeactivateSuppliers(reqModel);
    } catch (error) {
      return returnException(SupplierResponse,error)
    }
  }

  @Post('/getAllSuppliersData')
  async  getAllSuppliersData(@Body() reqModel:CommonRequestAttrs): Promise<SuppliersResponseK>{
      try{
          return await this.supplierDataService.getAllSuppliersData(reqModel);
      }catch(error){
          return returnException(SuppliersResponseK, error)
      }
  }

 
  
}
