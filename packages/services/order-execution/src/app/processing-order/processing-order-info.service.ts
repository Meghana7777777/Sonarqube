import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, KnitHeaderInfoResoponse, MC_MoNumberRequest, MO_R_OslBundlesModel, MO_R_OslBundlesResponse, MO_R_OslProcTypeBundlesModel, MoCustomerInfoHelperModel, MoCustomerInfoHelperResponse, MoProductSubLineIdsRequest, MoPslIdsRequest, MoPslQtyInfoModel, MoPslQtyInfoResponse, OrderFeatures, OrderTypeEnum, PO_C_PoSerialPslIdsRequest, PO_PoSerialRequest, PO_StyleInfoResponse, PoColorDetailsModel, PoDataSummaryResponse, PoProductCodeDetailsModel, PoSerialRequest, PoSizeDetailsModel, PoSummaryDataModel, PoSummaryModel, PoSummaryResponse, ProcessingOrderCreationInfoModel, ProcessingOrderCreationInfoResponse, ProcessingOrderInfoModel, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderLineInfo, ProcessingOrderMoInfoModel, ProcessingOrderProductInfo, ProcessingOrderProductSubLineInfo, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, SI_MoProductSubLineIdsRequest, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from "@xpparel/shared-models";
import { OrderCreationService } from "@xpparel/shared-services";
import { ProductSubLineFeaturesRepository } from "../common/repository/product-sub-line-features.repo";

import { ErrorResponse } from "@xpparel/backend-utils";
import { In } from "typeorm";
import { PoLineEntity } from "../common/entities/po-line-entity";
import { ProcessingOrderEntity } from "../common/entities/processing-order-entity";
import { PoLineRepository } from "../common/repository/po-line.repo";
import { PoProductRepository } from "../common/repository/po-product.repo";
import { PoSubLineRepository } from "../common/repository/po-sub-line.repo";
import { ProcessingOrderRepository } from "../common/repository/processing-order.repo";
import { ProcessingSerialRes } from "../common/repository/query-response/processing-serial.qry-res";
import { PoSubLineBundleService } from "./po-sub-line.bundle.service";
import { ProductSubLineFeaturesEntity } from "../common/entities/product-sub-line-features-entity";
import { PoSubLineBundleRepository } from "../common/repository/po-sub-line-bundle.repo";
import { PoSubLineBundleEntity } from "../common/entities/po-sub-line-bundle.entity";

@Injectable()
export class ProcessingOrderInfoService {
    constructor(
        private readonly orderManagementService: OrderCreationService,
        private readonly poRepo: ProcessingOrderRepository,
        private readonly poLineRepo: PoLineRepository,
        private readonly poSubLineRepo: PoSubLineRepository,
        private readonly poProductRepo: PoProductRepository,
        private readonly poslBundleService: PoSubLineBundleService,
        private productSubLineFeaturesRepository: ProductSubLineFeaturesRepository,
        private poSubLineBunRepo: PoSubLineBundleRepository

    ) {

    }

    /**
     * Retrieves processing order information for a given style and MO numbers.
     * @param {StyleMoRequest} styleMoReq - 
     * @returns {Promise<ProcessingOrderInfoResponse>}
     * @throws {ErrorResponse}
    */
    async getPoInfoForStyleAndMo(styleMoReq: StyleMoRequest): Promise<ProcessingOrderInfoResponse> {
        const processingSerialsRes: ProcessingSerialRes[] = await this.poRepo.getPoSerialsForGivenStyleAndMONumbers(styleMoReq)
        if (processingSerialsRes.length === 0) {
            throw new ErrorResponse(0, "No PO's found for selected  MO numbers")
        }
        const processingSerialsArr = processingSerialsRes.map((v) => v.processing_serial)

        const processingOrderInfoArr: ProcessingOrderInfoModel[] = []
        for (const processingSerial of processingSerialsArr) {
            const req = new ProcessingOrderInfoRequest(styleMoReq.username, styleMoReq.unitCode, styleMoReq.companyCode, styleMoReq.userId, processingSerial, styleMoReq.processingType, true, true, true, true, true, true, true, true, true)
            const poInfoRes = await this.getProcessingOrderInfo(req)
            if (poInfoRes.status) {
                const { data } = poInfoRes
                processingOrderInfoArr.push(...data)
            }
        }
        return new ProcessingOrderInfoResponse(true, 0, 'PO data retreived Successfully.', processingOrderInfoArr)
    }

