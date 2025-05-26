import { Injectable } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");
import { GlobalResponseObject, ProductTypeReq } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { OrderManipulationServices } from "@xpparel/shared-services";

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