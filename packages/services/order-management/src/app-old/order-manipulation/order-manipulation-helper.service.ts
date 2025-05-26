import { Inject, Injectable, forwardRef } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ProductPrototypeService } from "../product-prototype/product-prototype.service";
import { GlobalResponseObject, OrderQtyUpdateModel, PoSerialRequest, PoSummaryModel, RawOrderIdRequest, RawOrderNoRequest } from "@xpparel/shared-models";
import { ProductPrototypeInfoService } from "../product-prototype/product-prototype-info.service";
import { ProductEntity } from "../product-prototype/entity/product.entity";
import { POService, PreIntegrationService } from "@xpparel/shared-services";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class OrderManipulationHelperService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => ProductPrototypeService)) private productPrototypeService: ProductPrototypeService,
    @Inject(forwardRef(() => ProductPrototypeInfoService)) private productPrototypeInfoService: ProductPrototypeInfoService,
    private poInfoService: POService,
    private preIntegrationWms : PreIntegrationService,
    
  ) {

  }

  /**
   * Helper service to save product proto type details 
   * @param req 
   * @returns 
  */
  async saveProductAndSubProduct(req: RawOrderNoRequest, inComingTransManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    return await this.productPrototypeService.saveProductAndSubProduct(req, inComingTransManager);
  }

  /**
   * Helper service to delete product proto type details 
   * @param req 
   * @returns 
  */
  async deleteProductAndSubProduct(req: RawOrderNoRequest, inComingTransManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    return await this.productPrototypeService.deleteProductAndSubProduct(req, inComingTransManager);
  }

  /**
   * 
   * @param productType 
   * @param unitCode 
   * @param companyCode 
  */
  async getProductRecordSaleOrderId(orderId: number, unitCode: string, companyCode: string): Promise<ProductEntity> {
    // Getting product Confirmation Status
    return await this.productPrototypeInfoService.getProductRecordForSaleOrderId(orderId, companyCode, unitCode);
  }

  // to get the po info for the po serial
  async getPoInfoForPoSerial( poSerial: number, companyCode: string, unitCode: string,): Promise<PoSummaryModel> {
    const poSerialReq = new PoSerialRequest(null, unitCode, companyCode, 0, poSerial, 0, false, false);
    const poInfoRes = await this.poInfoService.getPoBasicInfoByPoSerial(poSerialReq);
    if (!poInfoRes) {
      throw new ErrorResponse(1080, 'Po info is not found');
    }
    return poInfoRes.data[0];
  }

  async updateOrderQtyRevisionWms(req: OrderQtyUpdateModel): Promise<any> {
    try {
        return await this.preIntegrationWms.updateOrderQtyRevisionWms(req);
    } catch (error) {
      throw error;
    }
  }
  

}