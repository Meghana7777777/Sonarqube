import { Injectable } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { ProductPrototypeHelperService } from "./product-prototype-helper.service";
import { ProductRepository } from "./repository/product.repository";
import { SubProductFabricRepository } from "./repository/sub-product-fabric.repository";
import { SubProductRepository } from "./repository/sub-product.repository";
import { ProductEntity } from "./entity/product.entity";
import { SubProductEntity } from "./entity/sub-product.entity";
import { SubProductFabricEntity } from "./entity/sub-product-fabric.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ProductIdRequest, ProductItemResponse, SubProductItemModel, RmCompMapModel, ComponentModel, PhItemCategoryEnum, ProductItemModel } from "@xpparel/shared-models";

@Injectable()
export class ProductPrototypeInfoService {
  constructor(
    private dataSource: DataSource,
    private productRepo: ProductRepository,
    private subProductRepo: SubProductRepository,
    private subProdFabricRepo: SubProductFabricRepository
  ) {

  }

  async getProductRecordForSaleOrderId(orderId: number, companyCode: string, unitCode: string): Promise<ProductEntity> {
    return await this.productRepo.findOne({ where: { orderId: orderId, isActive: true, companyCode: companyCode, unitCode: unitCode} });
  }

  async getProductRecordForProdId(prodId: number, companyCode: string, unitCode: string): Promise<ProductEntity> {
    return await this.productRepo.findOne({ where: { id: prodId, isActive: true, companyCode: companyCode, unitCode: unitCode} });
  }
   
  async getProductRecordForSaleOrder(soNo: string, companyCode: string, unitCode: string): Promise<ProductEntity> {
    return await this.productRepo.findOne({ where: { orderRefNo: soNo, isActive: true, companyCode: companyCode, unitCode: unitCode} });
  }

  async getSubProductRecordForSubProdId(subProdId: number, companyCode: string, unitCode: string): Promise<SubProductEntity> {
    return await this.subProductRepo.findOne({ where: { id: subProdId, isActive: true, companyCode: companyCode, unitCode: unitCode} });
  }

  async getSubProdcutsForProductId(prodId: number, companyCode: string, unitCode: string): Promise<SubProductEntity[]> {
    const prodEnt = new ProductEntity();
    prodEnt.id = prodId;
    return await this.subProductRepo.find({ where: { productId: prodEnt, isActive: true, companyCode: companyCode, unitCode: unitCode} });
  }

  async getSubProdRmForSubProdId(subProdId: number, companyCode: string, unitCode: string): Promise<SubProductFabricEntity[]> {
    const subProd = new SubProductEntity();
    subProd.id = subProdId;
    return await this.subProdFabricRepo.find({ where: { subProductId: subProd, isActive: true, companyCode: companyCode, unitCode: unitCode}});
  } 

  /**
   * retrieves the product and sub product info along with RM mapping
   * @param req 
   * @returns 
   */
  async getProductRmItemComps(req: ProductIdRequest): Promise<ProductItemResponse> {
    // get the products , sub products and  
    const product = await this.getProductRecordForSaleOrderId(req.orderId, req.companyCode, req.unitCode);
    if (!product) {
      throw new ErrorResponse(1056, 'Product Data does not exist for sale order.');
      // throw new ErrorResponse(0, 'Product Data does not exist for sale order : ' + req.orderId);
    }
    const subProductModels: SubProductItemModel[] = [];
    const subProds = await this.getSubProdcutsForProductId(product.id, req.companyCode, req.unitCode);
    for(const subProd of subProds) {
      const comps = subProd.componentNames ? subProd.componentNames.split(',') : [];

      const subProdRmModels: RmCompMapModel[] = [];
      // get the RM for each of the sub product
      const subProdRm = await this.getSubProdRmForSubProdId(subProd.id, req.companyCode, req.unitCode);
      subProdRm.forEach(rm => {
        const compsModel: ComponentModel[] = [];
        const rmComps = rm.componentNames.split(',');
        rmComps.forEach(r => r ? compsModel.push(new ComponentModel(null, null, null, null, null, r, r) ) : '' );
        subProdRmModels.push(new RmCompMapModel(rm.itemCode, rm.itemName, rm.itemDesc, rm.itemColor, null, PhItemCategoryEnum.FABRIC, PhItemCategoryEnum.FABRIC, rm.squence, compsModel));
      });
      subProductModels.push(new SubProductItemModel(product.orderRefNo, null, comps, subProdRmModels, subProd.style, subProd.styleCode, subProd.styleDesc, subProd.productType,subProd.subProductName,  subProd.color, product.id, subProd.id));
    }
    const productModel = new ProductItemModel(product.orderRefNo, product.orderId, subProductModels, product.style, product.styleCode, product.styleDesc, product.productType, subProductModels.length, product.confirmationStatus, product.id);

    return new ProductItemResponse(true, 1057, 'Product info retrieved successfully', [productModel]);
  }
  
}