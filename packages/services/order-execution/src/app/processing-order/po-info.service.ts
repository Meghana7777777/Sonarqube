import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutRmModel, MoCustomerInfoHelperModel, MoCustomerInfoHelperResponse, OES_C_PoProdColorRequest, OES_R_PoOrderQtysModel, OES_R_PoOrderQtysResponse, OES_R_PoOrderSizeQty, OpVersionModel, OqPercentageModel, OrderTypeEnum, PoLinesModel, PoProdNameModel, PoProdNameResponse, PoProdTypeAndFabResponse, PoProdutNameRequest, PoSerialRequest, PoSizeQtysModel, PoSizesModel, PoSizesResponse, PoSubLineModel, PoSummaryModel, PoSummaryResponse, ProcessingOrderSerialRequest, ProductSubLineFeatures, RawOrderNoRequest } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { PoHelperService } from "./po-helper.service";
import { ProcessingOrderRepository } from "../common/repository/processing-order.repo";
import { PoLineRepository } from "../common/repository/po-line.repo";
import { PoSubLineRepository } from "../common/repository/po-sub-line.repo";
import { ProcessingOrderEntity } from "../common/entities/processing-order-entity";
import { PoLineEntity } from "../common/entities/po-line-entity";
import { ProductSubLineFeaturesRepository } from "../common/repository/product-sub-line-features.repo";
import { ProductSubLineFeaturesEntity } from "../common/entities/product-sub-line-features-entity";
import { PoSubLineEntity } from "../common/entities/po-sub-line-entity";
const util = require('util');

