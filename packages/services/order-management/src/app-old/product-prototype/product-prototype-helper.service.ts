import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { OrderInfoService } from "../order-manipulation/order-info.service";
import { PoSummaryModel, ProductItemModel, RawOrderNoRequest } from "@xpparel/shared-models";
import { POService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class ProductPrototypeHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => OrderInfoService)) private orderInfoService: OrderInfoService,
    private poInfoService: POService
  ) {

  }

  async getGroupedProductsAndSubProductsRmForOrder(orderId: number, companyCode: string, unitCode: string): Promise<ProductItemModel> {
    return await this.orderInfoService.getGroupedProductsAndSubProductsRmForOrder(orderId, companyCode, unitCode);
  }

  async getPosForSo(soNo: string, soNoPk: number, companyCode: string, unitCode: string): Promise<PoSummaryModel[]> {
    const soReq = new RawOrderNoRequest(null, unitCode, companyCode, 0, soNo, soNoPk,'','',0,false, false, false, false, false);
    const soRes = await this.poInfoService.getPosForMo(soReq);
    if(!soRes.status) {
      throw new ErrorResponse(soRes.errorCode, soRes.internalMessage);
    }
    return soRes.data;
  }
      
}