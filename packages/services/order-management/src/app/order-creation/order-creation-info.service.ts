import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, GlobalResponseObject, MOHeaderInfoModelResponse, MOPreviewResponse, MOSummaryBomInfo, MOSummaryColorSizes, MOSummaryPreviewResponse, MO_R_OslBundlesModel, MO_R_OslBundlesResponse, MO_R_OslProcTypeBundlesModel, ManufacturingOrderPreviewData, MoConfigStatusEnum, MoNumberDropdownModel, MoNumberDropdownResponse, MoPreviewColorWiseSizes, MoPreviewMoLine, MoProductStatusEnum, MoSummaryPreviewData, OrderFeatures, ProcessTypeEnum, ProductsIdRequest, RawOrderHeaderInfoModel, RawOrderHeaderInfoResponse, RawOrderInfoModel, RawOrderInfoResponse, RawOrderLineInfoModel, RawOrderLineRmModel, RawOrderNoRequest, RawOrderOpInfoModel, RawOrderSubLineInfoModel, RmItemSubTypeEnum, RmItemTypeEnum, SI_ManufacturingOrderInfoAbstractResponse, SI_ManufacturingOrderInfoModel, SI_ManufacturingOrderInfoResponse, SI_ManufacturingOrderLineInfoResponse, SI_MoAttributesModel, SI_MoLineAttributesModel, SI_MoLineIdRequest, SI_MoLineInfoModel, SI_MoLineProdAttributesModel, SI_MoLineProductInfoResponse, SI_MoLineProductModel, SI_MoNumberRequest, SI_MoOrderSubLineIdsRequest, SI_MoProdAttributesModel, SI_MoProdSubLineInfoResponse, SI_MoProdSubLineModel, SI_MoProductIdRequest, SI_MoProductOpModel, SI_MoProductOpRmModel, SI_MoProductRmModel, SI_MoProductSubLineIdsRequest, SI_MoRmModel, SI_ProductInfoResponse, StyleCodeRequest, StyleProductFgColorResp } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { PslOpRawMaterialRepository } from "../repository/psl-opearation-rm.repository";
import { PslOperationRepository } from "../repository/psl-operation.repository";
import { RawMaterialInfoRepository } from "../repository/rm-info.repository";
import moment = require("moment");
// import { MoLineProductRepository } from "../repository/so-line-product.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { MoLineProductRepository } from "../repository/mo-line-product.repository";
import { MoLineRepository } from "../repository/mo-line.repository";
import { MoPoBundleRepository } from "../repository/mo-po-bundle.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { SoInfoRepository } from "../repository/so-info-repository";
import { ProductSharedService } from "@xpparel/shared-services";

@Injectable()
export class OrderCreationInfoService {
  constructor(
    private dataSource: DataSource,
    private moInfoRepo: MoInfoRepository,
    private moLineRepo: MoLineRepository,
    private moLineProductRepo: MoLineProductRepository,
    private moProductSubLineRepo: MoProductSubLineRepository,
    private pslOpRepo: PslOperationRepository,
    private pslOpRmRepo: PslOpRawMaterialRepository,
    private rmInfoRepo: RawMaterialInfoRepository,
    private soInfoRepo: SoInfoRepository,
    private moPoBundleRepo: MoPoBundleRepository,
    private productService: ProductSharedService,


  ) {
  }

  // called from UI
  async getManufacturingOrdersList(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoAbstractResponse> {
    // get only the SI_ManufacturingOrderInfoAbstractModel
    const manufacturingOrders = await this.moInfoRepo.getManufacturingOrdersList(req.companyCode, req.unitCode)
    return new SI_ManufacturingOrderInfoAbstractResponse(true, 0, "Manufacturing Orders Fetched Successfully", manufacturingOrders);
  }

  async getMoInfoHeader(req: SI_MoProductIdRequest): Promise<MOHeaderInfoModelResponse> {
    const moInfoHeader = await this.moInfoRepo.getMoInfoHeader(req.moNumber, req.companyCode, req.unitCode);
    return new MOHeaderInfoModelResponse(true, 0, "Data fetched succesfully", moInfoHeader)
  }
  // called from UI
  async getUnConfirmedManufacturingOrdersInfo(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoResponse> {
    // get only the order that are not confirmed
    const unConfirmedManufacturingOrders: SI_ManufacturingOrderInfoModel[] = await this.moInfoRepo.getmanufacturingOrderInfoByStatus(req.companyCode, req.unitCode, false)
    const manufacturingOrders: SI_ManufacturingOrderInfoModel[] = []
    for (const unCoOrder of unConfirmedManufacturingOrders) {
      const order = new SI_MoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, unCoOrder?.moNumber, unCoOrder.moPk, false, false, true, true, true, false, false, false, false, true, false)

      const eachOrder = await this.getOrderInfoByManufacturingOrderNo(order);
      manufacturingOrders.push(eachOrder.data[0])
    }
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'UnConfirmed Manufacturing Orders Fetched Successfully', manufacturingOrders);
  }

  // called from UI
  async getConfirmedManufacturingOrdersInfo(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoResponse> {
    // get only the order that are not confirmed. same code as in getUnConfirmedManufacturingOrdersInfo. Reuse.. dont copy the code
    const confirmedManufacturingOrders: SI_ManufacturingOrderInfoModel[] = await this.moInfoRepo.getmanufacturingOrderInfoByStatus(req.companyCode, req.unitCode, true)
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'UnConfirmed Manufacturing Orders Fetched Successfully', confirmedManufacturingOrders);
  }

