import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, SI_SaleOrderInfoAbstractResponse, SI_SaleOrderInfoModel, SI_SaleOrderInfoResponse, SI_SoNumberRequest, SI_SoLineInfoModel, SI_SoAttributesModel, SI_SoLineProductModel, SI_SoLineAttributesModel, SI_SoProdSubLineModel, SI_SoLineProdAttributesModel, SoConfigStatusEnum, SI_SoProductIdRequest, SOHeaderInfoModelResponse, SOPreviewResponse, SoPreviewSoLine, SoPreviewColorWiseSizes, SaleOrderPreviewData } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { SoInfoRepository } from "../repository/so-info-repository";
import { SoLineProductRepository } from "../repository/so-line-product.repository";
import { SoLineRepository } from "../repository/so-line.repository";
import { SoProductSubLineRepository } from "../repository/so-product-sub-line.repository";
import moment = require("moment");

@Injectable()
export class SaleOrderCreationInfoService {
  constructor(
    private dataSource: DataSource,
    private soInfoRepo: SoInfoRepository,
    private soLineRepo: SoLineRepository,
    private soLineProductRepo: SoLineProductRepository,
    private soProductSubLineRepo: SoProductSubLineRepository,
  ) {
  }

  // called from UI
  async getSaleOrdersList(req: CommonRequestAttrs): Promise<SI_SaleOrderInfoAbstractResponse> {
    // get only the SI_SaleOrderInfoAbstractModel
    const saleOrders = await this.soInfoRepo.getSaleOrdersList(req.companyCode, req.unitCode,)
    return new SI_SaleOrderInfoAbstractResponse(true, 0, "Sale Orders Fetched Successfully", saleOrders);
  }

