import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { GlobalResponseObject, PoSerialRequest, PoSummaryModel, RawOrderIdRequest, RawOrderNoRequest, SizeCodeRequest, ValidatorResponse } from "@xpparel/shared-models";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class SizeHelperService {
  constructor(
    private dataSource: DataSource,
    private orderManipulationService: OrderManipulationServices,
    
  ) {

  }

  /**
   * Helper service to save product proto type details 
   * @param req 
   * @returns 
  */
  async checkIfSizesAlreadyUsedInExternalModule(username:string,unitCode:string,companyCode:string,userId:number,sizeCode:string): Promise<boolean> {
    const sizeReq = new SizeCodeRequest(username,unitCode,companyCode,userId,sizeCode);
    const response= await this.orderManipulationService.checkIfSizesAlreadyUsedInExternalModule(sizeReq);
    if(!response.status){
      throw new ErrorResponse(0,response.internalMessage);
    }
    return response.data;
  }

  
  

}