  // called from UI
  async getOrderInfoByManufacturingOrderNo(req: SI_MoNumberRequest): Promise<SI_ManufacturingOrderInfoResponse> {
    const manufacturingOrder = await this.moInfoRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, moNumber: req?.moNumber } })
    const MoLines: SI_MoLineInfoModel[] = [];
    let moAttrs: SI_MoAttributesModel = null;
    let moRm: SI_MoRmModel[] = []

    if (req.iNeedMoAttrs) {
      moAttrs = await this.moInfoRepo.getMoAttributesByManufacturingOrderNo(req?.moNumber, req.unitCode, req.companyCode);
    }
    if (req.iNeedMoRm) {
      moRm = await this.rmInfoRepo.getMoRmByManufacturingOrderNo(req?.moNumber, req.unitCode, req.companyCode);
    }
    if (req.iNeedMoLines) {
      const ManufacturingOrderLines = await this.moLineRepo.find({ where: { moNumber: req?.moNumber, companyCode: req.companyCode, unitCode: req.unitCode } })

      for (const orderLine of ManufacturingOrderLines) {
        const lineProducts: SI_MoLineProductModel[] = [];
        let lineAttrs: SI_MoLineAttributesModel = null

        if (req.iNeedMoLineAttr) {
          lineAttrs = await this.moInfoRepo.getMoLineAttrsByMOLineNumber(req?.moNumber, orderLine.moLineNumber, req.companyCode, req.unitCode)
        }


        if (req.iNeedMoProd) {
          const manufacturingOrderLineProducts = await this.moLineProductRepo.find({ where: { moNumber: req?.moNumber, moLineNumber: orderLine.moLineNumber, companyCode: req.companyCode, unitCode: req.unitCode } })
          for (const lineProduct of manufacturingOrderLineProducts) {
            const productSubLines: SI_MoProdSubLineModel[] = []
            let rmInfo: SI_MoProductRmModel[] = []
            let opInfo: SI_MoProductOpModel[] = []
            let opRmInfo: SI_MoProductOpRmModel[] = []
            let moLineProductAttrs: SI_MoLineProdAttributesModel = null

            if (req.iNeedMoProdAttrs) {
              moLineProductAttrs = await this.moInfoRepo.getMoLineProdAttrsByMoProdName(req?.moNumber, orderLine.moLineNumber, lineProduct.productName, req.companyCode, req.unitCode)
            }

            if (req.iNeedProductRm) {
              rmInfo = await this.moProductSubLineRepo.getRmInfoByProductId(lineProduct.id, req.companyCode, req.unitCode)

            }

            if (req.iNeedProductOps) {
              opInfo = await this.moProductSubLineRepo.getOpInfoByProductId(lineProduct.id, req.companyCode, req.unitCode)
            }

            if (req.iNeedProductOpRm) {
              const pslOps = await this.moProductSubLineRepo.getOpInfoByProductId(lineProduct.id, req.companyCode, req.unitCode)
              for (const op of pslOps) {
                const bomInfo: SI_MoProductRmModel[] = await this.pslOpRmRepo.getBomInfoByOpCode(req?.moNumber, op.opCode, req.companyCode, req.unitCode);

                for (const eachBom of bomInfo) {
                  const eachOpRmData = new SI_MoProductOpRmModel(op.opCode, op.processType, eachBom)
                  opRmInfo.push(eachOpRmData)
                }


              }
            }

            if (req.iNeedMoSubLines) {
              const ordersSubLines = await this.moProductSubLineRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, moLineProductId: lineProduct.id } })

              for (const subLine of ordersSubLines) {

                let subLineAttrs = null  //TODO
                if (req.iNeedMoSubLineAttrs) {
                  subLineAttrs = await this.moInfoRepo.getMoSubLineAttrsBySubLineId(req?.moNumber, orderLine.moLineNumber, lineProduct.productName, subLine.id, req.companyCode, req.unitCode)
                }
                const eachSublineData = new SI_MoProdSubLineModel(subLine.fgColor, subLine.size, subLine.quantity, subLineAttrs, subLine.id, subLine.oQType);
                productSubLines.push(eachSublineData);

              }
            }
            const productColors = [...new Set(productSubLines?.map((subLine) => subLine.color))].join(', ')
            const eachLineProductData = new SI_MoLineProductModel(orderLine.moLineNumber, manufacturingOrder?.moNumber, lineProduct.productName, productColors, productSubLines, rmInfo, opInfo, opRmInfo, moLineProductAttrs, lineProduct.productCode, lineProduct.productType);
            lineProducts.push(eachLineProductData);
          }

        }


        const eachLineData = new SI_MoLineInfoModel(orderLine.moLineNumber, orderLine.id, manufacturingOrder.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, lineProducts, lineAttrs);
        MoLines.push(eachLineData);
      }
    }
    const orderInfo = new SI_ManufacturingOrderInfoModel(manufacturingOrder?.moNumber, manufacturingOrder.id, manufacturingOrder.isConfirmed === 0 ? false : true, manufacturingOrder.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, manufacturingOrder.moProceedingStatus, manufacturingOrder.style, manufacturingOrder.uploadedDate, MoLines, moAttrs, moRm)
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'Manufacturing Order Info Fetched Successfully', [orderInfo]);
  }

  // called from UI
  async getOrderLineInfoByMoLineId(req: SI_MoLineIdRequest): Promise<SI_ManufacturingOrderLineInfoResponse> {

    return null;
  }

  // called from UI
  async getOrderProductInfoByMoProductId(req: SI_MoProductIdRequest): Promise<SI_MoLineProductInfoResponse> {

    return null;
  }

  // called from UI
  async getOrderSubLineInfoByMoSubLinesIds(req: SI_MoOrderSubLineIdsRequest): Promise<SI_MoProdSubLineInfoResponse> {

    return null;
  }

  async getOrderProductInfoByMoPk(req: SI_MoProductIdRequest): Promise<SI_ProductInfoResponse> {
    // gets the products under the MO. If mo is provided, then we will get all the products under the MO
    // If MO product pk is provided, then only that specific product is returned

    //   moProductPk: number; // Pk of the order products
    // moNumber: string; // u can pass this one or the moPk
    // moPk: number; // u can pass this one or the moNumber

    // iNeedMoProdAttrs: boolean;
    // iNeedProductRm: boolean;
    // iNeedProductOps: boolean;
    // iNeedProductOpRm: boolean;
    // iNeedMoSubLines: boolean;
    // iNeedMoSubLineAttrs: boolean;



    //  moNumber: string;
    //   productName: string;
    //   fgColor: string;
    //   subLines: SI_MoProdSubLineModel[];
    //   rmInfo: SI_MoProductRmModel[];
    //   opInfo: SI_MoProductOpModel[];
    //   opRmInfo: SI_MoProductOpRmModel[];
    //   moProdcutAttrs: SI_MoProdAttributesModel;
    const subLines: SI_MoProdSubLineModel[] = [];
    let rmInfo: SI_MoProductRmModel[] = [];
    let opInfo: SI_MoProductOpModel[] = [];
    const opRmInfo: SI_MoProductOpRmModel[] = [];
    let moProdcutAttrs: SI_MoProdAttributesModel = null
    if (req.iNeedMoSubLines) {
      const ordersSubLines = await this.moProductSubLineRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, moLineProductId: req.moProductPk } })

      for (const subLine of ordersSubLines) {

        const subLineAttrs = null  //TODO
        const eachSublineData = new SI_MoProdSubLineModel(subLine.fgColor, subLine.size, subLine.quantity, subLineAttrs, subLine.id, subLine.oQType);
        subLines.push(eachSublineData);

      }

    }

    if (req.iNeedProductRm) {
      rmInfo = await this.moProductSubLineRepo.getRmInfoByProductId(req.moProductPk, req.companyCode, req.unitCode)
    }

    if (req.iNeedProductOps) {
      opInfo = await this.moProductSubLineRepo.getOpInfoByProductId(req.moProductPk, req.companyCode, req.unitCode)
    }

    if (req.iNeedProductOpRm) {
      const pslOps = await this.moProductSubLineRepo.getOpInfoByProductId(req.moProductPk, req.companyCode, req.unitCode)
      for (const op of pslOps) {
        const bomInfo: SI_MoProductRmModel[] = await this.pslOpRmRepo.getBomInfoByOpCode(req?.moNumber, op.opCode, req.companyCode, req.unitCode);
        for (const eachBom of bomInfo) {
          const eachOpRmData = new SI_MoProductOpRmModel(op.opCode, op.processType, eachBom)
          opRmInfo.push(eachOpRmData)
        }
      }
    }


    // if (req.iNeedMoProdAttrs) {
    //   moProdcutAttrs = await this.moInFoRepo.getMoLineProdAttrsByMoProdName(req?.moNumber, orderLine.moLineNumber, lineProduct.productName, req.companyCode, req.unitCode)
    // }
    return null;
  }

  /**
   * Service to get distinct product fg color info ror MO
   * @param reqModel 
   * @returns 
  */
  async getDistinctProductFgColorInfoForMO(reqModel: SI_MoNumberRequest): Promise<StyleProductFgColorResp> {
    const styleProdInfo = await this.moProductSubLineRepo.getStyleProductColorInfoForMO(reqModel?.moNumber, reqModel.unitCode, reqModel.companyCode)
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: reqModel.moNumber, companyCode: reqModel.companyCode, unitCode: reqModel.unitCode } })
    styleProdInfo.forEach((each) => {
      each.isMoConfirmed = moInfo.isConfirmed == 1 ? true : false
      each.isMoProceeded = moInfo.moProceedingStatus

    })
    return new StyleProductFgColorResp(true, 0, 'Service to get distinct product info for given mo number', styleProdInfo)

  }


  async getOrderInfoByManufacturingOrderProductCodeFgColor(req: SI_MoNumberRequest): Promise<SI_ManufacturingOrderInfoResponse> {
    const manufacturingOrder = await this.moInfoRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, moNumber: req?.moNumber } })
    let MoLines: SI_MoLineInfoModel[] = [];
    let moAttrs: SI_MoAttributesModel = null;
    let moRm: SI_MoRmModel[] = []

    if (req.iNeedMoAttrs) {
      moAttrs = await this.moInfoRepo.getMoAttributesByManufacturingOrderNoProductCodeFgColor(req?.moNumber, req.productCode, req.fgColor, req.unitCode, req.companyCode);
    }
    if (req.iNeedMoRm) {
      moRm = await this.moProductSubLineRepo.getMoRmByManufacturingOrderNoProductCodeFgColor(req?.moNumber, req.productCode, req.fgColor, req.unitCode, req.companyCode);
      moRm = moRm.filter((rm)=>!!rm.itemCode)
    }
    if (req.iNeedMoLines) {
      const ManufacturingOrderLines = await this.moLineRepo.getMoLinesByProductCodeFgColor(req.moNumber, req.productCode, req.fgColor, req.companyCode, req.unitCode)
      for (const orderLine of ManufacturingOrderLines) {
        const lineProducts: SI_MoLineProductModel[] = [];
        let lineAttrs: SI_MoLineAttributesModel = null

        if (req.iNeedMoLineAttr) {
          lineAttrs = await this.moInfoRepo.getMoLineAttrsByMOLineNumberProductCodeFgColor(req?.moNumber, req.productCode, req.fgColor, orderLine.moLineNumber, req.companyCode, req.unitCode)
        }


        if (req.iNeedMoProd) {
          const manufacturingOrderLineProducts = await this.moLineProductRepo.find({ where: { moNumber: req?.moNumber, moLineNumber: orderLine.moLineNumber, productCode: req.productCode, companyCode: req.companyCode, unitCode: req.unitCode } })
          for (const lineProduct of manufacturingOrderLineProducts) {
            const productSubLines: SI_MoProdSubLineModel[] = []
            let rmInfo: SI_MoProductRmModel[] = []
            let opInfo: SI_MoProductOpModel[] = []
            let opRmInfo: SI_MoProductOpRmModel[] = []
            let moLineProductAttrs: SI_MoLineProdAttributesModel = null

            if (req.iNeedMoProdAttrs) {
              moLineProductAttrs = await this.moInfoRepo.getMoLineProdAttrsByMoProdNameProductCodeFgColor(req?.moNumber, orderLine.moLineNumber, lineProduct.productName, req.productCode, req.fgColor, req.companyCode, req.unitCode)
            }

            if (req.iNeedProductRm) {
              rmInfo = await this.moProductSubLineRepo.getRmInfoByProductIdProductCodeFgColor(lineProduct.id, req.productCode, req.fgColor, req.companyCode, req.unitCode)
              rmInfo = rmInfo.filter((rm)=>!!rm.itemCode)
            }

            if (req.iNeedProductOps) {
              opInfo = await this.moProductSubLineRepo.getOpInfoByProductIdProductCodeFgColor(lineProduct.id, req.productCode, req.fgColor, req.companyCode, req.unitCode)
              opInfo = opInfo.filter((op)=>!!op.opCode)
            }

            if (req.iNeedProductOpRm) {
              const pslOps = await this.moProductSubLineRepo.getOpInfoByProductIdProductCodeFgColor(lineProduct.id, req.productCode, req.fgColor, req.companyCode, req.unitCode)
              for (const op of pslOps) {
                const bomInfo: SI_MoProductRmModel[] = await this.moProductSubLineRepo.getBomInfoByOpCodeProductCodeFgColor(req?.moNumber, op.opCode, req.productCode, req.fgColor, req.companyCode, req.unitCode);
                for (const eachBom of bomInfo) {
                  const eachOpRmData = new SI_MoProductOpRmModel(op.opCode, op.processType, eachBom)
                  opRmInfo.push(eachOpRmData)
                }
              }
            }

            if (req.iNeedMoSubLines) {
              const ordersSubLines = await this.moProductSubLineRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, moLineProductId: lineProduct.id, productCode: req.productCode, fgColor: req.fgColor } })//ToDo

              for (const subLine of ordersSubLines) {

                let subLineAttrs = null
                if (req.iNeedMoSubLineAttrs) {
                  subLineAttrs = await this.moInfoRepo.getMoSubLineAttrsBySubLineIdProductCodeFgColor(req?.moNumber, orderLine.moLineNumber, lineProduct.productName, subLine.id, req.companyCode, req.unitCode)
                }
                const eachSublineData = new SI_MoProdSubLineModel(subLine.fgColor, subLine.size, subLine.quantity, subLineAttrs, subLine.id, subLine.oQType);
                productSubLines.push(eachSublineData);
              }
            }
            const eachLineProductData = new SI_MoLineProductModel(orderLine.moLineNumber, manufacturingOrder?.moNumber, lineProduct.productName, productSubLines ? productSubLines[0]?.color : null, productSubLines, rmInfo, opInfo, opRmInfo, moLineProductAttrs, lineProduct.productCode, lineProduct.productType);
            lineProducts.push(eachLineProductData);
          }
        }
        const eachLineData = new SI_MoLineInfoModel(orderLine.moLineNumber, orderLine.id, manufacturingOrder.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, lineProducts, lineAttrs);
        console.log(eachLineData,"eachjhh")
        MoLines.push(eachLineData);
                console.log(MoLines,"eachjhh")

      }
    }


    MoLines = MoLines.filter((line) => { return line.moLineProducts.some((prods) => prods.fgColor === req.fgColor); });

    const orderInfo = new SI_ManufacturingOrderInfoModel(manufacturingOrder?.moNumber, manufacturingOrder.id, manufacturingOrder.isConfirmed === 0 ? false : true, manufacturingOrder.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, manufacturingOrder.moProceedingStatus, manufacturingOrder.style, manufacturingOrder.uploadedDate, MoLines, moAttrs, moRm)
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'Manufacturing Order Info Fetched Successfully', [orderInfo]);
  }


  async getMoInfoByPslId(req: SI_MoProductSubLineIdsRequest): Promise<SI_ManufacturingOrderInfoResponse> {
    const manufacturingOrders = await this.moInfoRepo.getMosByPslIds(req.moProductSubLinePk, req.companyCode, req.unitCode)
    const orders: SI_ManufacturingOrderInfoModel[] = []
    for (const mo of manufacturingOrders) {
      let moLines: SI_MoLineInfoModel[] = [];
      let moAttrs: SI_MoAttributesModel = null;
      let moRm: SI_MoRmModel[] = []

      moAttrs = await this.moInfoRepo.getMoAttributesByPslIds(mo?.moNumber, req.moProductSubLinePk, req.unitCode, req.companyCode);
      moRm = await this.rmInfoRepo.getMoRmByPslIds(mo?.moNumber, req.moProductSubLinePk, req.unitCode, req.companyCode);

      if (req.iNeedMoLines) {
        const manufOrdLines = await this.moLineRepo.getMoLinesByPslIds(req.moProductSubLinePk, req.companyCode, req.unitCode)
        for (const orderLine of manufOrdLines) {
          let lineProducts: SI_MoLineProductModel[] = [];
          let lineAttrs: SI_MoAttributesModel = null;


          if (req.iNeedMoLineAttr) {
            lineAttrs = await this.moInfoRepo.getMoLineAttrsByPslIds(req.moProductSubLinePk, req.companyCode, req.unitCode)
          }


          if (req.iNeedMoProd) {
            const manufacturingOrderLineProducts = await this.moLineProductRepo.getMoLineProductsByPslIds(orderLine.id, req.moProductSubLinePk, req.companyCode, req.unitCode)
            for (const lineProduct of manufacturingOrderLineProducts) {
              const productSubLines: SI_MoProdSubLineModel[] = []
              let rmInfo: SI_MoProductRmModel[] = []
              let opInfo: SI_MoProductOpModel[] = []
              let opRmInfo: SI_MoProductOpRmModel[] = []
              let moLineProductAttrs: SI_MoLineProdAttributesModel = null

              if (req.iNeedMoProdAttrs) {
                moLineProductAttrs = await this.moInfoRepo.getMoLineProdAttrsByPslIds(req.moProductSubLinePk, req.companyCode, req.unitCode)
              }

              rmInfo = await this.moProductSubLineRepo.getRmInfoByPslIds(lineProduct.id, req.moProductSubLinePk, req.companyCode, req.unitCode)


              opInfo = await this.moProductSubLineRepo.getOpInfoByPslIds(lineProduct.id, req.moProductSubLinePk, req.companyCode, req.unitCode)


              const pslOps = await this.moProductSubLineRepo.getOpInfoByPslIds(lineProduct.id, req.moProductSubLinePk, req.companyCode, req.unitCode)
              for (const op of pslOps) {
                const bomInfo: SI_MoProductRmModel[] = await this.pslOpRmRepo.getBomInfoByOpCode(mo?.moNumber, op.opCode, req.companyCode, req.unitCode);

                for (const eachBom of bomInfo) {
                  const eachOpRmData = new SI_MoProductOpRmModel(op.opCode, op.processType, eachBom)
                  opRmInfo.push(eachOpRmData)
                }
              }


              if (req.iNeedMoSubLines) {
                const ordersSubLines = await this.moProductSubLineRepo.find({ where: { id: In(req.moProductSubLinePk), companyCode: req.companyCode, unitCode: req.unitCode, moLineProductId: lineProduct.id, moLineNumber: orderLine.moLineNumber } })
                for (const subLine of ordersSubLines) {

                  let subLineAttrs = null
                  let OrdFeatures: OrderFeatures = null

                  if (req.iNeedMoSubLineAttrs) {
                    subLineAttrs = await this.moInfoRepo.getMoSubLineAttrsBySubLineId(mo?.moNumber, orderLine.moLineNumber, lineProduct.productName, subLine.id, req.companyCode, req.unitCode)
                  }
                  if (req.iNeedMoProdSubLineOrdFeatures) {
                    OrdFeatures = await this.moProductSubLineRepo.getOrdFeaturesBySubLineId(subLine.id, req.companyCode, req.unitCode)//Todo
                  }
                  const eachSublineData = new SI_MoProdSubLineModel(subLine.fgColor, subLine.size, subLine.quantity, subLineAttrs, subLine.id, subLine.oQType, OrdFeatures);
                  productSubLines.push(eachSublineData);
                }
              }
              const eachLineProductData = new SI_MoLineProductModel(orderLine.moLineNumber, mo?.moNumber, lineProduct.productName, productSubLines ? productSubLines[0]?.color : null, productSubLines, rmInfo, opInfo, opRmInfo, moLineProductAttrs, lineProduct.productCode, lineProduct.productType);
              lineProducts.push(eachLineProductData);
            }
          }
          lineProducts = lineProducts.filter(item => item?.subLines && item?.subLines?.length > 0);

          const eachLineData = new SI_MoLineInfoModel(orderLine.moLineNumber, orderLine.id, mo.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, lineProducts, lineAttrs, mo.customerName, mo.customerCode);
          moLines.push(eachLineData);
        }
      }

      moLines = moLines.filter(line => line?.moLineProducts && line.moLineProducts.length > 0)
      const eachMo = new SI_ManufacturingOrderInfoModel(mo?.moNumber, mo.id, mo.isConfirmed === 0 ? false : true, mo.moProgressStatus === 0 ? MoConfigStatusEnum.OPEN : MoConfigStatusEnum.IN_PROGRESS, mo.moProceedingStatus, mo.style, mo.uploadedDate, moLines, moAttrs, moRm)
      orders.push(eachMo)
    }
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'Data fetched Successfully', orders);
  }

  async getMoNumbersForStyleCode(req: StyleCodeRequest): Promise<MoNumberDropdownResponse> {
    const moNumbers = await this.moInfoRepo.find({ where: { styleCode: req.styleCode, companyCode: req.companyCode, unitCode: req.unitCode } })
    const moNums: MoNumberDropdownModel[] = [];
    for (const mo of moNumbers) {
      const moNum = new MoNumberDropdownModel(mo.moNumber, mo.id);
      moNums.push(moNum);

    }
    return new MoNumberDropdownResponse(true, 0, 'Data fetched Successfully', moNums);

  }

  async getOpenMo(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoResponse> {
    const openMo: SI_ManufacturingOrderInfoModel[] = await this.moInfoRepo.getMoInfoByStatusForOrderSummaries(req.companyCode, req.unitCode, 1, 0)
    const openManufacturingOrders: SI_ManufacturingOrderInfoModel[] = []
    for (const eachMo of openMo) {
      const order = new SI_MoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, eachMo?.moNumber, eachMo.moPk, false, false, true, false, true, false, false, false, false, false, false)

      const eachOrder = await this.getOrderInfoByManufacturingOrderNo(order);
      openManufacturingOrders.push(eachOrder.data[0])
    }
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'Open Manufacturing Orders Fetched Successfully', openManufacturingOrders);
  }

  async getInProgressMo(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoResponse> {
    const inProgressMo: SI_ManufacturingOrderInfoModel[] = await this.moInfoRepo.getMoInfoByStatusForOrderSummaries(req.companyCode, req.unitCode, 1, 1)
    const inProgressManufacturingOrders: SI_ManufacturingOrderInfoModel[] = []
    for (const eachMo of inProgressMo) {
      const order = new SI_MoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, eachMo?.moNumber, eachMo.moPk, false, false, true, false, true, false, false, false, false, false, false)

      const eachOrder = await this.getOrderInfoByManufacturingOrderNo(order);
      inProgressManufacturingOrders.push(eachOrder.data[0])
    }
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'InProgress Manufacturing Orders Fetched Successfully', inProgressManufacturingOrders);
  }

  async getClosedMo(req: CommonRequestAttrs): Promise<SI_ManufacturingOrderInfoResponse> {
    const closedMo: SI_ManufacturingOrderInfoModel[] = await this.moInfoRepo.getMoInfoByStatusForOrderSummaries(req.companyCode, req.unitCode, 1, 2)
    const closedManufacturingOrders: SI_ManufacturingOrderInfoModel[] = []
    for (const eachMo of closedMo) {
      const order = new SI_MoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, eachMo?.moNumber, eachMo.moPk, false, false, true, false, true, false, false, false, false, false, false)
      const eachOrder = await this.getOrderInfoByManufacturingOrderNo(order);
      closedManufacturingOrders.push(eachOrder.data[0])
    }
    return new SI_ManufacturingOrderInfoResponse(true, 0, 'Closed Manufacturing Orders Fetched Successfully', closedManufacturingOrders);
  }

  async proceedOpenToInprogress(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {

    await this.moInfoRepo.update({ moNumber: req.moNumber, unitCode: req.unitCode, companyCode: req.companyCode }, { moProgressStatus: 1, updatedUser: req.username, updatedAt: new Date() });

    return new GlobalResponseObject(true, 0, "Manufacturing Order proceeded to InProgress Succesfully")
  }

  // Called from PTS
  async getBundlesForPslId(req: SI_MoProductSubLineIdsRequest): Promise<MO_R_OslBundlesResponse> {
    const { companyCode, unitCode, moProductSubLinePk } = req;
    if (!moProductSubLinePk?.length) {
      throw new ErrorResponse(0, `PSL ids not provided to get the bundles`);
    }
    const pslRecs = await this.moProductSubLineRepo.find({ select: ['id', 'moNumber'], where: { companyCode: companyCode, unitCode: unitCode, id: In(moProductSubLinePk) } });
    if (pslRecs.length == 0) {
      throw new ErrorResponse(0, `PSL ids not found for the psl ids : ${moProductSubLinePk.toString()}`);
    }
    const m1Models: MO_R_OslProcTypeBundlesModel[] = [];
    for (const pslRec of pslRecs) {
      const procTypeBundlesMap = new Map<ProcessTypeEnum, MO_R_OslBundlesModel[]>();
      // get the bundles for the psl id
      const bundles = await this.moPoBundleRepo.find({ select: ['bundleNumber', 'quantity', 'procType', 'processingSerial', 'itemSku'], where: { companyCode: companyCode, unitCode: unitCode, moProductSubLineId: pslRec.id } });
      bundles.forEach(b => {
        if (!procTypeBundlesMap.has(b.procType)) {
          procTypeBundlesMap.set(b.procType, []);
        }
        const m2 = new MO_R_OslBundlesModel(b.bundleNumber, b.quantity, b.procType, pslRec.id, b.itemSku);
        procTypeBundlesMap.get(b.procType).push(m2);
      });
      procTypeBundlesMap.forEach((bundles, pType) => {
        const m1 = new MO_R_OslProcTypeBundlesModel(bundles, pType);
        m1Models.push(m1);
      });
    }
    return new MO_R_OslBundlesResponse(true, 0, `Bundles retrieved successfully`, m1Models);
  }

  async getMoPreviewData(req: SI_MoNumberRequest): Promise<MOPreviewResponse> {
    const moData = await this.moInfoRepo.getMoInfoByMoNumberForMoPreview(req.moNumber, req.companyCode, req.unitCode)


    const moLines = await this.moLineRepo.getMoLineInfoForMoPreview(req.moNumber, req.companyCode, req.unitCode)

    const allOps = await this.pslOpRepo.getAllOperationForMo(req.moNumber, req.companyCode, req.unitCode)
    console.log(allOps)
    const moPreviewBomInfo = await this.moProductSubLineRepo.getBomInfoByOpCodes(req.moNumber, allOps, req.companyCode, req.companyCode);
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, companyCode: req.companyCode, unitCode: req.unitCode } })
    moPreviewBomInfo?.forEach((bom) => {
      bom.wastage = bom?.wastage ? bom?.wastage : "0";
      bom.requireQty = bom?.avgCons * moInfo?.quantity

    })

    const previewLines: MoPreviewMoLine[] = []
    for (const eachLine of moLines) {

      const colorsInfo = await this.moLineRepo.getUniqueColorsForTheLine(req.moNumber, eachLine.moLineNumber, req.companyCode, req.unitCode)
      const moPreviewColorSizesquant: MoPreviewColorWiseSizes[] = []
      for (const eachColor of colorsInfo) {
        const sizeQuants = await this.moLineRepo.getSizeWiseQuantsForColor(req.moNumber, eachLine.moLineNumber, eachColor.color, req.companyCode, req.unitCode)

        const colorWiseSizes = new MoPreviewColorWiseSizes(eachColor.color, sizeQuants)
        moPreviewColorSizesquant.push(colorWiseSizes)

      }

      const previewLineData = new MoPreviewMoLine(eachLine.moLineNumber, eachLine.productCode, eachLine.productType, eachLine.destination, eachLine.deliveryDate, eachLine.zFeature, moPreviewColorSizesquant, moPreviewBomInfo)
      previewLines.push(previewLineData)
    }

    const previewData = new ManufacturingOrderPreviewData(moData.moNumber, moData.uploadDate, moData.styleName, moData.buyer, moData.poNo, moData.styleCode, moData.packMethod, moData.isMoConfirmed, previewLines)

    return new MOPreviewResponse(true, 0, "Mo Preview data fetched successfully", [previewData]);
  }

  async getMoSummaryPreviewData(req: SI_MoNumberRequest): Promise<MOSummaryPreviewResponse> {

    const moData = await this.moInfoRepo.getMoInfoByMoNumberForMoSummaryPreview(req.moNumber, req.companyCode, req.unitCode)
    const allMoColors = []
    const moPrevColorSizes = await this.moLineRepo.getUniqueColorsForTheMo(req.moNumber, req.companyCode, req.unitCode)


    const allOps = await this.pslOpRepo.getAllOperationForMo(req.moNumber, req.companyCode, req.unitCode)
    const moSummaryPreviewBomInfo = await this.moProductSubLineRepo.getBomInfoByOpCodesWithColor(req.moNumber, allOps, req.companyCode, req.companyCode);
    const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, companyCode: req.companyCode, unitCode: req.unitCode } })
    moSummaryPreviewBomInfo?.forEach((bom) => {
      bom.wastage = bom?.wastage ? bom.wastage : "0";
      bom.requireQty = bom?.avgCons * moInfo?.quantity
    })

    for (const eachColor of moPrevColorSizes) {
      // const sizeQuants = await this.moLineRepo.getSizeWiseQuantsForColor(req.moNumber, eachColor.color, req.companyCode, req.unitCode)
      const sizeQuants = await this.moLineRepo.getSizeWiseQuantsForColorAndMo(req.moNumber, eachColor.color, req.companyCode, req.unitCode)

      const colorWiseSizes = new MOSummaryColorSizes(eachColor.color, sizeQuants, moSummaryPreviewBomInfo, [])
      allMoColors.push(colorWiseSizes)
    }

    let imgUrls = ''
    for (const eachProdCode of moData?.productCodes.split(',')) {
      //Product master Fetch
      const productReq = new ProductsIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, eachProdCode)
      const productData = await this.productService.getProductByProductCode(productReq);
      imgUrls += productData.data[0].imageName + ','
    }
    const moSummaryPrevData = new MoSummaryPreviewData(moData.uploadDate, moData.moNumber, moData.styleName, moData.poNo, null, moData.productType, moData.buyerName, null, moData.cpo, moData.deliveryDate, moData.garmentUnit, moData.specialRemarks, imgUrls, moData.isMoProceeded, allMoColors)
    return new MOSummaryPreviewResponse(true, 0, "Mo Summary Preview data fetched Succesfully", [moSummaryPrevData]);
  }


  //-------------------------------------------------------------------------------->   Helper Methods For CPS    <---------------------------------------------------------------------



  async getRawOrderInfo(reqModel: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
    const { salOrdNo, unitCode, companyCode } = reqModel
    const rawMoInfo = await this.moInfoRepo.getRawOrderInfo(salOrdNo, unitCode, companyCode)
    let rawMoLinesInfo: RawOrderLineInfoModel[] = []
    if (reqModel.iNeedSoLines) {
      const moLines = await this.moInfoRepo.getRawOrderLinesInfo(salOrdNo, unitCode, companyCode)

      for (const line of moLines) {
        let soLineOp: RawOrderOpInfoModel[] = []
        let soLineRm: RawOrderLineRmModel[] = []
        let soLineSubLines: RawOrderSubLineInfoModel[] = []

        if (reqModel.iNeedSoLineOp) {
          soLineOp = await this.moLineProductRepo.getMoLineOpByLineId(line.orderLineId, companyCode, unitCode)
        }
        if (reqModel.iNeedSoLineRm) {

          soLineRm = await this.moLineProductRepo.getMoLineRmByLineId(line.orderLineId, companyCode, unitCode)

        }
        if (reqModel.iNeedSoLineSubLines) {
          const moSubLines = await this.moInfoRepo.getRawOrderLineSubLinesInfoByLineId(line.orderLineId, salOrdNo, unitCode, companyCode);
          for (const subLine of moSubLines) {
            let operationCodes = [];
            let rmInfo: RawOrderLineRmModel[] = [];

            const opCodes = await this.pslOpRepo.find({ where: { companyCode, unitCode, moProductSubLineId: subLine.orderSubLineId }, select: ['opCode', 'id'] })

            const pslOpIds: number[] = []

            opCodes.forEach((opCode) => {
              operationCodes.push(opCode.opCode);
              pslOpIds.push(opCode.id)
            });

            const rawMaterials = await this.pslOpRmRepo.find({ where: { companyCode, unitCode, pslOperationId: In(pslOpIds) } })
            for (const rm of rawMaterials) {
              const rmInformation = await this.rmInfoRepo.findOne({ where: { companyCode, unitCode, itemCode: rm.itemCode, moNumber: rm.moNumber } })
              const eachRm = new RawOrderLineRmModel(rmInformation.itemCode, rmInformation.itemDesc, rmInformation.itemColor, null, RmItemTypeEnum[rmInformation.itemType], RmItemSubTypeEnum[rmInformation.itemSubType], rmInformation.consumption, rmInformation.wastage, null)
              rmInfo.push(eachRm)
            };
            const eachSubLineData = new RawOrderSubLineInfoModel(subLine.orderLineId, subLine.orderSubLineId, null, subLine.productCode, subLine.fgColor, subLine.size, subLine.quantity, subLine.schedule, subLine.extSysRefNo, rmInfo, operationCodes)
            soLineSubLines.push(eachSubLineData)
          }
        }
        const eacLineData = new RawOrderLineInfoModel(line.orderLineId, line.orderLineNo, line.fgColor, line.quantity, line.salOrdLineNo, line.delDate, line.dest, line.exFactory, line.productCode, line.prodType, null, true, null, false, false, soLineSubLines, soLineRm, soLineOp, line.sizes, null, line.buyerPo, line.productName, line.plannedCutDate, line.plannedProductionDate, line.delDate, line.parentId)
        rawMoLinesInfo.push(eacLineData)
      }
    }

    // const ManufacturingOrderLines = await this.moLineRepo.find({ where: { moNumber: salOrdNo, companyCode: companyCode, unitCode: unitCode } })
    const orderInfo = new RawOrderInfoModel(rawMoInfo.orderIdPk, rawMoInfo.orderNo, rawMoInfo.purOrdNo, rawMoInfo.prodType, rawMoInfo.quantity, rawMoInfo.style, rawMoInfo.orderNo, rawMoInfo.customerStyle, rawMoInfo.customerStyle, rawMoInfo.customerOrderNo, rawMoInfo.buyerName, null, null, companyCode, false, Number(rawMoInfo?.moConfirmed) == 0 ? true : false, false, rawMoLinesInfo, rawMoInfo.sizes, [], MoProductStatusEnum.CONFIRMED, null, rawMoInfo.buyerPo, null, null, rawMoInfo.plantStyle, rawMoInfo.plannedCutDate)
    return new RawOrderInfoResponse(true, 1, "Data retrieved Succesfully", [orderInfo])

  }


  async getRawOrderHeaderInfo(reqModel: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {
    const moInfo = await this.moInfoRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, moNumber: reqModel.salOrdNo } })
    const headerData = new RawOrderHeaderInfoModel(moInfo.style, moInfo.styleDescription, moInfo.customerName, moInfo.moNumber, moInfo.coNumber, moInfo.profitCenterCode, false, false, false, moInfo.isConfirmed, false)
    return new RawOrderHeaderInfoResponse(true, 1, "Header Info Fetched Succesfully", [headerData])
  }
}