    async getProcessingOrderInfo(req: ProcessingOrderInfoRequest): Promise<ProcessingOrderInfoResponse> {
        const { unitCode, companyCode, processingSerial } = req
        const commonConditions = { unitCode, companyCode };
        const whereConditions = processingSerial ? { processingSerial, ...commonConditions } : commonConditions
        const processingOrders = await this.poRepo.find({
            where: {
                ...whereConditions
            },
            select: ['processingSerial', 'prcOrdDescription', 'prcOrdRemarks', 'styleCode', 'id', 'processType']
        });
        if (processingOrders.length === 0) {
            throw new ErrorResponse(0, "No data found for given processing serials")
        }
        const poInfoModels = await Promise.all(processingOrders.map(po => this.getProcessOrderInfoForPoRec(po, req)));
        return new ProcessingOrderInfoResponse(true, 0, "PO data retrieved successfully.", poInfoModels);
    }

    // helper method to get order features at any levels of ProcessingOrderInfoModel
    async getOrderFeatures(
        processingSerial: number,
        moId?: number,
        moLineId?: number,
        poLineId?: number,
        pslId?: number
    ): Promise<OrderFeatures[]> {
        function safeSplit(value?: string, delimiter: string = ','): string[] {
            return value ? value.split(delimiter) : [];
        }
        const featuresData = await this.poLineRepo.getProcessingOrderFeatures(
            processingSerial,
            moId,
            moLineId,
            poLineId,
            pslId
        );

        if (!featuresData.length) {
            throw new ErrorResponse(0, `No order features found for MO Serial: ${processingSerial}`);
        }

        return featuresData.map(v => new OrderFeatures(
            safeSplit(v.moNumber),
            safeSplit(v.moLineNumber),
            [],
            safeSplit(v.planDeliveryDate),
            safeSplit(v.planProductionDate),
            safeSplit(v.planCutDate),
            [],
            v.styleName,
            v.styleDescription,
            safeSplit(v.businessHead),
            safeSplit(v.moCreationDate),
            safeSplit(v.moClosedDate),
            safeSplit(v.exFactoryDate),
            safeSplit(v.schedule),
            safeSplit(v.zFeature),
            safeSplit(v.styleCode),
            safeSplit(v.customerCode),
            v.oqType
        ));
    }



    //helper function to get ProcessingOrderInfoModel  
    private async getProcessOrderInfoForPoRec(
        poRec: ProcessingOrderEntity,
        req: ProcessingOrderInfoRequest
    ): Promise<ProcessingOrderInfoModel> {
        const [moInfo, features] = await Promise.all([
            req.iNeedPrcOrdMoInfo ? this.getProcessingOrderMoInfoModel(poRec, req) : [],
            req.iNeedPrcOrdFeatures ? this.getOrderFeatures(req.processingSerial) : []
        ]);

        return new ProcessingOrderInfoModel(
            poRec.processingSerial,
            poRec.prcOrdDescription,
            moInfo,
            poRec.styleCode,
            poRec.processType,
            features
        );
    }

    //helper method to get ProcessingOrderMoInfoModel
    private async getProcessingOrderMoInfoModel(
        poRec: ProcessingOrderEntity,
        req: ProcessingOrderInfoRequest
    ): Promise<ProcessingOrderMoInfoModel[]> {
        const moInfoRecords = await this.poLineRepo.getMoInfoForGivenPo(poRec);
        return Promise.all(
            moInfoRecords.map(async mo => {
                const [lines, features] = await Promise.all([
                    req.iNeedPrcOrdLineInfo ? this.getProcessingOrderLines(mo, req) : [],
                    req.iNeedPrcOrdMoFeatures ? this.getOrderFeatures(req.processingSerial, mo.moId) : []
                ]);

                return new ProcessingOrderMoInfoModel(mo.moNumber, lines, features);
            })
        );
    }

    // helper method to ProcessingOrderLineInfo
    private async getProcessingOrderLines(
        moInfo: any,
        req: ProcessingOrderInfoRequest
    ): Promise<ProcessingOrderLineInfo[]> {
        const lineRecords = await this.poLineRepo.find({
            where: {
                poId: moInfo.poId,
                moId: moInfo.moId
            }
        });

        return Promise.all(
            lineRecords.map(async line => {
                const [products, features] = await Promise.all([
                    req.iNeedPrcOrdProductInfo ? this.getProcessingOrderProductInfo(line, req) : [],
                    req.iNeedPrcOrdLineFeatures ? this.getOrderFeatures(
                        req.processingSerial,
                        line.moId,
                        line.moLineId
                    ) : []
                ]);

                return new ProcessingOrderLineInfo(
                    line.moLineNumber,
                    line.processingSerial,
                    line.processType,
                    products,
                    features
                );
            })
        );
    }

