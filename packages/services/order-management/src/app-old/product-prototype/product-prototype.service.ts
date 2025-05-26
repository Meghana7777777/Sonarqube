import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import moment = require("moment");
import { ProductPrototypeHelperService } from "./product-prototype-helper.service";
import { ProductRepository } from "./repository/product.repository";
import { SubProductFabricRepository } from "./repository/sub-product-fabric.repository";
import { SubProductRepository } from "./repository/sub-product.repository";
import { ProductPrototypeInfoService } from "./product-prototype-info.service";
import { GlobalResponseObject, ProductIdRequest, RawOrderNoRequest, MoProductStatusEnum, SubProductItemMapRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SubProductFabricEntity } from "./entity/sub-product-fabric.entity";
import { SubProductEntity } from "./entity/sub-product.entity";
import { ProductEntity } from "./entity/product.entity";

@Injectable()
export class ProductPrototypeService {
  constructor(
    private dataSource: DataSource,
    private prodPrototypeHelper: ProductPrototypeHelperService,
    private productRepo: ProductRepository,
    private subProductRepo: SubProductRepository,
    private subProdFabricRepo: SubProductFabricRepository,
    private infoService: ProductPrototypeInfoService,
    private helperService: ProductPrototypeHelperService,
  ) {

  }

  /**
   * PRE validaitons pending
   * saves the rm sku mapping of the product and sub products
   * @param req 
   * @returns 
   */
  async saveSubProductRmItemComps(req: SubProductItemMapRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // If there's a PO then we must not update this or save this

      // check if the prod exist
      const product = await this.infoService.getProductRecordForProdId(req.prodId, req.companyCode, req.unitCode);
      if (!product) {
        throw new ErrorResponse(1058, 'Product does not exist : ' + req.prodId);
      }
      if (product.confirmationStatus == MoProductStatusEnum.CONFIRMED) {
        throw new ErrorResponse(1059, ' Product already confirmed. You cannot do any changes. Revert the product confirmation and try again')
      }
      const subProd = await this.infoService.getSubProductRecordForSubProdId(req.subProdId, req.companyCode, req.unitCode);
      if (!subProd) {
        throw new ErrorResponse(1060, 'Sub Product does not exist : ' + req.subProdId);
      }
      const allComps = new Set<string>();
      // gather all comps
      req.rmCompMapping.forEach(sku => { sku.components.forEach(c => { allComps.add(c.compName) }) });

      await transManager.startTransaction();
      // save the comps mapping to the sku
      for (const sku of req.rmCompMapping) {
        const comps: string[] = [];
        sku.components.forEach(comp => {
          comps.push(comp.compName);
        });
        const compsString = comps.toString();
        // update every SKU record with the components 
        const subProdEnt = new SubProductEntity();
        subProdEnt.id = req.subProdId;
        await transManager.getRepository(SubProductFabricEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, subProductId: subProdEnt, itemCode: sku.iCode}, { componentNames: compsString, updatedUser: req.username  });
      }
      // update the all components against the sub product
      const allCompsString = Array.from(allComps).toString();
      await transManager.getRepository(SubProductEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.subProdId }, { componentNames: allCompsString , updatedUser: req.username });

      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1061, 'Components mapped to the cut materials');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * PRE validations pending
   * deletes the comps mapping for the sub product skus
   * @param req 
   */
  async deleteSubProductRmItemComps(req: ProductIdRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      // pre validations have to be applied. PO must not be created in OES
      const product = await this.infoService.getProductRecordForProdId(req.prodId, req.companyCode, req.unitCode);
      if (!product) {
        throw new ErrorResponse(1058, 'Product does not exist : ' + req.prodId);
      }
      if (product.confirmationStatus == MoProductStatusEnum.CONFIRMED) {
        throw new ErrorResponse(1063, ' Product already confirmed. You cannot do any changes. Revert the product confirmation and try again')
      }

      const subProdEnt = new SubProductEntity();
      subProdEnt.id = req.subProdId;
      const randomSkuRecord = await this.subProdFabricRepo.find({ select: ['componentNames'], where: { companyCode: req.companyCode, unitCode: req.unitCode, subProductId: subProdEnt }});
      if(!randomSkuRecord[0]?.componentNames) {
        throw new ErrorResponse(1064, 'Sku components mapping is still not done to delete');
      }
      await transManager.startTransaction();
      // update every SKU record with the components 
      await transManager.getRepository(SubProductFabricEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, subProductId: subProdEnt}, 
        { componentNames: '', updatedUser: req.username });
      await transManager.getRepository(SubProductEntity).update({ companyCode: req.companyCode, unitCode: req.unitCode, id: req.subProdId}, { componentNames: '', updatedUser: req.username  });
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1065, 'Components un-mapped to the cut materials');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  /**
   * confirm the product mapping to proceed funthur for po creations
   * @param req 
   */
  async confirmProductRmItemComps(req: ProductIdRequest): Promise<GlobalResponseObject> {
    // confirm the status of the product for furthur processing
    // check if the prod exist
    const product = await this.infoService.getProductRecordForProdId(req.prodId, req.companyCode, req.unitCode);
    if (!product) {
      throw new ErrorResponse(1058, 'Product does not exist : ' + req.prodId);
    }
    // check if all the sub products has the comps mapping
    const subProds = await this.infoService.getSubProdcutsForProductId(req.prodId, req.companyCode, req.unitCode);
    for (const subProd of subProds) {
      // get the comps mapping for the sub prod
      const subProdRms = await this.infoService.getSubProdRmForSubProdId(subProd.id, req.companyCode, req.unitCode);
      subProdRms.forEach(rm => {
        // if comps not mapped then throw an exception
        if (rm?.componentNames?.length == 0) {
          throw new ErrorResponse(1067, `Components were still not mapped for the sub product : ${subProd.productType} and RM ${rm.itemCode} `)
        }
      });
    }
    await this.productRepo.update({ id: product.id, companyCode: req.companyCode, unitCode: req.unitCode }, { confirmationStatus: MoProductStatusEnum.CONFIRMED, updatedUser: req.username });
    return new GlobalResponseObject(true, 1068, 'Product confirmed successfully');
  }

  /**
   * PENDING validations for PO creation
   * @param req 
   */
  async unConfirmProductRmItemComps(req: ProductIdRequest): Promise<GlobalResponseObject> {
    if(!req.prodId) {
      throw new ErrorResponse(1069, 'SO number is not provided');
    }
    const product = await this.infoService.getProductRecordForProdId(req.prodId, req.companyCode, req.unitCode);
    if (!product) {
      throw new ErrorResponse(1058, 'Product does not exist : ' + req.prodId);
    }
    if(product.confirmationStatus != MoProductStatusEnum.CONFIRMED) {
      throw new ErrorResponse(1071, 'Product is not yet confirmed');
    }
    // check if any PO is created for the product. If created, then we cannot unconfirm the product info
    const prodOrdersForSo = await this.helperService.getPosForSo(product.orderRefNo, product.orderId, req.companyCode, req.unitCode);
    if(prodOrdersForSo.length > 0) {
      throw new ErrorResponse(1072, `Production orders are already created for this SO : ${product.orderRefNo}`);
    }
    // check the po status for the produc.
    await this.productRepo.update({ id: product.id, companyCode: req.companyCode, unitCode: req.unitCode }, { confirmationStatus: MoProductStatusEnum.OPEN, updatedUser: req.username });
    return new GlobalResponseObject(true, 1073, 'Product un-confirmed successfully');
  }


  /**
   * saves the default product and sub product for the given SO after its confirmation
   * @param req 
   * @returns 
   */
  async saveProductAndSubProduct(req: RawOrderNoRequest, inComingTransManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager = inComingTransManager ? inComingTransManager : new GenericTransactionManager(this.dataSource);
    try {
      // check if the prods are already created
      const productRec = await this.infoService.getProductRecordForSaleOrderId(req.orderId, req.companyCode, req.unitCode);
      if(productRec) {
        throw new ErrorResponse(1074, 'Product is already existing for the SO');
      }
      const pAndSModel = await this.helperService.getGroupedProductsAndSubProductsRmForOrder(req.orderId, req.companyCode, req.unitCode);
      // convert into entities and save the product and sub product and its RM
      inComingTransManager ? '' : await transManager.startTransaction();
      const prodEnt = new ProductEntity();
      prodEnt.orderId = pAndSModel.orderId;
      prodEnt.orderRefNo = pAndSModel.orderNo;
      prodEnt.productType = pAndSModel.productType;
      prodEnt.style = pAndSModel.style;
      prodEnt.styleCode = pAndSModel.styleCode;
      prodEnt.styleDesc = pAndSModel.styleDesc;
      prodEnt.createdUser = req.username;
      prodEnt.companyCode = req.companyCode;
      prodEnt.unitCode = req.unitCode;
      prodEnt.confirmationStatus = MoProductStatusEnum.OPEN;
      const savedProd = await transManager.getRepository(ProductEntity).save(prodEnt);
      
      for(const subProd of pAndSModel.subProducts) {
        const subProdEnt = new SubProductEntity();
        subProdEnt.orderId = pAndSModel.orderId;
        subProdEnt.productType = subProd.subProductType;
        subProdEnt.style = subProd.subStyle;
        subProdEnt.styleCode = subProd.subStyleCode;
        subProdEnt.styleDesc = subProd.substyleDesc;
        subProdEnt.subProductName = subProd.subProdName;
        subProdEnt.color = subProd.fgColor;
        subProdEnt.componentNames = '';
        subProdEnt.remarks = 'SYSTEM GENERATED';
        subProdEnt.createdUser = req.username;
        subProdEnt.companyCode = req.companyCode;
        subProdEnt.unitCode = req.unitCode;
        // assign the saved id
        subProdEnt.productId = new ProductEntity();
        subProdEnt.productId.id = savedProd.id;

        const savedSubProd = await transManager.getRepository(SubProductEntity).save(subProdEnt);

        for(const rm of subProd.rmCompMapping) {
          const rmEnt = new SubProductFabricEntity();
          rmEnt.itemCode = rm.iCode;
          rmEnt.itemName = rm.iName;
          rmEnt.itemDesc = rm.iDesc;
          rmEnt.itemColor = rm.iColor;
          rmEnt.squence = rm.sequence ?? 0;
          rmEnt.remarks = '';
          rmEnt.componentNames = '';
          rmEnt.createdUser = req.username;
          rmEnt.companyCode = req.companyCode;
          rmEnt.unitCode = req.unitCode;
          rmEnt.orderId = pAndSModel.orderId;
          rmEnt.subProductId = new SubProductEntity();
          rmEnt.subProductId.id = savedSubProd.id;
          
          await transManager.getRepository(SubProductFabricEntity).save(rmEnt);
        }
      }
      inComingTransManager ? '' : await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1075, 'Defaul product and sub product saved')
    } catch(err) {
      inComingTransManager ? '' : await transManager.releaseTransaction();
      throw err;
    }
  }

  /**
   * delete the product and sub product
   * @param req 
   */
  async deleteProductAndSubProduct(req: RawOrderNoRequest, inComingTransManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager =  inComingTransManager ? inComingTransManager : new GenericTransactionManager(this.dataSource);
    try {
      if(!req.orderId) {
        throw new ErrorResponse(1076, 'Order id is not provided');
      }
      // we have to check if the product is confirmed
      // pre validations have to be applied. PO must not be created in OES
      const product = await this.infoService.getProductRecordForSaleOrderId(req.orderId, req.companyCode, req.unitCode);
      if (!product) {
        throw new ErrorResponse(1058, 'Product does not exist for the order : ' + req.orderId);
      }
      if (product.confirmationStatus == MoProductStatusEnum.CONFIRMED) {
        throw new ErrorResponse(1078, ' Product already confirmed. You cannot do any changes. Revert the product confirmation and try again')
      }

      inComingTransManager ? '' : await transManager.startTransaction();
      transManager.getRepository(SubProductFabricEntity).delete({ orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode});
      transManager.getRepository(SubProductEntity).delete({ orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode})
      transManager.getRepository(ProductEntity).delete({ orderId: req.orderId, companyCode: req.companyCode, unitCode: req.unitCode})
      inComingTransManager ? '' : await transManager.completeTransaction();
      return new GlobalResponseObject(true, 1079, 'Product and sub product deleted');
    } catch (err) {
      inComingTransManager ? '' : await transManager.releaseTransaction();
      throw err;
    }
  }
}