@Injectable()
export class PoInfoService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PoHelperService)) private helperService: PoHelperService, // We have to put this service as a forward ref becase, this service inturn had a circular depenedncy with the PO <=> POQ
    private poRepo: ProcessingOrderRepository,
    private poLineRepo: PoLineRepository,
    private poSubLineRepo: PoSubLineRepository,
    private poSubLineFeatures: ProductSubLineFeaturesRepository
  ) {

  }

  /**
   * TO BE MODIFIED BASED ON THE INCOMING SELECTIONS
   * Service to get Po summary for given po serial number
   * @param req 
   * @returns 
  */
  async getPoSummary(req: PoSerialRequest): Promise<PoSummaryResponse> {
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      // Need to validate PO is already processed or not
      let poDetails: ProcessingOrderEntity;
      if (req.iNeedSubLines) {
        poDetails = await this.poRepo.findOne({ where: { processingSerial: req.poSerial, unitCode, companyCode } });
      } else {
        poDetails = await this.poRepo.findOne({ where: { processingSerial: req.poSerial, unitCode, companyCode } });
      }
      if (!poDetails) {
        throw new ErrorResponse(0, 'PO Does not exists please check and try again.')
      };
      const pOrderLines: PoLineEntity[] = await this.poLineRepo.find({ where: { poId: poDetails.id, unitCode, companyCode } })

      const prodTypes = new Set<string>();
      const soLines = new Set<string>();
      const orderRefNo = new Set<string>();
      const sizes = new Set<string>();
      const poLines = [];
      const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
      if (req.iNeedSubLines) {
        const orderPoLines = pOrderLines.sort((a, b) => Number(a.moLineId) - Number(b.moLineId));
        const productTypes = new Set<string>()
        const productNames = new Set<string>();
        const fgColors = new Set<string>();
        let style = '';
        const orderLineNo = new Set<string>();
        const orderLineRefNo = new Set<string>();
        for (const poLine of orderPoLines) {
          const pOrderSubLines = await this.poSubLineRepo.find({ where: { poLineId: poLine.id, unitCode, companyCode } });
          const poSubLines = [];
          for (const subLine of pOrderSubLines) {
            console.log(subLine);
            if (!poSubLineFeatures.has(subLine.moProductSubLineId)) {
              const featuresInfo = await this.poSubLineFeatures.findOne({ where: { processingSerial: req.poSerial, unitCode, companyCode, moProductSubLineId: subLine.moProductSubLineId } });
              poSubLineFeatures.set(subLine.moProductSubLineId, featuresInfo);

            };
            fgColors.add(subLine.fgColor);
            const actFeatures = poSubLineFeatures.get(subLine.moProductSubLineId);
            prodTypes.add(subLine.productType);
            productNames.add(subLine.productName);
            style = actFeatures.styleCode;
            const oqType: any = actFeatures.oqType;
            sizes.add(subLine.size);
            orderLineRefNo.add(actFeatures.moLineNumber);
            orderLineNo.add(actFeatures.moLineNumber);
            orderRefNo.add(actFeatures.moNumber);
            poSubLines.push(new PoSubLineModel(subLine.id, subLine.size, subLine.fgColor, actFeatures.schedule, subLine.quantity, actFeatures.coNumber, actFeatures.coNumber, oqType));
          }
          const poLineModel = new PoLinesModel(poLine.id, Array.from(productTypes).toString(), Array.from(productNames).toString(), Array.from(productNames).toString(), style, style, Array.from(orderLineRefNo).toString(), 0, [], null);
          poLineModel.subLines = poSubLines;
          poLines.push(poLineModel);
        }
      }
      const poSummary = new PoSummaryModel(poDetails.id, poDetails.prcOrdDescription, poDetails.processingSerial, null, Array.from(prodTypes).toString(), Array.from(orderRefNo).toString(), 0, poDetails.styleCode, poDetails.styleCode, null, Array.from(soLines), [], null, []);
      poSummary.poLines = poLines;
      console.log(sizes);
      poSummary.sizes = Array.from(sizes)
      return new PoSummaryResponse(true, 0, 'Po Summary retrieved successfully', [poSummary])
    } catch (err) {
      return err;
    }
  };

  /**
   * 
   * @param req 
   * @returns 
  */
  async getPosForMo(req: RawOrderNoRequest): Promise<PoSummaryResponse> {
    try {
      const unitCode = req.unitCode;
      const companyCode = req.companyCode;
      const processingSerialsForMo = await this.poSubLineFeatures.find({ where: { moNumber: req.salOrdLineNo, unitCode, companyCode }, select: ['processingSerial'] });
      const allProcessingOrders = processingSerialsForMo.map(po => po.processingSerial);
      const poSummary = [];
      for (const eachPo of allProcessingOrders) {
        const poDetails = await this.poRepo.find({ where: { processingSerial: eachPo, unitCode, companyCode } });
        if (!poDetails) {
          throw new ErrorResponse(0, 'PO Does not exists please check and try again.')
        };
        const poSerialReq = new PoSerialRequest(req.username, unitCode, companyCode, req.userId, eachPo, 0, req.iNeedSoLines, false);
        const poSummaryResp = await this.getPoSummary(poSerialReq);
        poSummary.push(poSummaryResp.data[0]);
      };
      return new PoSummaryResponse(true, 0, 'Po Summary retrieved successfully', poSummary)
    } catch (err) {
      return err;
    }
  }

  /**
   * Service to get Only Basic Information regarding a po serial. It does not include child properties. 
   * @param poSerial 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getPoBasicInfoByPoSerial(poSerial: number, unitCode: string, companyCode: string): Promise<PoSummaryResponse> {
    // Need to validate PO is already processed or not
    const poDetails = await this.poRepo.findOne({ where: { processingSerial: poSerial, unitCode, companyCode } });
    if (!poDetails) {
      throw new ErrorResponse(0, 'PO Does not exists please check and try again.')
    };
    const pOrderLines: PoLineEntity[] = await this.poLineRepo.find({ where: { poId: poDetails.id, unitCode, companyCode } })
    const soLines: string[] = [];
    pOrderLines.forEach(p => soLines.push(p.moLineNumber));
    const productTypes = new Set<string>();
    const orderRefNos = new Set<string>();
    const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
    for (const eachLine of pOrderLines) {
      const subLineInfo = await this.poSubLineRepo.find({ where: { poLineId: eachLine.id, unitCode, companyCode } });
      for (const eachSubLine of subLineInfo) {
        if (!poSubLineFeatures.has(eachSubLine.moProductSubLineId)) {
          const featuresInfo = await this.poSubLineFeatures.findOne({ where: { unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId } });
          poSubLineFeatures.set(eachSubLine.moProductSubLineId, featuresInfo);

        };
        const actFeatures = poSubLineFeatures.get(eachSubLine.moProductSubLineId);
        productTypes.add(eachSubLine.productType);
        orderRefNos.add(actFeatures.moNumber)
      }


    }
    const poSummary = new PoSummaryModel(poDetails.id, poDetails.prcOrdDescription, poDetails.processingSerial, null, Array.from(productTypes).toString(), Array.from(orderRefNos).toString(), 0, null, null, null, soLines, [], [], []);
    return new PoSummaryResponse(true, 0, 'Po Summary retrieved successfully', [poSummary])
  }

  // /**
  //  * Service to get PO LINE id by order line Id
  //  * @param soLineId 
  //  * @param poSerial 
  //  * @param unitCode 
  //  * @param companyCode 
  //  * @returns 
  // */
  // async getPoLineIdByMoOrderLine(soLineId: number, poSerial: number, unitCode: string, companyCode: string) {
  //   return await this.poLineRepo.findOne({ select: ['id'], where: { poSerial, orderLineReId: soLineId, unitCode, companyCode } });
  // }

  /**
   * HELPER
   * @param poSerial 
   * @param unitCode 
   * @param companyCode 
   */
  async getPoLinesBasicInfoByPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<PoLinesModel[]> {
    const poLineModels: PoLinesModel[] = [];
    const poLines = await this.poLineRepo.find({ where: { processingSerial: poSerial, unitCode, companyCode } });
    const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
    for (const poLine of poLines) {
      const productTypes = new Set<string>();
      const orderRefNos = new Set<string>();
      const subLineInfo = await this.poSubLineRepo.find({ where: { poLineId: poLine.id, unitCode, companyCode } });
      let style = '';
      for (const eachSubLine of subLineInfo) {
        if (!poSubLineFeatures.has(eachSubLine.moProductSubLineId)) {
          const featuresInfo = await this.poSubLineFeatures.findOne({ where: { unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId } });
          poSubLineFeatures.set(eachSubLine.moProductSubLineId, featuresInfo);

        };
        const actFeatures = poSubLineFeatures.get(eachSubLine.moProductSubLineId);
        productTypes.add(eachSubLine.productType);
        orderRefNos.add(actFeatures.moNumber);
        style = actFeatures.styleCode;
        const findProductObj = poLineModels.find(pl => pl.productName == eachSubLine.productName && pl.color == eachSubLine.fgColor);
        if (!findProductObj) {
          const poLineModel = new PoLinesModel(poLine.id, eachSubLine.productType, eachSubLine.productName, eachSubLine.fgColor, style, style, poLine.moLineNumber, null, [], null);
          poLineModels.push(poLineModel);
        } else {
          findProductObj.subLines.push(new PoSubLineModel(eachSubLine.id, eachSubLine.size, eachSubLine.fgColor, actFeatures.schedule, eachSubLine.quantity, null, actFeatures.coNumber, actFeatures.oqType))
        }

      }

    }
    return poLineModels;
  }

  /**
   * HELPER
   * @param poSerial 
   * @param companyCode 
   * @param unitCode 
   */
  async getFabricLevelOqtysForPo(poSerial: number, companyCode: string, unitCode: string): Promise<Map<string, Map<string, Map<string, Map<string, PoSizeQtysModel[]>>>>> {
    // Product name -> fg color -> item code -> component -> PoSizeQtysModel of that product name + fg color
    const fabOqMap = new Map<string, Map<string, Map<string, Map<string, PoSizeQtysModel[]>>>>();
    // The product name wise order qtys map
    const prodNameQtysMap = new Map<string, Map<string, Map<string, PoSizeQtysModel>>>(); // productname => size => PoSizeQtysModel;
    const poLines = await this.poLineRepo.find({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, processingSerial: poSerial, isActive: true } });
    for (const line of poLines) {
      const subLineInfo = await this.poSubLineRepo.find({ where: { poLineId: line.id, unitCode, companyCode } });
      for (const eachSubLine of subLineInfo) {
        if (!prodNameQtysMap.has(eachSubLine.productName)) {
          prodNameQtysMap.set(eachSubLine.productName, new Map<string, Map<string, PoSizeQtysModel>>());
        }
        if (!prodNameQtysMap.get(eachSubLine.productName).has(eachSubLine.fgColor)) {
          prodNameQtysMap.get(eachSubLine.productName).set(eachSubLine.fgColor, new Map<string, PoSizeQtysModel>());
        };
        if (!prodNameQtysMap.get(eachSubLine.productName).get(eachSubLine.fgColor).has(eachSubLine.size)) {
          prodNameQtysMap.get(eachSubLine.productName).get(eachSubLine.fgColor).set(eachSubLine.size, new PoSizeQtysModel(eachSubLine.size, 0, 0, 0))
        };
        prodNameQtysMap.get(eachSubLine.productName).get(eachSubLine.fgColor).get(eachSubLine.size).originalQuantity += Number(eachSubLine.quantity);
      }
    };
    console.log('***************')
    console.log(util.inspect(prodNameQtysMap, false, null, true));
    console.log('***************')
    // Now iterate all the product names => fabrics. And based on the product name attached to the fabric, simply accumulate the values
    const poCutRm: CutRmModel[] = await this.helperService.getPoCutFabInfoForPo(poSerial, companyCode, unitCode);
    poCutRm.forEach(r => {
      const prodName = `${r.productName}`;
      const itemCode = r.iCode;
      const comps = r.components;
      if (!fabOqMap.has(r.productName)) {
        fabOqMap.set(r.productName, new Map<string, Map<string, Map<string, PoSizeQtysModel[]>>>());
      }
      if (!fabOqMap.get(r.productName).has(r.fgColor)) {
        fabOqMap.get(r.productName).set(r.fgColor, new Map<string, Map<string, PoSizeQtysModel[]>>());
      }
      if (!fabOqMap.get(r.productName).get(r.fgColor).has(itemCode)) {
        fabOqMap.get(r.productName).get(r.fgColor).set(itemCode, new Map<string, PoSizeQtysModel[]>());
      }
      comps.forEach(comp => {
        if (!fabOqMap.get(r.productName).get(r.fgColor).get(itemCode).has(comp)) {
          fabOqMap.get(r.productName).get(r.fgColor).get(itemCode).set(comp, []);
        }
        const refMap = fabOqMap.get(r.productName).get(r.fgColor).get(itemCode).get(comp);
        const prodNameQtys = prodNameQtysMap.get(r.productName).get(r.fgColor);
        prodNameQtys.forEach((qtyModel, size) => {
          // push this as a clone, else this will push the same reference for multiple components. Thus resulting in the data change in many objects instead of for a specific component object
          refMap.push(JSON.parse(JSON.stringify(qtyModel)));
        })
      });
    });
    return fabOqMap;
  }

  /**
   * READER
   * gets the po line and size qtys
   * @param req 
   */
  async getPoLineLevelSizeQtys(req: PoSerialRequest): Promise<PoSizesResponse> {
    const { unitCode, companyCode } = req;
    const poSizeModels: PoSizesModel[] = [];
    const productTypes = new Set<string>();
    const productNames = new Set<string>();
    const poLines = await this.poLineRepo.find({ select: ['id'], where: { processingSerial: req.poSerial, unitCode: req.unitCode, companyCode: req.companyCode } });
    const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
    for (const poLine of poLines) {
      const sizeModels: PoSizeQtysModel[] = [];
      // a map that holds the size level PoSizeQtysModel to accumulate the qtys if more records exist for same size
      const addQtyMap = new Map<string, PoSizeQtysModel>(); // size => PoSizeQtysModel
      const poSizeQtys = await this.poSubLineRepo.getPoSizeWiseQtys(req.poSerial, poLine.id, req.companyCode, req.unitCode);
      // Iterate all the size qtys and construct the size wise org and add qty objects
      poSizeQtys.forEach(r => {
        if (!addQtyMap.has(r.size)) {
          addQtyMap.set(r.size, new PoSizeQtysModel(r.size, 0, 0, 0));
        }
        if (r.oq_type == OrderTypeEnum.ORIGINAL) {
          addQtyMap.get(r.size).originalQuantity += Number(r.quantity);
        } else {
          addQtyMap.get(r.size).addQuantity += Number(r.quantity);
        }
      });
      addQtyMap.forEach(r => {
        sizeModels.push(r);
      });
      const subLineInfo = await this.poSubLineRepo.find({ where: { poLineId: poLine.id, unitCode, companyCode } });
      for (const eachSubLine of subLineInfo) {
        if (!poSubLineFeatures.has(eachSubLine.moProductSubLineId)) {
          const featuresInfo = await this.poSubLineFeatures.findOne({ where: { unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId } });
          poSubLineFeatures.set(eachSubLine.moProductSubLineId, featuresInfo);

        };
        const actFeatures = poSubLineFeatures.get(eachSubLine.moProductSubLineId);
        productTypes.add(eachSubLine.productType);
        productNames.add(actFeatures.moNumber);
      }
      const poLineModel = new PoSizesModel(poLine.id, req.poSerial, Array.from(productTypes).toString(), Array.from(productNames).toString(), sizeModels);
      poSizeModels.push(poLineModel);
    }
    return new PoSizesResponse(true, 0, 'Po sizes retrieved', poSizeModels);
  }


  /**
   * READER
   * @param req 
   */
  async getPoProductNames(req: PoSerialRequest): Promise<PoProdNameResponse> {
    const { unitCode, companyCode } = req;
    const poLines = await this.poLineRepo.find({ where: { processingSerial: req.poSerial, companyCode: req.companyCode, unitCode: req.unitCode } });
    if (poLines.length == 0) {
      throw new ErrorResponse(0, 'Po lines does not exist');
    }
    // a Map of product name => the props
    // Product Code/ name -> fg color -> product type
    const prodNameInfoMap = new Map<string, Map<string, string>>()
    for (const r of poLines) {
      const subLineInfo = await this.poSubLineRepo.find({ where: { poLineId: r.id, unitCode, companyCode } });
      for (const eachSubLine of subLineInfo) {
        if (!prodNameInfoMap.has(eachSubLine.productCode)) {
          prodNameInfoMap.set(eachSubLine.productCode, new Map<string, string>())
        }
        if (!prodNameInfoMap.get(eachSubLine.productCode).has(eachSubLine.fgColor)) {
          prodNameInfoMap.get(eachSubLine.productCode).set(eachSubLine.fgColor, eachSubLine.productType);
        }
      }
    }
    const poProdNamesModels: PoProdNameModel[] = [];
    // for each prod type construct the response
    for (const [prodName, props] of prodNameInfoMap) {
      const poCutRm = await this.helperService.getPoCutFabInfoForPo(req.poSerial, req.companyCode, req.unitCode, prodName);
      for (const [fgColor, prodType] of props) {
        const comps = new Set<string>();
        poCutRm.forEach(r => r.components.forEach(c => { comps.add(c) }));
        const opsReq = new PoProdutNameRequest(null, req.unitCode, req.companyCode, null, req.poSerial, prodName, fgColor, false);
        const opsVersion = await this.helperService.getOpVersionIdForPoProductName(opsReq);
        const poProdNameModel = new PoProdNameModel(req.poSerial, prodType, prodName, fgColor, Array.from(comps), opsVersion);
        poProdNamesModels.push(poProdNameModel);
      }

    }
    return new PoProdNameResponse(true, 0, 'Po prod names retrieved', poProdNamesModels);
  }


  // HELPER
  async getPoLinesRecordsByPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<PoLineEntity[]> {
    const poLines = await this.poLineRepo.find({ where: { processingSerial: poSerial, unitCode, companyCode } });
    return poLines;
  }

  // HELPER
  async getPoSubLineRecordsForPoLineId(poSerial: number, pOrderLineId: number, companyCode: string, unitCode: string): Promise<PoSubLineEntity[]> {
    const poSubLines = await this.poSubLineRepo.find({ select: ['fgColor', 'size', 'processingSerial', 'quantity'], where: { processingSerial: poSerial, poLineId: pOrderLineId, unitCode, companyCode } });
    return poSubLines;
  }

  async getPoSummaryInfoForPoSerial(req: ProcessingOrderSerialRequest): Promise<PoSummaryResponse> {
    const { userId, username, unitCode, companyCode } = req;
    const poSummaryInfo: PoSummaryModel[] = [];
    for (const eachPo of req.processingSerial) {
      const req = new PoSerialRequest(username, unitCode, companyCode, userId, eachPo, null, true, true)
      const poSummary = await this.getPoSummary(req);
      poSummaryInfo.push(...poSummary.data)
    }
    return new PoSummaryResponse(true, 0, 'Summary Info Retrieved Successfully', poSummaryInfo)
  }


  async getMoCustomerPoInfoForPoSerial(poSerial: number, companyCode: string, unitCode: string): Promise<MoCustomerInfoHelperResponse> {
    const moCoInfo: MoCustomerInfoHelperModel[] = [];
    const productFgColorSubLineMap = new Map<string, Map<string, PoSubLineEntity[]>>();
    const subLineInfo = await this.poSubLineRepo.find({ where: { processingSerial: poSerial, unitCode, companyCode, isActive: true } });
    if (!subLineInfo.length) {
      throw new ErrorResponse(0, 'Sub Lines Not found for the given po serial. Please check and try again')
    };
    const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
    for (const eachSuLine of subLineInfo) {
      if (!productFgColorSubLineMap.has(eachSuLine.productName)) {
        productFgColorSubLineMap.set(eachSuLine.productName, new Map<string, PoSubLineEntity[]>());
      }
      if (!productFgColorSubLineMap.get(eachSuLine.productName).has(eachSuLine.fgColor)) {
        productFgColorSubLineMap.get(eachSuLine.productName).set(eachSuLine.fgColor, [])
      };
      productFgColorSubLineMap.get(eachSuLine.productName).get(eachSuLine.fgColor).push(eachSuLine);
    };
    for (const [productName, productInfo] of productFgColorSubLineMap) {
      for (const [fgColor, subLines] of productInfo) {
        const coNo = new Set<string>();
        const exFactory = new Set<string>(); // YYYY-MM-DD
        const customerCode = new Set<string>();
        const customerName = new Set<string>();
        const styleCode = new Set<string>();
        const styleDesc = new Set<string>();
        const moNo = new Set<string>();
        const moLine = new Set<string>();
        const buyerPoNumber = new Set<string>();
        let quantity: number = 0;
        const productType = new Set<string>(); // To be add
        let plantStyle: string = '';
        for (const eachSubLine of subLines) {
          quantity += eachSubLine.quantity;
          if (!poSubLineFeatures.has(eachSubLine.moProductSubLineId)) {
            const featuresInfo = await this.poSubLineFeatures.findOne({ where: { unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId } });
            poSubLineFeatures.set(eachSubLine.moProductSubLineId, featuresInfo);

          };
          const actFeatures = poSubLineFeatures.get(eachSubLine.moProductSubLineId);
          coNo.add(actFeatures.coNumber);
          exFactory.add(actFeatures.exFactoryDate);
          customerCode.add(actFeatures.customerCode);
          customerName.add(actFeatures.customerName);
          styleCode.add(actFeatures.styleCode);
          styleDesc.add(actFeatures.styleDescription);
          moNo.add(actFeatures.moNumber);
          moLine.add(actFeatures.moLineNumber);
          buyerPoNumber.add(actFeatures.coNumber); // TODO: need to change
          productType.add(eachSubLine.productType);
          plantStyle = actFeatures.styleCode;
        };
        const coInfo = new MoCustomerInfoHelperModel(Array.from(coNo).toString(), productName, fgColor, Array.from(exFactory).toString(), Array.from(customerCode).toString(), Array.from(customerName).toString(), Array.from(styleCode).toString(), Array.from(styleDesc).toString(), Array.from(moNo).toString(), Array.from(moLine).toString(), Array.from(buyerPoNumber).toString(), null, null, null, quantity, null, Array.from(productType).toString());
        moCoInfo.push(coInfo);
      };
    }
    return new MoCustomerInfoHelperResponse(true, 0, 'Mo Info Retrieved Successfully', moCoInfo);
  }



  async getCutOrderQtysForPoProdColor(req: OES_C_PoProdColorRequest): Promise<OES_R_PoOrderQtysResponse>{ 
    const { companyCode, unitCode, prodName, poSerial, color } = req;
    
    const orderQtys = await this.poSubLineRepo.find({select: ['size', 'quantity', 'moProductSubLineId'], where: {processingSerial: poSerial, unitCode, companyCode}});
    const pslIds = orderQtys.map(r => r.moProductSubLineId);
    const pslProps = await this.poSubLineFeatures.find({select: ['oqType', 'size', 'moProductSubLineId'], where: {companyCode, unitCode, moProductSubLineId: In(pslIds)}});
    const pslPropsMap = new Map<number, {size: string, oqType: OrderTypeEnum}>();
    pslProps.forEach(r => {
      pslPropsMap.set(Number(r.moProductSubLineId), {size: r.size, oqType: r.oqType});
    });
    const m1s: OES_R_PoOrderSizeQty[] = [];
    orderQtys.forEach(r => {
      const prop = pslPropsMap.get(Number(r.moProductSubLineId));
      const m1 = new OES_R_PoOrderSizeQty(prop.oqType, prop.size, Number(r.quantity), Number(r.moProductSubLineId));
      m1s.push(m1);
    });
    const m2 = new OES_R_PoOrderQtysModel(poSerial, prodName, color, m1s);
    return new OES_R_PoOrderQtysResponse(true, 0, 'Order qtys retrieved', [m2]);
  }
}