    private async getProcessingOrderProductInfo(line: PoLineEntity, req: ProcessingOrderInfoRequest): Promise<ProcessingOrderProductInfo[]> {
        const poSublineRes = await this.poSubLineRepo.getDistincProductsForPoLine(req.processingSerial, line.id, req.companyCode, req.unitCode)
        const productRefs = poSublineRes.map((v) => v.productRef)
        const products = await this.poProductRepo.find({ where: { productRef: In(productRefs), processType: req.processType, processingSerial: req.processingSerial } });
        return Promise.all(poSublineRes.map(async prod => {
            const [subLines, features] = await Promise.all([
                req.iNeedPrcOrdSubLineInfo ? this.getProcessingOrderProductSubLineInfo(line, req, prod.productRef) : [],
                req.iNeedPrcOrdProductFeatures ? this.getOrderFeatures(req.processingSerial, null, null, line.id) : []
            ]);
            return new ProcessingOrderProductInfo(prod.productCode, prod.productType, prod.productName, subLines, features);
        }));
    }


    // helper method to get ProcessingOrderProductSubLineInfo
    private async getProcessingOrderProductSubLineInfo(
        poLineEntity: PoLineEntity,
        req: ProcessingOrderInfoRequest,
        productRef: string

    ): Promise<ProcessingOrderProductSubLineInfo[]> {
        const subLines = await this.poSubLineRepo.find({
            where: { processingSerial: poLineEntity.processingSerial, processType: poLineEntity.processType, poLineId: poLineEntity.id, productRef: productRef }
        });
        // console.log(poLineEntity.id,'line id',productRef,'product ref')
        // console.log(subLines, 'sub lines')
        return Promise.all(
            subLines.map(async sub => {
                const features = req.iNeedPrcOrdSubLineFeatures
                    ? await this.getOrderFeatures(
                        req.processingSerial,
                        null,
                        null,
                        poLineEntity.id,
                        sub.moProductSubLineId
                    )
                    : [];

                return new ProcessingOrderProductSubLineInfo(
                    sub.moProductSubLineId,
                    sub.fgColor,
                    sub.size,
                    sub.quantity,
                    features
                );
            })
        );
    }


    async getMOInfoForPrcOrdCreation(styleMoRequest: StyleMoRequest): Promise<ProcessingOrderCreationInfoResponse> {
        const { moNumber, unitCode, companyCode, userId, username, processingType } = styleMoRequest

        const processingOrderCreationInfoArr: ProcessingOrderCreationInfoModel[] = []
        const prcOrdQtysInfo = await this.poLineRepo.getPSLTotalOrdQtyForMoNumbers(moNumber, unitCode, companyCode)
        for (const moNumberOne of moNumber) {
            const moNumberRequest = new MC_MoNumberRequest(username, unitCode, companyCode, userId, moNumberOne)
            const eligiblePSLIds = await this.poslBundleService.getEligibleProductSubLinesToCreatePo(moNumberRequest, [processingType])
            if (eligiblePSLIds.length === 0) {
                throw new ErrorResponse(0, "No eligible product sub lines found for selected MO numbers")
            }
            // const siMoNumberRequest = new SI_MoNumberRequest(username, unitCode, companyCode, userId, moNumberOne, undefined, false, true, false, false, false, false, false, false, false, false, false)
            const pslIds = eligiblePSLIds.map((v) => v.moProductSubLineId)
            const siMoProductSubLineIdsRequest = new SI_MoProductSubLineIdsRequest(username, unitCode, companyCode, userId, pslIds, true, true, true, true, true, true, true)
            const moInfoRes = await this.orderManagementService.getMoInfoByPslId(siMoProductSubLineIdsRequest)
            if (!moInfoRes.status) {
                throw new ErrorResponse(moInfoRes.errorCode, moInfoRes.internalMessage)
            }
            if (moInfoRes.status && moInfoRes.data && moInfoRes.data.length) {
                const { data } = moInfoRes
                for (const moRec of data) {
                    for (const molineRec of moRec.moLineModel) {
                        for (const moProductRec of molineRec.moLineProducts) {
                            for (const moSubLineRec of moProductRec.subLines) {
                                const { moProdSubLineAttrs } = moSubLineRec

                                const prcOrdQtyRec = prcOrdQtysInfo.find((v) => Number(v.poslId) === Number(moSubLineRec.pk))
                                const poslMoQty = prcOrdQtyRec?.quantity || 0

                                const balQty = Number(moProdSubLineAttrs.qty) - Number(poslMoQty)
                                const pslBundleCountDetail = eligiblePSLIds.find((v) => Number(v.moProductSubLineId) === moSubLineRec.pk)
                                const bundleCountDetail = pslBundleCountDetail?.bundleCountDetail || undefined

                                const processingOrderCreationInfoModel = new ProcessingOrderCreationInfoModel(moRec.moNumber, molineRec.moLineNo, moProductRec.productName, moSubLineRec.color, moSubLineRec.moProdSubLineAttrs.destination, moProdSubLineAttrs.delDate, moProdSubLineAttrs.co, moProdSubLineAttrs.refNo, moProdSubLineAttrs.qty, balQty, moSubLineRec.size, moSubLineRec.pk, moRec.moPk, molineRec.moLinePk, moSubLineRec.oqType, bundleCountDetail)
                                processingOrderCreationInfoArr.push(processingOrderCreationInfoModel)
                            }
                        }

                    }
                }
            }
        }
        if (processingOrderCreationInfoArr.length === 0) {
            throw new ErrorResponse(0, "No data found for selected MO numbers")
        }
        return new ProcessingOrderCreationInfoResponse(true, 1111, "Deta retreived sucessfully", processingOrderCreationInfoArr)
    }


