import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import moment = require("moment");
import { MOC_MoProductFabConsumptionRequest, MOC_MoProductFabConsResponse, SI_MoNumberRequest, MOC_MoOrderRevisionResponse } from "@xpparel/shared-models";

@Injectable()
export class OrderConfigInfoService {
  constructor(
    private dataSource: DataSource,
  ) {
  }

  // // gets the components for the  MO + product
  // async getMoProductComponents(req: MOC_MoProductCompsMapRequest): Promise<MOC_MoProductCompsResponse> {
  //   return null;
  // }

  // async getFabConsumptionForMoProduct(req: MOC_MoProductFabConsumptionRequest): Promise<MOC_MoProductFabConsResponse> {
  //   return null;
  // }

  // // saves the knit groups for the MO + product
  // async getKnitGroupsForMoProduct(req: MOC_MoProductKnitGroupMapRequest): Promise<MOC_MoProductKnitGroupResponse> {
  //   return null;
  // }

  // async getOrderRevisionForMo(req: SI_MoNumberRequest): Promise<MOC_MoOrderRevisionResponse> {
  //   return null;
  // }
}