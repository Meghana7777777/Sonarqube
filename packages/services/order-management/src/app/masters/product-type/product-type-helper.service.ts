import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ProductTypeReq } from "@xpparel/shared-models";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import moment = require("moment");

@Injectable()
export class ProductTypeHelperService {
  constructor(
    private dataSource: DataSource,
    private checkproductType:OrderManipulationServices
  ) {

  }
  async checkProductTypeAlreadyUsedInExternalModule(username:string,unitCode:string,companyCode:string,userId:number,productType:string): Promise<boolean> {
    const productTypeReq = new ProductTypeReq(username,unitCode,companyCode,userId,productType)
    const response = await this.checkproductType.checkProductTypeAlreadyUsedInExternalModule(productTypeReq);
    if(!response){
      throw new ErrorResponse(0,response.internalMessage);
    }
    return response.data;
  }
}