    /**
     * Service to get Cut Order Created Styles 
     * Usually calls from the UI, to display styles dropdown
     * @param reqObj 
     * @returns 
    */
    async getCutOrderCreatedStyles(reqObj: CommonRequestAttrs): Promise<PO_StyleInfoResponse> {
        const { unitCode, companyCode } = reqObj;
        const stylesInfo = await this.poSubLineRepo.getDistinctStyles(unitCode, companyCode);
        return new PO_StyleInfoResponse(true, 0, 'Styles Info Retrieved Successfully', stylesInfo);
    }

    /**
     * Service to get Cut Order Created Product Info for given style
     * Usually calls from UI to display products against to given style (dependent dropdown)
     * @param reqObj 
     * @returns 
    */
    async getProductInfoForGivenStyle(reqObj: StyleCodeRequest): Promise<ProductInfoResponse> {
        const { unitCode, companyCode } = reqObj;
        const productInfo = await this.poSubLineRepo.getDistinctProductInfoForGivenStyle(reqObj.styleCode, unitCode, companyCode);
        return new ProductInfoResponse(true, 0, 'Product Info Retrieved Successfully', productInfo);
    }

    /**
     * Service to get Cut Order Info for Style and product from ui
     * Usually calls from UI to Display processing orders for given style and product code
     * @param reqObj 
     * @returns 
    */
    async getCutOrderInfoByStyeAndProduct(reqObj: StyleProductCodeRequest): Promise<ProcessingOrderInfoResponse> {
        const { unitCode, companyCode } = reqObj;
        const poInfo = await this.poSubLineRepo.getDistinctPoInfoForGivenStyleAndProduct(reqObj.styleCode, reqObj.productCode, unitCode, companyCode);
        const poInfoArray: ProcessingOrderInfoModel[] = [];
        for (const eachPo of poInfo) {
            const processingOrderInfo = await this.poRepo.findOne({ where: { processingSerial: eachPo, unitCode, companyCode, isActive: true }, select: ['processingSerial', 'prcOrdDescription', 'processType'] });
            const poInfoObj = new ProcessingOrderInfoModel(processingOrderInfo.processingSerial, processingOrderInfo.prcOrdDescription, [], null, processingOrderInfo.processType, []);
            poInfoArray.push(poInfoObj);
        }
        return new ProcessingOrderInfoResponse(true, 0, 'Cut Order Info Retrieved Successfully', poInfoArray);
    }

    /**
     * Service to get style and product code information for fg color and Po
     * Usually calls from UI to show the tabs for each product code and fg color
     * @param reqObj 
     * @returns 
    */
    async getStyleProductCodeFgColorForPo(reqObj: ProcessingOrderSerialRequest): Promise<StyleProductFgColorResp> {
        const styleProductInfo = await this.poSubLineRepo.getStyleProductCodeFgColorForPo(reqObj.processType, reqObj.processingSerial[0], reqObj.unitCode, reqObj.companyCode);
        return new StyleProductFgColorResp(true, 0, 'Style and product info retrieved successfully', styleProductInfo);
    }