  // called from UI
  async getUnConfirmedSaleOrdersInfo(req: CommonRequestAttrs): Promise<SI_SaleOrderInfoResponse> {
    // get only the order that are not confirmed
    const unConfirmedSaleOrders: SI_SaleOrderInfoModel[] = await this.soInfoRepo.getSaleOrderInfoByStatus(req.companyCode, req.unitCode, false)
    const saleOrders: SI_SaleOrderInfoModel[] = []
    for (const unCoOrder of unConfirmedSaleOrders) {
      const order = new SI_SoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, unCoOrder?.soNumber, unCoOrder.soPk, false, true, true, true, true, true, false)

      const eachOrder = await this.getOrderInfoBySaleOrderNo(order);
      saleOrders.push(eachOrder.data[0])
    }
    return new SI_SaleOrderInfoResponse(true, 0, 'UnConfirmed Sale Orders Fetched Successfully', saleOrders);
  }

  // called from UI
  async getConfirmedSaleOrdersInfo(req: CommonRequestAttrs): Promise<SI_SaleOrderInfoResponse> {
    // get only the order that are not confirmed. same code as in getUnConfirmedSaleOrdersInfo. Reuse.. dont copy the code
    const confirmedSaleOrders: SI_SaleOrderInfoModel[] = await this.soInfoRepo.getSaleOrderInfoByStatus(req.companyCode, req.unitCode, true)
    const saleOrders: SI_SaleOrderInfoModel[] = []
    for (const coOrder of confirmedSaleOrders) {
      const order = new SI_SoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, coOrder?.soNumber, coOrder.soPk, false, true, true, true, true, true, false)

      const eachOrder = await this.getOrderInfoBySaleOrderNo(order);
      saleOrders.push(eachOrder.data[0])
    }
    return new SI_SaleOrderInfoResponse(true, 0, 'Confirmed Sale Orders Fetched Successfully', saleOrders);
  }


  async getOrderInfoBySaleOrderNo(req: SI_SoNumberRequest): Promise<SI_SaleOrderInfoResponse> {
    const saleOrder = await this.soInfoRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, soNumber: req?.soNumber } })
    const SoLines: SI_SoLineInfoModel[] = [];
    let soAttrs: SI_SoAttributesModel = null;

    if (req.iNeedSoAttrs) {
      soAttrs = await this.soInfoRepo.getSoAttributesBySaleOrderNo(req?.soNumber, req.unitCode, req.companyCode);
    }

    if (req.iNeedSoLines) {
      const SaleOrderLines = await this.soLineRepo.find({ where: { soNumber: req?.soNumber, companyCode: req.companyCode, unitCode: req.unitCode } })

      for (const orderLine of SaleOrderLines) {
        const lineProducts: SI_SoLineProductModel[] = [];
        let lineAttrs: SI_SoLineAttributesModel = null

        if (req.iNeedSoLineAttr) {
          lineAttrs = await this.soInfoRepo.getSoLineAttrsBySOLineNumber(req?.soNumber, orderLine.soLineNumber, req.companyCode, req.unitCode)
        }


        if (req.iNeedSoProd) {
          const saleOrderLineProducts = await this.soLineProductRepo.find({ where: { soNumber: req?.soNumber, soLineNumber: orderLine.soLineNumber, companyCode: req.companyCode, unitCode: req.unitCode } })
          for (const lineProduct of saleOrderLineProducts) {
            const productSubLines: SI_SoProdSubLineModel[] = []
            let soLineProductAttrs: SI_SoLineProdAttributesModel = null

            if (req.iNeedSoProdAttrs) {
              soLineProductAttrs = await this.soInfoRepo.getSoLineProdAttrsBySoProdName(req?.soNumber, orderLine.soLineNumber, lineProduct.productName, req.companyCode, req.unitCode)
            }



            if (req.iNeedSoSubLines) {
              const ordersSubLines = await this.soProductSubLineRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, soLineProductId: lineProduct?.id } })

              for (const subLine of ordersSubLines) {

                let subLineAttrs = null  //TODO
                if (req.iNeedSoSubLineAttrs) {
                  subLineAttrs = await this.soInfoRepo.getSoSubLineAttrsBySubLineId(subLine?.id, req.companyCode, req.unitCode)
                }
                const eachSublineData = new SI_SoProdSubLineModel(subLine.fgColor, subLine.size, subLine.quantity, subLineAttrs, subLine?.id);
                productSubLines.push(eachSublineData);

              }
            }
            const productColors =[...new Set(productSubLines?.map((subLine) => subLine.color))].join(', ')
            const eachLineProductData = new SI_SoLineProductModel(orderLine.soLineNumber, saleOrder?.soNumber, lineProduct.productName, productColors, productSubLines, soLineProductAttrs);
            lineProducts.push(eachLineProductData);

          }

        }


        const eachLineData = new SI_SoLineInfoModel(orderLine.soLineNumber, orderLine.id, saleOrder.soProgressStatus === 0 ? SoConfigStatusEnum.OPEN : SoConfigStatusEnum.IN_PROGRESS, lineProducts, lineAttrs);
        SoLines.push(eachLineData);
      }
    }
    const orderInfo = new SI_SaleOrderInfoModel(saleOrder?.soNumber, saleOrder.id, saleOrder.isConfirmed === 0 ? false : true, saleOrder.soProgressStatus === 0 ? SoConfigStatusEnum.OPEN : SoConfigStatusEnum.IN_PROGRESS, saleOrder.style, saleOrder.uploadedDate, SoLines, soAttrs)
    return new SI_SaleOrderInfoResponse(true, 0, 'Sale Order Info Fetched Successfully', [orderInfo]);
  }



  async getSoInfoHeader(req: SI_SoProductIdRequest): Promise<SOHeaderInfoModelResponse> {
    const soInfoHeader = await this.soInfoRepo.getSoInfoHeader(req.soNumber, req.companyCode, req.unitCode);
    return new SOHeaderInfoModelResponse(true, 0, "Data fetched succesfully", soInfoHeader)
  }

  async getSoPreviewData(req: SI_SoNumberRequest): Promise<SOPreviewResponse> {
    const soData = await this.soInfoRepo.getSoInfoBySoNumberForSoPreview(req.soNumber, req.companyCode, req.unitCode)


    const soLines = await this.soLineRepo.getSoLineInfoForSoPreview(req.soNumber, req.companyCode, req.unitCode)

    const previewLines: SoPreviewSoLine[] = []
    for (const eachLine of soLines) {

      const colorsInfo = await this.soLineRepo.getUniqueColorsForTheLine(req.soNumber, eachLine.soLineNumber, req.companyCode, req.unitCode)
      const soPreviewColorSizesquant: SoPreviewColorWiseSizes[] = []
      for (const eachColor of colorsInfo) {
        const sizeQuants = await this.soLineRepo.getSizeWiseQuantsForColor(req.soNumber, eachLine.soLineNumber, eachColor.color, req.companyCode, req.unitCode)

        const colorWiseSizes = new SoPreviewColorWiseSizes(eachColor.color, sizeQuants)
        soPreviewColorSizesquant.push(colorWiseSizes)

      }
      // moPreviewBomInfo = 
      const previewLineData = new SoPreviewSoLine(eachLine.soLineNumber, eachLine.productCode, eachLine.productType, eachLine.destination, eachLine.deliveryDate, eachLine.zFeature,eachLine.buyerPo, soPreviewColorSizesquant)
      previewLines.push(previewLineData)
    }

    const previewData = new SaleOrderPreviewData(soData.soNumber, soData.uploadDate, soData.styleName, soData.coNumber, soData.buyerName, soData.poNo, soData.styleCode, soData.packMethod, previewLines, soData.isSoConfirmed)

    return new SOPreviewResponse(true, 0, "So Preview data fetched successfully", [previewData]);
  }
}










