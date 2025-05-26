import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, OrderDataItemDetailsResponse, OrderItemDetailsModel, OrderNumbersRequest, PoRmItemsModel, PoRmUpdateRequest, PoSerialRequest, RawOrderHeaderInfoResponse, RawOrderNoRequest, RefCompDetailModel, RefComponentInfoResponse } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PCutRmSizePropsEntity } from "./entity/p-cut-rm-size-prop.entity";
import { PCutRmEntity } from "./entity/p-cut-rm.entity";
import { PoMaterialHelperService } from "./po-material-helper.service";
import { PCutRmRepository } from "./repository/p-cut-rm.repository";
import { PTrimRmRepository } from "./repository/p-trim-rm.respository";
import { FabricColorAndItemInfo } from "./repository/query-response/fab-level-prod-name.query.response";
import moment = require("moment");
import { PoHelperService } from "../processing-order/po-helper.service";
import { ProcessingOrderRepository } from "../common/repository/processing-order.repo";
import { PCutRmSizePropRepository } from "./repository/p-cut-rm-size-prop.respository";

@Injectable()
export class PoMaterialService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoMaterialHelperService)) private helperService: PoMaterialHelperService,
    private poCutRmRepo: PCutRmRepository,
    private poCutRmSizeRepo: PCutRmSizePropRepository
  ) {

  }

  /**
   * UPDATER
   * Service to save Po materials 
   * @param req 
   * @returns 
  */
  async updatePoMaterialProps(req: PoRmUpdateRequest): Promise<GlobalResponseObject> {
    const manager = new GenericTransactionManager(this.dataSource);
    const unitCode = req.unitCode;
    const companyCode = req.companyCode;
    try {
      // check if the ratios are created
      const ratios = await this.helperService.getRatioRecordsForPo(req.poSerial, req.companyCode, req.unitCode);
      if (ratios.length > 0) {
        throw new ErrorResponse(0, "Ratios are already created. Fabric Properties cannot be modified");
      }
      await manager.startTransaction();
      for (const eachRmReq of req.rmItems) {
        const rmItemDetails = await this.poCutRmRepo.findOne({ select: ['id'], where: { id: eachRmReq.poMaterialId, isActive: true, unitCode, companyCode } });
        if (!rmItemDetails) {
          throw new ErrorResponse(0, `Rm Details not found for the given Id ${eachRmReq.poMaterialId}. Please check.`);
        }
        await manager.getRepository(PCutRmEntity).update({ id: eachRmReq.poMaterialId, unitCode, companyCode }, { maxPlies: eachRmReq.maxPlies, isMainFabric: eachRmReq.mainFabric, avgConsumption: eachRmReq.consumption, wastage: eachRmReq.wastage, isBinding: eachRmReq.isBinding, bindingConsumption: eachRmReq.bindingConsumption });
      }
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'PO Materials Saved successfully.')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  async deletePoMaterialProps(req: PoSerialRequest): Promise<GlobalResponseObject> {
    // This means we have to update all the values of all the RMs to zero. i.e maxplies, consumption, wastage, etc
    // Currently not useful. Dont implement this
    const manager = new GenericTransactionManager(this.dataSource);
    const unitCode = req.unitCode;
    const companyCode = req.companyCode;
    try {
      const rmItems = await this.poCutRmRepo.find({ where: { poSerial: req.poSerial, unitCode, companyCode } });
      if (!rmItems.length) {
        throw new ErrorResponse(0, 'RM details not found fot the given PO. Please check and try again');
      }
      await manager.startTransaction();
      await manager.getRepository(PCutRmEntity).update({ poSerial: req.poSerial, unitCode, companyCode }, { maxPlies: 0, isMainFabric: null, avgConsumption: null, wastage: null });
      await manager.getRepository(PCutRmSizePropsEntity).update({ poSerial: req.poSerial, unitCode, companyCode }, { consumption: 0, wastage: 0 });
      await manager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'PO Materials Saved successfully.')
    } catch (err) {
      await manager.releaseTransaction();
      throw err;
    }
  }

  /**
   * Service to Convert RM material Request to the Entity
   * @param req 
   * @returns 
  */
  convertRmMaterialRequestToEntity(req: PoRmUpdateRequest): PCutRmEntity[] {
    try {
      let counter = 1;
      const poRmDetails: PCutRmEntity[] = [];
      const companyCode = req.companyCode;
      const unitCode = req.unitCode;
      for (const eachRmInfo of req.rmItems) {
        const poRmEntity = new PCutRmEntity();
        poRmEntity.id = eachRmInfo?.poMaterialPk ? eachRmInfo?.poMaterialPk : null;
        poRmEntity.avgConsumption = 0;
        poRmEntity.cgName = null;
        poRmEntity.companyCode = companyCode;
        poRmEntity.componentNames = null;
        poRmEntity.refComponent = `C${counter++}`;
        poRmEntity.createdUser = req.username;
        poRmEntity.fabricCategory = null;
        poRmEntity.fgColor = eachRmInfo.fgColor;
        poRmEntity.gussetSeparation = null;
        poRmEntity.isMainFabric = false;
        poRmEntity.itemCode = eachRmInfo.iCode;
        poRmEntity.itemDesc = eachRmInfo.itemDesc;
        poRmEntity.itemName = eachRmInfo.itemName;
        poRmEntity.avgConsumption = eachRmInfo.consumption;
        poRmEntity.wastage = eachRmInfo.wastage;
        poRmEntity.pCutRmSizeProps = [];
        if (!eachRmInfo.poMaterialPk) {
          poRmEntity.pCutRmSizeProps = eachRmInfo.sizeProps.map((eachSize) => {
            const sizeEntity = new PCutRmSizePropsEntity();
            sizeEntity.companyCode = companyCode;
            sizeEntity.consumption = 0;
            sizeEntity.createdUser = req.username;
            sizeEntity.poSerial = req.poSerial;
            sizeEntity.size = eachSize.size;
            sizeEntity.unitCode = unitCode;
            sizeEntity.uom = null; // TODO: need to get confirmation
            sizeEntity.wastage = null;
            return sizeEntity;
          });
        }
        poRmEntity.patternVersion = null;
        poRmEntity.poSerial = req.poSerial;
        poRmEntity.productName = eachRmInfo.productName;
        poRmEntity.productType = eachRmInfo.productType;
        poRmEntity.purchaseWidth = null;
        poRmEntity.sequence = null;
        poRmEntity.stripMatch = null;
        poRmEntity.unitCode = unitCode;
        poRmEntity.uom = eachRmInfo.uom;
        poRmDetails.push(poRmEntity);
      }
      return poRmDetails;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Service to save Po Materials Properties with manager
   * @param req 
   * @param manager 
   * @returns 
  */
  async savePoMaterialPropsWithManager(req: PoRmUpdateRequest, manager: GenericTransactionManager): Promise<boolean> {
    try {
      // saving po related materials w.r.t product_name, product_type and fg_color
      const poCutRmEntities = this.convertRmMaterialRequestToEntity(req);
      await manager.getRepository(PCutRmEntity).save(poCutRmEntities);
      return true;
    } catch (err) {
      throw err;
    }
  }

  // saves the default RM for the PO when the PO is created
  async createPoRm(poSerial: number, poRms: PoRmItemsModel[], username: string, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
    try {
      // save records into po-cut-rm and po-cut-size-rm
      const poRmDetails: PCutRmEntity[] = [];
      for (const eachSubProduct of poRms) {
        let counter = 1;
        for (const eachRmInfo of eachSubProduct.cutRmInfo) {
          const poRmEntity = new PCutRmEntity();
          poRmEntity.avgConsumption = 0;
          poRmEntity.cgName = null;
          poRmEntity.companyCode = companyCode;
          poRmEntity.componentNames = eachRmInfo.components.toString();
          poRmEntity.refComponent = `C${counter++}`;
          poRmEntity.createdUser = username;
          poRmEntity.fabricCategory = null;
          poRmEntity.fgColor = eachSubProduct.fgColor;
          poRmEntity.gussetSeparation = null;
          poRmEntity.isMainFabric = false;
          poRmEntity.itemCode = eachRmInfo.iCode;
          poRmEntity.itemDesc = eachRmInfo.iDesc;
          poRmEntity.itemName = eachRmInfo.iName;
          poRmEntity.itemColor = '';
          poRmEntity.pCutRmSizeProps = [];
          poRmEntity.pCutRmSizeProps = eachRmInfo.sizeWiseRmProps.map((eachSize) => {
            const sizeEntity = new PCutRmSizePropsEntity();
            sizeEntity.companyCode = companyCode;
            sizeEntity.consumption = 0;
            sizeEntity.createdUser = username;
            sizeEntity.poSerial = poSerial;
            sizeEntity.size = eachSize.size;
            sizeEntity.unitCode = unitCode;
            sizeEntity.uom = eachRmInfo.uom; // TODO: need to get confirmation
            sizeEntity.wastage = null;
            return sizeEntity;
          });
          poRmEntity.patternVersion = null;
          poRmEntity.poSerial = poSerial;
          poRmEntity.productName = eachSubProduct.productName;
          poRmEntity.productType = eachSubProduct.productType;
          poRmEntity.purchaseWidth = null;
          poRmEntity.sequence = 0;
          poRmEntity.stripMatch = null;
          poRmEntity.unitCode = unitCode;
          poRmEntity.uom = eachRmInfo.uom;
          poRmDetails.push(poRmEntity);
        }
      }
      await manager.getRepository(PCutRmEntity).save(poRmDetails);
      return true;
    } catch (err) {
      throw err;
    }

  };

  async createPoRmProps(poSerial: number,  companyCode: string, unitCode: string, sizes: string[], username: string) {
    const poRmEntity = await this.poCutRmRepo.find({where: {poSerial, unitCode, companyCode}});
    const sizeProps: PCutRmSizePropsEntity[] = [];
    for (const eachPoRm of poRmEntity) {
      for (const eachSize of sizes) {
        const sizeEntity = new PCutRmSizePropsEntity();
        sizeEntity.companyCode = companyCode;
        sizeEntity.consumption = 0;
        sizeEntity.createdUser = username;
        sizeEntity.poSerial = poSerial;
        sizeEntity.size = eachSize;
        sizeEntity.unitCode = unitCode;
        sizeEntity.uom = null; // TODO: need to get confirmation
        sizeEntity.wastage = null;
        sizeEntity.poCutMaterialId = eachPoRm;
        sizeProps.push(sizeEntity);
      }
    }
    await this.poCutRmSizeRepo.save(sizeProps);
    return true;
  }


  // saves the default RM for the PO when the PO is created
  async deletePoRm(poSerial: number, manager: GenericTransactionManager, companyCode: string, unitCode: string): Promise<boolean> {
    try {
      // DELETING PO MATERIAL SIZE DETAILS
      await manager.getRepository(PCutRmSizePropsEntity).delete({ poSerial, unitCode, companyCode });
      // DELETING PO MATERIALS
      await manager.getRepository(PCutRmEntity).delete({ poSerial, unitCode, companyCode });
      return true;
    } catch (err) {
      throw err;
    }
  }

  async getRefComponentForPoAndFabric(poSerial: number, companyCode: string, unitCode: string, itemCode: string, productName: string, fgColor: string): Promise<RefComponentInfoResponse> {
    const itemDetails = await this.poCutRmRepo.findOne({where: {poSerial, companyCode, unitCode, productName, fgColor, itemCode, isActive: true}});
    if (!itemDetails) {
      throw new ErrorResponse(0 , 'Item Code details not found. Please check and try again');
    };
    const refCompDetails = new RefCompDetailModel(itemDetails.refComponent, itemDetails.componentNames.split(','))
    return new RefComponentInfoResponse(true, 0, 'Reference Component Details retrieved Successfully', refCompDetails)
  };

  async getAcComponentForPoFabricAndRefComp(poSerial: number, companyCode: string, unitCode: string, itemCode: string, productName: string, fgColor: string, refComponent: string): Promise<RefComponentInfoResponse> {
    const itemDetails = await this.poCutRmRepo.findOne({where: {poSerial, companyCode, unitCode, productName, fgColor, itemCode, refComponent, isActive: true}});
    if (!itemDetails) {
      throw new ErrorResponse(0 , 'Item Code details not found. Please check and try again');
    };
    const refCompDetails = new RefCompDetailModel(itemDetails.refComponent, itemDetails.componentNames.split(','))
    return new RefComponentInfoResponse(true, 0, 'Reference Component Details retrieved Successfully', refCompDetails)
  }

  async getRefComponentsForPoAndProduct(poSerial: number, companyCode: string, unitCode: string, productName: string, fgColor: string): Promise<RefComponentInfoResponse> {
    const itemDetails = await this.poCutRmRepo.find({where: {poSerial, companyCode, unitCode, productName, fgColor, isActive: true}});
    if (!itemDetails) {
      throw new ErrorResponse(0 , 'Item Code details not found. Please check and try again');
    };
    const recComponents = itemDetails.map(item => item.refComponent).toString();
    const actComponents = new Set<string>();
    for (const eachItem of itemDetails) {
      for (const eachComp of eachItem.componentNames.split(',')) {
        actComponents.add(eachComp);
      }
    }
    const refCompDetails = new RefCompDetailModel(recComponents, Array.from(actComponents))
    return new RefComponentInfoResponse(true, 0, 'Reference Component Details retrieved Successfully', refCompDetails)
  };

  // async getOrderColorItemWiseDetails(req: OrderNumbersRequest): Promise<OrderDataItemDetailsResponse> {
  //   const unitCode = req.unitCode;
  //   const companyCode = req.companyCode;
  //   if (!(unitCode && companyCode)) {
  //     throw new ErrorResponse(1234, 'Please send unit code and company code')
  //   }
  //   const resp = [];
  //   for (const orderNo of req.orderNo) {
  //     const getPoSerial = await this.poOrderRepo.findOne({ select: ['processingSerial'], where: { orderRefNo: orderNo, unitCode, companyCode } });
  //     if(getPoSerial){
  //       // Getting Order Info From OMS
  //       const orderInfoReq = new RawOrderNoRequest(req.username, req.unitCode, req.companyCode, req.userId, orderNo, getPoSerial.orderRefId, null, null, null, true, false, false, true, false);
  //       // console.log(orderInfoReq);
  //       const rawOrderHeaderInfo: RawOrderHeaderInfoResponse = await this.poHelperService.getRawOrderHeaderInfo(orderInfoReq);
  //       if (!rawOrderHeaderInfo.status || rawOrderHeaderInfo.data.length == 0) {
  //         throw new ErrorResponse(0, 'Order Info does not exists. Please check and try again');
  //       }
  //       const result: FabricColorAndItemInfo[] = await this.poCutRmRepo.getPoColorAndItemInformation(String(getPoSerial.poSerial), req.companyCode, req.unitCode);

  //       const orderData = rawOrderHeaderInfo.data[0]
  //       // console.log(orderData);
  //       const processedData = result.reduce((acc: Record<string, OrderItemDetailsModel>, item) => {
  //         const key = `${getPoSerial.poSerial}-${item.fg_color}-${item.product_type}-${item.product_name}-${item.item_code}`;
  //         // if (!acc[key]) {
  //         //   // acc[key] = { fg_color: item.fg_color, product_type: item.product_type, product_name: item.product_name, ratios: [], totalRequirement: 0, totalQuantity: 0, consumption: item.avg_cons };

  //         //   acc[key] = new OrderItemDetailsModel(item.createdDate, orderData?.customerName, orderData?.customerCode, orderData?.profitCenter, orderData?.profitCenterCode, orderNo, orderData?.plantStyleRef, item.fg_color, item.item_code, Number(item.avg_cons), 0, 0, 0, 0, 0, 0, 0, 0, 0, []);
  //         // }
  //         let ratioRequirement=0;
  //         if(item.wastage) {
  //           ratioRequirement = Number( (Number(item.marker_length) * Number(item.plies) * (1 + Number(item.wastage)/100)).toFixed(2) );
  //         }else{
  //           ratioRequirement = Number( (Number(item.marker_length) * Number(item.plies)).toFixed(2) );
  //         } 

  //         const ratioQuantity = item.plies * item.totratio;

  //         acc[key].ratios.push({
  //           ratioName: item.ratio_name,
  //           ratioCode: item.ratio_code,
  //           ratioRequirement,
  //           ratioQuantity,
  //         });

  //         acc[key].totalRequirement += ratioRequirement;
  //         acc[key].totalQuantity += ratioQuantity;
  //         acc[key].cuttableYy = Number((acc[key].totalRequirement / acc[key].totalQuantity).toFixed(4));
  //         acc[key].yySaving = Number((acc[key].bookingYy - acc[key].cuttableYy).toFixed(3));
  //         acc[key].yySavingPercentage = Number(((acc[key].yySaving / acc[key].bookingYy) * 100).toFixed(2));
  //         acc[key].actualYySaving = Number((acc[key].actualYy - acc[key].bookingYy).toFixed(3));
  //         acc[key].actualYySavingPercentage = Number(((acc[key].actualYy / acc[key].bookingYy) * 100).toFixed(2));
  //         return acc;
  //       }, {});
  //       resp.push(...Object.values(processedData));
  //     }
  //   }
  //   return new OrderDataItemDetailsResponse(true, 1, 'Style color and item details retrived successfully', resp);

  // }

}