    async getMoHeaderInfoData(processingSerial: number, companyCode: string, unitCode: string): Promise<KnitHeaderInfoResoponse> {
        const moHeaderInfo = await this.productSubLineFeaturesRepository.getMoHeaderInfoData(processingSerial, companyCode, unitCode);
        return new KnitHeaderInfoResoponse(true, 1, "Knit header data fetched successfully", moHeaderInfo);
    }


    /**
     * 
     * @param {MoProductSubLineIdsRequest} reqObj 
     * @returns 
     */
    async getPoQtysInfoForMoPSLIds(reqObj: MoPslIdsRequest): Promise<MoPslQtyInfoResponse> {
        const { moPslIds, unitCode, companyCode } = reqObj;
        const moWiseSubLineIds = await this.poSubLineRepo.find({ where: { moProductSubLineId: In(moPslIds), unitCode, companyCode }, select: ['processType', 'processingSerial', 'quantity'] })
        if (moWiseSubLineIds.length === 0) {
            throw new ErrorResponse(0, "No data found for given mo product sub line ids")
        }
        const moPslQtyInfoResponseArr: MoPslQtyInfoModel[] = []
        for (const eachMoWiseSubLineId of moWiseSubLineIds) {
            const moPslQtyInfo = new MoPslQtyInfoModel(eachMoWiseSubLineId.moProductSubLineId, eachMoWiseSubLineId.quantity, eachMoWiseSubLineId.processType, eachMoWiseSubLineId.processingSerial)
            moPslQtyInfoResponseArr.push(moPslQtyInfo)
        }
        return new MoPslQtyInfoResponse(true, 1, "Data fetched successfully", moPslQtyInfoResponseArr)
    }


    async getPoSummary(req: ProcessingOrderSerialRequest): Promise<PoDataSummaryResponse> {
        const { processingSerial, processType, unitCode, companyCode, username, userId } = req;
        const poInfoReq = new ProcessingOrderInfoRequest(username, unitCode, companyCode, userId, processingSerial[0], processType, false, true, false, true, false, true, false, true, true)
        const poInfo = await this.getProcessingOrderInfo(poInfoReq)
        if (!poInfo.status) {
            throw new ErrorResponse(0, "PO Info not found")
        }
        const poInfoData = poInfo.data

        const quantityTypeMap = new Map<OrderTypeEnum, Map<string, Map<string, Map<string, number>>>>();
        for (const eachPoInfo of poInfoData) {
            for (const eachMoInfo of eachPoInfo.prcOrdMoInfo) {
                for (const eachPoLine of eachMoInfo.prcOrdLineInfo) {
                    for (const eachProdInfo of eachPoLine.productInfo) {
                        for (const eachPoSlInfo of eachProdInfo.prcOrdSubLineInfo) {
                            const orderFeatures = eachPoSlInfo.prcOrdSubLineFeatures
                            // Get quantity type from features or use a default
                            // console.log(orderFeatures)
                            console.log(eachPoSlInfo)
                            const quantityType = orderFeatures?.[0]?.oqType
                            console.log('quanityt type', quantityType)
                            const productCode = eachProdInfo.productCode;
                            const color = eachPoSlInfo.fgColor;
                            const size = eachPoSlInfo.size;
                            const quantity = eachPoSlInfo.quantity;

                            if (!quantityTypeMap.has(quantityType)) {
                                quantityTypeMap.set(quantityType, new Map());
                            }
                            const productMap = quantityTypeMap.get(quantityType);

                            if (!productMap.has(productCode)) {
                                productMap.set(productCode, new Map());
                            }
                            const colorMap = productMap.get(productCode);

                            if (!colorMap.has(color)) {
                                colorMap.set(color, new Map());
                            }
                            const sizeMap = colorMap.get(color);

                            // Add or update quantity for the size
                            sizeMap.set(size, (sizeMap.get(size) || 0) + quantity);

                        }
                    }

                }
            }
        }

        const result: PoSummaryDataModel[] = [];
        quantityTypeMap.forEach((productMap, quantityType) => {
            console.log('qty type', quantityType)
            const productCodeDetails: PoProductCodeDetailsModel[] = [];
            productMap.forEach((colorMap, productCode) => {
                const colorDetails: PoColorDetailsModel[] = [];
                colorMap.forEach((sizeMap, color) => {
                    const poSizeDetails: PoSizeDetailsModel[] = [];
                    sizeMap.forEach((quantity, size) => {
                        poSizeDetails.push(new PoSizeDetailsModel(size, quantity));
                    });
                    colorDetails.push(new PoColorDetailsModel(color, poSizeDetails));
                });
                productCodeDetails.push(new PoProductCodeDetailsModel(productCode, colorDetails));
            });

            result.push(new PoSummaryDataModel(quantityType, productCodeDetails));
        });
        return new PoDataSummaryResponse(true, 1, "Data fetched successfully", result)

    }


