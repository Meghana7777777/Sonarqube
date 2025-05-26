import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import moment = require("moment");
import { GlobalResponseObject, MOC_MoOrderRevisionRequest, MOC_MoProductFabConsumptionRequest } from "@xpparel/shared-models";

@Injectable()
export class OrderConfigService {
  constructor(
    private dataSource: DataSource,
  ) {
  }

  // ---------------------------- PRODUCT COMPONENT MAPPING ----------------------
  // maps the components to the MO + product
  // async saveMoProductComponents(req: MOC_MoProductCompsMapRequest): Promise<GlobalResponseObject> {
  //   // delete the old records for the MO and product and then insert the components
  //   return null;
  // }
 
  // // clears the components for the  MO + product
  // async clearMoProductComponents(req: MOC_MoProductCompsMapRequest): Promise<GlobalResponseObject> {
  //   return null;
  // }

  // // ---------------------------- KNIT GROUPS ----------------------
  // // saves the knit groups for the MO + product
  // async saveKnitGroupsForMoProduct(req: MOC_MoProductKnitGroupMapRequest): Promise<GlobalResponseObject> {
  //   return null;
  // }

  // deletes the knit groups fro the MO + product
  // async clearKnitGroupsForMoProduct(req: MOC_MoProductKnitGroupMapRequest): Promise<GlobalResponseObject> {
  //   return null;
  // }


  // ---------------------------- CONSUMPTION -------------------------

  async saveFabConsumptionForMoProduct(req: MOC_MoProductFabConsumptionRequest): Promise<GlobalResponseObject> {
    return null;
  }


  // ----------------------------- ORDER REVISION ---------------------
  async saveOrderRevisionForMo(req: MOC_MoOrderRevisionRequest): Promise<GlobalResponseObject> {
    return null;
  }


}



