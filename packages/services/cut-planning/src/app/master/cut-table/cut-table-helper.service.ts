import { Injectable } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");
import { DocketPlanningServices } from "@xpparel/shared-services";
import { CutTableIdRequest, CutTableOpenCloseDocketsCountModel } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class CutTableHelperService {
  constructor(
    private dataSource: DataSource,
    private docketPlanningService:DocketPlanningServices
  ) {

  }
  async getActiveInactiveDocketsForCutTable(username:string,unitCode:string,companyCode:string,userId:number,cutTableId:number):Promise<CutTableOpenCloseDocketsCountModel>{
    const cutTableReq= new CutTableIdRequest(username,unitCode,companyCode,userId,cutTableId);
    const docketResponse=await this.docketPlanningService.getActiveInactiveDocketsForCutTable(cutTableReq);
    if(!docketResponse.status){
      throw new ErrorResponse(0,docketResponse.internalMessage);
    }
    return docketResponse.data;
  }

}