    // Bundling Helper
    async getPslBundlesForPoSerial(req: PO_C_PoSerialPslIdsRequest): Promise<MO_R_OslBundlesResponse> {
        const { companyCode, unitCode, poSerial, pslIds } = req;
        let pslBundles: PoSubLineBundleEntity[] = [];
        if (pslIds?.length > 0) {
            pslBundles = await this.poSubLineBunRepo.find({ select: ['bundleNumber', 'quantity', 'finalizedQuantity', 'moProductSubLineId', 'fgSku'], where: { processingSerial: poSerial, companyCode, unitCode, moProductSubLineId: In(pslIds) } });
        } else {
            pslBundles = await this.poSubLineBunRepo.find({ select: ['bundleNumber', 'quantity', 'finalizedQuantity', 'moProductSubLineId', 'fgSku'], where: { processingSerial: poSerial, companyCode, unitCode } });
        }
        if (pslBundles.length == 0) {
            throw new ErrorResponse(0, `No bundles found for the po serial : ${req.poSerial}`);
        }
        const m2s: MO_R_OslBundlesModel[] = [];
        pslBundles.forEach(b => {
            const m2 = new MO_R_OslBundlesModel(b.bundleNumber, b.quantity, b.procType, b.moProductSubLineId, b.fgSku);
            m2s.push(m2);
        });
        const m1 = new MO_R_OslProcTypeBundlesModel(m2s, ProcessTypeEnum.CUT);
        return new MO_R_OslBundlesResponse(true, 0, 'Bundles retrieved', [m1]);
    };


    async getMoInfoByProcessingSerial(poReq: PO_PoSerialRequest): Promise<MoCustomerInfoHelperResponse> {
        const { processingSerial, unitCode, companyCode } = poReq;
        const moCoInfo: MoCustomerInfoHelperModel[] = [];
        const subLineInfo = await this.poSubLineRepo.find({ where: { processingSerial, unitCode, companyCode, isActive: true } });
        if (!subLineInfo.length) {
            throw new ErrorResponse(0, 'Sub Lines Not found for the given po serial. Please check and try again')
        };
        const poSubLineFeatures = new Map<number, ProductSubLineFeaturesEntity>();
        const coNo = new Set<string>();
        const exFactory = new Set<string>(); // YYYY-MM-DD
        const customerCode = new Set<string>();
        const customerName = new Set<string>();
        const styleCode = new Set<string>();
        const styleDesc = new Set<string>();
        const moNo = new Set<string>();
        const moLine = new Set<string>();
        const buyerPoNumber = new Set<string>();
        const productType = new Set<string>(); // To be add
        const productName = new Set<string>();
        const fgColor = new Set<string>();
        let plantStyle: string = '';
        let quantity = 0;
        for (const eachSubLine of subLineInfo) {
            if (!poSubLineFeatures.has(eachSubLine.moProductSubLineId)) {
                const featuresInfo = await this.productSubLineFeaturesRepository.findOne({ where: { unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId } });
                poSubLineFeatures.set(eachSubLine.moProductSubLineId, featuresInfo);

            };
            quantity += eachSubLine.quantity;
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
        const coInfo = new MoCustomerInfoHelperModel(Array.from(coNo).toString(), Array.from(productName).toString(), Array.from(fgColor).toString(), Array.from(exFactory).toString(), Array.from(customerCode).toString(), Array.from(customerName).toString(), Array.from(styleCode).toString(), Array.from(styleDesc).toString(), Array.from(moNo).toString(), Array.from(moLine).toString(), Array.from(buyerPoNumber).toString(), null, null, null, quantity, null, Array.from(productType).toString());
        moCoInfo.push(coInfo);
        return new MoCustomerInfoHelperResponse(true, 0, 'Mo Info Retrieved Successfully', moCoInfo);
    }


}