import { Inject, LoggerService } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, MC_BundleCountModel, MC_MoNumberRequest, MC_MoProcessTypeModel, MC_ProductSubLineBundleCountDetail, MOC_BundleDetail, MoNumberResDto, MoPslIdsRequest, MoPslQtyInfoModel, MoPslQtyInfoResponse, OrderFeatures, OrderLineRequest, OrderTypeEnum, PLGenQtyInfoModel, PackOrderResponseDto, PackSerialDropDownModel, PackSerialDropDownResponse, PackSerialRequest, PackSubLineIdsByOrderNoRequest, PackSubLineIdsByOrderNoResponse, PlLineInfo, PoColorDetailsModel, PoDataSummaryResponse, PoProductCodeDetailsModel, PoSizeDetailsModel, PoSummaryDataModel, ProcessTypeEnum, ProcessingOrderCreationInfoModel, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoModel, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderLineInfo, ProcessingOrderMoInfoModel, ProcessingOrderProductInfo, ProcessingOrderProductSubLineInfo, ProcessingOrderSerialRequest, ProductSubLineAndBundleDetailResponse, RoutingGroupDetail, SI_MoProdSubLineModel, SI_MoProductSubLineIdsRequest, StyleMoRequest, TaskStatusEnum } from "@xpparel/shared-models";
import { MOConfigService, OrderCreationService, OrderManipulationServices } from "@xpparel/shared-services";
import moment from 'moment';
import { DataSource, In } from "typeorm";
import { TransactionalBaseService } from "../../base-services";
import { GenericTransactionManager, ITransactionManager } from "../../database/typeorm-transactions";
import { PLConfigEntity } from "../packing-list/entities/pack-list.entity";
import { InsConfigItemsEntity } from "../pkms-inspection-config/entities/pkms-ins-header-config-items";
import { PKMSPoLineEntity } from "./pkms-po-entities/pkms-po-line-entity";
import { PKMSPoProductEntity } from "./pkms-po-entities/pkms-po-product-entity";
import { PKMSPoSerialsEntity } from "./pkms-po-entities/pkms-po-serials-entity";
import { PKMSPoSubLineEntity } from "./pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "./pkms-po-entities/pkms-processing-order-entity";
import { PKMSProductSubLineFeaturesEntity } from "./pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSRoutingGroupEntity } from "./pkms-po-entities/pkms-routing-group-entity";
import { PKMSPoLineRepoInterface } from "./pkms-po-repositories/interfaces/pkms-po-line.repo.interface";
import { PKMSPoSerialsRepoInterface } from "./pkms-po-repositories/interfaces/pkms-po-serials.repo.interface";
import { PKMSPoSubLineRepoInterface } from "./pkms-po-repositories/interfaces/pkms-po-subline.repo.interface";
import { PKMSProcessingOrderRepoInterface } from "./pkms-po-repositories/interfaces/pkms-processing-order.repo.interface";

export class PreIntegrationService extends TransactionalBaseService {
    constructor(
        private orderManipulationServices: OrderManipulationServices,
        private readonly orderManagementService: OrderCreationService,
        @Inject('PKMSProcessingOrderRepoInterface')
        private readonly pKMSProcessingOrderRepository: PKMSProcessingOrderRepoInterface,
        @Inject('PKMSPoLineRepoInterface')
        private readonly poLineRepo: PKMSPoLineRepoInterface,
        @Inject('PKMSPoSubLineRepoInterface')
        private readonly poSubLineLineRepo: PKMSPoSubLineRepoInterface,
        @Inject('PKMSPoSerialsRepoInterface')
        private readonly poSerialsRepo: PKMSPoSerialsRepoInterface,
        private moConfigService: MOConfigService,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        private dataSource: DataSource

    ) {
        super(transactionManager, logger)
    }


    async generatePKMSPoSerial(processType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<number> {
        await this.poSerialsRepo.increment({ companyCode, unitCode, processType }, 'processingSerial', 1);
        const updatedRecord = await this.poSerialsRepo.findOne({ where: { companyCode, unitCode, processType } });
        if (!updatedRecord) {
            const poSerialsEntity = new PKMSPoSerialsEntity()
            poSerialsEntity.companyCode = companyCode
            poSerialsEntity.unitCode = unitCode
            poSerialsEntity.processType = processType
            poSerialsEntity.processingSerial = 1
            await this.poSerialsRepo.save(poSerialsEntity)
            return 1
        }
        return updatedRecord?.processingSerial ?? 0;
    }

    async createPKMSProcessingOrder(reqObj: ProcessingOrderCreationRequest): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource)
        try {
            const pslIds = reqObj.prcOrdSubLineInfo.map((v) => v.moProductSubLineId)
            const req = new SI_MoProductSubLineIdsRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, pslIds, true, true, true, true, true, true, true)
            const moInfoRes = await this.orderManagementService.getMoInfoByPslId(req)
            if (!moInfoRes.status) {
                throw new ErrorResponse(moInfoRes.errorCode, moInfoRes.internalMessage)
            };

            const stylesSet = new Set<string>();
            const moNumbers: string[] = [];
            const customerNames = new Set<string>();
            const moNumberSet = new Set<string>();
            const moSubLineInfo = new Map<number, SI_MoProdSubLineModel>();
            for (const eachMo of moInfoRes.data) {
                stylesSet.add(eachMo.style);
                moNumbers.push(eachMo.moNumber);
                moNumberSet.add(eachMo.moNumber);
                eachMo.moLineModel.forEach((li) => {
                    customerNames.add(li.customerName);
                    for (const eachMoLine of li.moLineProducts) {
                        for (const eachProduct of eachMoLine.subLines) {
                            moSubLineInfo.set(eachProduct.pk, eachProduct);
                        }
                    }
                })
            };
            if (stylesSet.size > 1) {
                throw new ErrorResponse(0, 'You cannot create PO for two styles');
            };
            if (customerNames.size > 1) {
                throw new ErrorResponse(5641, 'Please select mo numbers for the same customer.')
            }
            for (const eachMoSubLine of reqObj.prcOrdSubLineInfo) {
                const productSubLineActInfo = moSubLineInfo.get(eachMoSubLine.moProductSubLineId);
                if (!productSubLineActInfo) {
                    throw new ErrorResponse(0, 'Sub Line Id not found from OMS' + eachMoSubLine.moProductSubLineId);
                }
                const originalSubLineQty = productSubLineActInfo.qty;
                const alreadyCreatedSubLineQty = await this.poSubLineLineRepo.getAlreadyCreatedSubLineIdQty(req.companyCode, req.unitCode, eachMoSubLine.moProductSubLineId);
                const totalPoQty = alreadyCreatedSubLineQty.qty + eachMoSubLine.quantity;
                if (totalPoQty > originalSubLineQty) {
                    throw new ErrorResponse(0, 'You are trying to create processing order more than available quantity. Please check and try again' + `For SubLine id: ${eachMoSubLine.moProductSubLineId} Original qty: ${originalSubLineQty} Already po created qty: ${alreadyCreatedSubLineQty}`);
                }
            }

            await transactionManager.startTransaction()
            const processingSerial = await this.generatePKMSPoSerial(reqObj.processType[0], reqObj.companyCode, reqObj.unitCode)
            const poEntity = new PKMSProcessingOrderEntity()
            poEntity.styleCode = reqObj.styleCode;
            poEntity.processingSerial = processingSerial;
            poEntity.customerName = Array.from(customerNames).toString();
            poEntity.prcOrdDescription = reqObj.prcOrdDescription || '';
            poEntity.remarks = reqObj.prcOrdRemarks || '';
            poEntity.prcOrdRemarks = reqObj.prcOrdRemarks || '';
            poEntity.status = TaskStatusEnum.OPEN;
            poEntity.companyCode = reqObj.companyCode
            poEntity.unitCode = reqObj.unitCode
            poEntity.createdUser = reqObj.username
            poEntity.processType = ProcessTypeEnum.PACK
            const savePoEntity = await transactionManager.getRepository(PKMSProcessingOrderEntity).save(poEntity)

            const poSubLines: PKMSPoSubLineEntity[] = []
            const poProducts: PKMSPoProductEntity[] = []
            const productSubLineFeatures: PKMSProductSubLineFeaturesEntity[] = []
            const productSet = new Set<string>();

            const { data } = moInfoRes
            const moInfo = data[0]
            for (const moLine of moInfo.moLineModel) {
                const poLineEntity = new PKMSPoLineEntity()
                poLineEntity.coNumber = moInfo.moAtrs.co.join(",")
                poLineEntity.companyCode = reqObj.companyCode
                poLineEntity.createdUser = reqObj.username
                poLineEntity.customerName = moLine.customerName; // add in the model
                poLineEntity.poId = savePoEntity.id
                poLineEntity.processingSerial = processingSerial
                poLineEntity.processType = reqObj.processType[0]
                poLineEntity.remarks = reqObj.prcOrdRemarks
                poLineEntity.moId = moInfo.moPk
                poLineEntity.moLineId = moLine.moLinePk
                poLineEntity.moLineNumber = moLine.moLineNo
                poLineEntity.moNumber = moInfo.moNumber
                poLineEntity.unitCode = reqObj.unitCode;
                const poLineSaveRes = await transactionManager.getRepository(PKMSPoLineEntity).save(poLineEntity)
                for (const productInfo of moLine.moLineProducts) {
                    const key = productInfo.productName + productInfo.productCode + productInfo.productType
                    // const key = productInfo.productName

                    const productRef = `${productInfo.productName?.slice(0, 3)}${productInfo.productCode?.slice(0, 3)}${productInfo.productType?.slice(0, 3)}`;
                    // const productRef = `${productInfo.productName.slice(0, 3)}`;
                    if (!productSet.has(key)) {
                        productSet.add(key)
                        const poProductEntity = new PKMSPoProductEntity()
                        poProductEntity.companyCode = reqObj.companyCode
                        poProductEntity.createdUser = reqObj.username
                        poProductEntity.processingSerial = processingSerial
                        poProductEntity.processType = reqObj.processType[0]
                        poProductEntity.productCode = productInfo.productCode
                        poProductEntity.productName = productInfo.productName
                        poProductEntity.productType = productInfo.productCode || ''
                        poProductEntity.productRef = productRef;
                        poProductEntity.unitCode = reqObj.unitCode;
                        poProductEntity.productCode = productInfo.productCode || ''
                        poProducts.push(poProductEntity)
                    }
                    for (const pslInfo of productInfo.subLines) {
                        const moProdSublineAttr = pslInfo.moProdSubLineAttrs
                        const poSubLineEntity = new PKMSPoSubLineEntity()
                        poSubLineEntity.companyCode = reqObj.companyCode
                        poSubLineEntity.createdUser = reqObj.username
                        poSubLineEntity.fgColor = pslInfo.color
                        poSubLineEntity.processingSerial = processingSerial
                        poSubLineEntity.processType = reqObj.processType[0]
                        poSubLineEntity.productRef = productRef
                        poSubLineEntity.productCode = productInfo.productCode
                        poSubLineEntity.productName = productInfo.productName
                        poSubLineEntity.productType = productInfo.productType
                        poSubLineEntity.styleCode = reqObj.styleCode
                        const currPSL = reqObj.prcOrdSubLineInfo.find((v) => v.moProductSubLineId === pslInfo.pk)
                        poSubLineEntity.quantity = currPSL.quantity
                        poSubLineEntity.size = pslInfo.size
                        poSubLineEntity.moProductSubLineId = pslInfo.pk
                        poSubLineEntity.moSubLineRefNo = moProdSublineAttr.refNo
                        poSubLineEntity.unitCode = reqObj.unitCode
                        poSubLineEntity.poLineId = poLineSaveRes.id
                        poSubLineEntity.processType = ProcessTypeEnum.PACK;
                        poSubLineEntity.productCode = productInfo.productCode || ''
                        poSubLineEntity.productName = productInfo.productName
                        poSubLineEntity.productType = productInfo.productType || ''
                        poSubLineEntity.styleCode = reqObj.styleCode
                        poSubLines.push(poSubLineEntity)
                        const orderFeatures = pslInfo.moProdSubLineOrdFeatures
                        const productSubLineFeaturesEntity = new PKMSProductSubLineFeaturesEntity()
                        productSubLineFeaturesEntity.companyCode = reqObj.companyCode
                        productSubLineFeaturesEntity.businessHead = orderFeatures.businessHead[0]
                        productSubLineFeaturesEntity.customerCode = orderFeatures.customerName[0]
                        productSubLineFeaturesEntity.createdUser = reqObj.username
                        productSubLineFeaturesEntity.deliveryDate = moment(moProdSublineAttr.delDate).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.destination = moProdSublineAttr.destination
                        productSubLineFeaturesEntity.exFactoryDate = moment(orderFeatures.exFactoryDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.moClosedDate = moment(orderFeatures.moClosedDate[0]).format("YYYY-MM-DD")
                        productSubLineFeaturesEntity.moCreationDate = moment(orderFeatures.moCreationDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.moId = moInfo.moPk
                        productSubLineFeaturesEntity.moLineId = moLine.moLinePk
                        productSubLineFeaturesEntity.moProductSubLineId = pslInfo.pk
                        productSubLineFeaturesEntity.planCutDate = moment(orderFeatures.planCutDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.planProdDate = moment(orderFeatures.planProductionDate[0]).format("YYYY-MM-DD");
                        productSubLineFeaturesEntity.processType = reqObj.processType[0]
                        productSubLineFeaturesEntity.processingSerial = processingSerial
                        productSubLineFeaturesEntity.profitCenterCode = ""
                        productSubLineFeaturesEntity.profitCenterName = ""
                        productSubLineFeaturesEntity.schedule = orderFeatures.schedule[0]
                        productSubLineFeaturesEntity.styleCode = orderFeatures.styleCode[0]
                        productSubLineFeaturesEntity.styleDescription = orderFeatures.styleDescription[0]
                        productSubLineFeaturesEntity.styleName = orderFeatures.styleName[0]
                        productSubLineFeaturesEntity.unitCode = reqObj.unitCode
                        productSubLineFeaturesEntity.zFeature = orderFeatures.zFeature[0]
                        productSubLineFeaturesEntity.moLineNumber = moLine.moLineNo
                        productSubLineFeaturesEntity.moNumber = moInfo.moNumber
                        productSubLineFeaturesEntity.customerName = orderFeatures.customerName[0]
                        productSubLineFeaturesEntity.coNumber = orderFeatures.coNumber[0]
                        productSubLineFeaturesEntity.soLineNumber = moProdSublineAttr.soLineNumber // add in mo info model
                        productSubLineFeaturesEntity.soNumber = moProdSublineAttr.soNumber // add in mo info model
                        productSubLineFeaturesEntity.fgColor = pslInfo.color
                        productSubLineFeaturesEntity.processType = ProcessTypeEnum.PACK
                        productSubLineFeaturesEntity.moNumber = moInfo.moNumber
                        productSubLineFeaturesEntity.productCode = productInfo.productCode || ''
                        productSubLineFeaturesEntity.size = pslInfo.size;
                        productSubLineFeaturesEntity.oqType = pslInfo.oqType;
                        productSubLineFeatures.push(productSubLineFeaturesEntity)
                    }
                }
            }
            await transactionManager.getRepository(PKMSPoSubLineEntity).save(poSubLines)
            await transactionManager.getRepository(PKMSPoProductEntity).save(poProducts)
            await transactionManager.getRepository(PKMSProductSubLineFeaturesEntity).save(productSubLineFeatures);
            const routingGroupDetails: RoutingGroupDetail[] = [];
            for (const eachProcessType of reqObj.processType) {
                const groupInfo = new RoutingGroupDetail(eachProcessType, reqObj.routingGroup, 0, null);
                routingGroupDetails.push(groupInfo);
            }
            await this.saveRoutingGroupsForPo(processingSerial, reqObj.unitCode, reqObj.companyCode, routingGroupDetails, reqObj.username, transactionManager);
            await transactionManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Processing Order Created Successfully.')
        } catch (error) {
            await transactionManager.releaseTransaction()
            throw new Error(error)
        }


    }

    async saveRoutingGroupsForPo(processingSerial: number, unitCode: string, companyCode: string, routingGroups: RoutingGroupDetail[], userName: string, manager: GenericTransactionManager) {
        for (const eachProcessType of routingGroups) {
            const routingObj = new PKMSRoutingGroupEntity();
            routingObj.companyCode = companyCode;
            routingObj.createdUser = userName;
            routingObj.processType = eachProcessType.procType;
            routingObj.processingSerial = processingSerial;
            routingObj.routingGroup = eachProcessType.routingGroup;
            routingObj.unitCode = unitCode;
            await manager.getRepository(PKMSRoutingGroupEntity).save(routingObj);
        }
        return true;
    }



    async getMOInfoForPKMSPrcOrdCreation(styleMoRequest: StyleMoRequest): Promise<ProcessingOrderCreationInfoResponse> {
        const { moNumber, unitCode, companyCode, userId, username } = styleMoRequest

        const processingOrderCreationInfoArr: ProcessingOrderCreationInfoModel[] = []
        const prcOrdQtysInfo = await this.poLineRepo.getPKMSPSLTotalOrdQtyForMoNumbers(moNumber, unitCode, companyCode)
        for (const moNumberOne of moNumber) {
            const moNumberRequest = new MC_MoNumberRequest(username, unitCode, companyCode, userId, moNumberOne)
            const eligiblePSLIds = await this.getEligibleProductSubLinesToCreatePo(moNumberRequest, [ProcessTypeEnum.PACK]);
            if (eligiblePSLIds.length === 0) {
                throw new ErrorResponse(0, "No eligible product sub lines found for selected MO numbers")
            }

            const pslIds = eligiblePSLIds.map((v) => v.moProductSubLineId)
            const siMoProductSubLineIdsRequest = new SI_MoProductSubLineIdsRequest(username, unitCode, companyCode, userId, pslIds, true, true, true, true, true, true, true)
            const moInfoRes = await this.orderManagementService.getMoInfoByPslId(siMoProductSubLineIdsRequest);
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

                                const processingOrderCreationInfoModel = new ProcessingOrderCreationInfoModel(moRec.moNumber, molineRec.moLineNo, moProductRec.productName, moSubLineRec.color, moSubLineRec.moProdSubLineAttrs.destination, moProdSubLineAttrs.delDate, "", moProdSubLineAttrs.refNo, moProdSubLineAttrs.qty, balQty, moSubLineRec.size, moSubLineRec.pk, moRec.moPk, molineRec.moLinePk, moSubLineRec.oqType, bundleCountDetail)
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
        return new ProcessingOrderCreationInfoResponse(true, 1111, "Data retrieved successfully", processingOrderCreationInfoArr)
    }




    async getEligibleProductSubLinesToCreatePo(reqObj: MC_MoNumberRequest, procTypes: ProcessTypeEnum[]): Promise<MC_ProductSubLineBundleCountDetail[]> {
        const { moNumber, unitCode, companyCode } = reqObj;
        const omsReq = new MC_MoProcessTypeModel(null, unitCode, companyCode, 0, moNumber, procTypes[0]);
        const eligibleProductSubLineInfo: ProductSubLineAndBundleDetailResponse = await this.moConfigService.getEligibleBundleInfoToCreatePO(omsReq);
        if (!eligibleProductSubLineInfo.status) {
            throw new ErrorResponse(eligibleProductSubLineInfo.errorCode, eligibleProductSubLineInfo.internalMessage);
        }
        const pslbBundleGroupInfo: MC_ProductSubLineBundleCountDetail[] = [];
        for (const eachPslb of eligibleProductSubLineInfo.data) {
            const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(eachPslb.bundleDetails);
            pslbBundleGroupInfo.push(new MC_ProductSubLineBundleCountDetail(eachPslb.moProductSubLineId, bundleQtyGroup));
        }
        return pslbBundleGroupInfo;
    }

    /**
     * Supporting function to get bundle quantity group wise bundle count for given bundles
     * @param bundleDetails 
     * @returns 
    */
    getBundleQtyGroupsForGivenBundles(bundleDetails: MOC_BundleDetail[]): MC_BundleCountModel[] {
        // bundle qty group and no of bundles
        const bundleQtyGroups = new Map<number, number>();
        for (const eachBundle of bundleDetails) {
            if (!bundleQtyGroups.has(eachBundle.quantity)) {
                bundleQtyGroups.set(eachBundle.quantity, 0);
            }
            let preCount = bundleQtyGroups.get(eachBundle.quantity);
            bundleQtyGroups.set(eachBundle.quantity, ++preCount)
        };
        const bundleQtyGroupInfo = [];
        for (const [bundleQty, noOfEligibleBundles] of bundleQtyGroups) {
            bundleQtyGroupInfo.push({
                bundleQty,
                noOfEligibleBundles
            })
        }
        return bundleQtyGroupInfo;
    }

    async getOrderInfo(req: PackSerialRequest): Promise<CommonResponse> {
        const poData = await this.getPoData(req);
        if (!poData) {
            throw new ErrorResponse(36056, 'Po Data not available')
        }
        return new CommonResponse(true, 36057, 'Po Data retrieved successfully', poData);
    }

    async getPoData(req: PackSerialRequest): Promise<PLGenQtyInfoModel> {
        const poData = await this.pKMSProcessingOrderRepository.getPoData(req.companyCode, req.unitCode, req.packSerial);
        const lineRecords = await this.poLineRepo.find({ where: { poId: poData.poId, companyCode: req.companyCode, unitCode: req.unitCode } });
        const poLines: PlLineInfo[] = []
        for (const rec of lineRecords) {
            const products = await this.poSubLineLineRepo.getDistinctColorProductsForPoLine(req.packSerial, rec.id, req.companyCode, req.unitCode);
            for (const product of products) {
                const poLine = new PlLineInfo(rec.id, rec.moLineNumber, [], product.productRef, product.productName, product.productType, product.productCode, product.fgColor);
                poLine.subLineQuantities = await this.poSubLineLineRepo.getSubLinesByPoLineIdAndProductColor(rec.id, product.productCode, product.fgColor, req.unitCode, req.companyCode);
                poLines.push(poLine)
            }
        }
        poData.plLines = poLines
        return poData
    }

    async getAllPackSerialDropdownData(req: CommonRequestAttrs): Promise<PackSerialDropDownResponse> {
        const poData = await this.pKMSProcessingOrderRepository.find({ select: ['id', 'processingSerial', 'prcOrdDescription', 'customerName'], where: { companyCode: req.companyCode, unitCode: req.unitCode }, order: { createdAt: 'DESC' } });
        if (!poData) {
            throw new ErrorResponse(36058, 'Pack Order Data not available')
        }
        return new PackSerialDropDownResponse(true, 36059, 'Pack Serial retrieved successfully', poData.map(rec => new PackSerialDropDownModel(rec.id, rec.processingSerial, rec.prcOrdDescription, undefined, rec.customerName)));
    }

    async getPackSubLineIdsByOrderNumber(req: PackSubLineIdsByOrderNoRequest): Promise<PackSubLineIdsByOrderNoResponse> {
        const subLineData = await this.poSubLineLineRepo.find({ where: { moSubLineRefNo: req.orderNumber } });
        const subLineIds = [];
        if (!subLineData) {
            throw new ErrorResponse(36060, 'No sub line ids exists for the given order number');
        }
        subLineData.map(s => {
            subLineIds.push(s.moProductSubLineId);
        })
        return new PackSubLineIdsByOrderNoResponse(true, 36061, 'sub line ids for the order', subLineIds);
    }


    async getPackSerialNumbers(req: CommonRequestAttrs): Promise<CommonResponse> {
        const data = await this.pKMSProcessingOrderRepository.find({ select: ['id', 'processingSerial'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
        if (data.length) {
            return new CommonResponse(true, 36064, "Pack Serial Numbers Retrieved Successfully")
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async getPKMSPoInfoForStyleAndMo(styleMoReq: StyleMoRequest): Promise<ProcessingOrderInfoResponse> {
        const processingSerialsRes = await this.pKMSProcessingOrderRepository.getPKMSPoSerialsForGivenStyleAndMONumbers(styleMoReq)
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
        return new ProcessingOrderInfoResponse(true, 0, 'PO data retrieved Successfully.', processingOrderInfoArr)
    }

    async getProcessingOrderInfo(req: ProcessingOrderInfoRequest): Promise<ProcessingOrderInfoResponse> {
        const commonConditions = { unitCode: req.unitCode, companyCode: req.companyCode };
        const processingOrders = await this.pKMSProcessingOrderRepository.find({
            where: {
                processingSerial: req.processingSerial,
                ...commonConditions
            },
            select: ['processingSerial', 'prcOrdDescription', 'prcOrdRemarks', 'styleCode', 'id']
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
            return value ? Array.from(new Set(value.split(delimiter))) : [];
        }
        const featuresData = await this.poLineRepo.getProcessingOrderFeatures(processingSerial, moId, moLineId, poLineId, pslId);
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
    private async getProcessOrderInfoForPoRec(poRec: any, req: ProcessingOrderInfoRequest): Promise<ProcessingOrderInfoModel> {
        const [moInfo, features] = await Promise.all([
            req.iNeedPrcOrdMoInfo ? this.getProcessingOrderMoInfoModel(poRec, req) : [],
            req.iNeedPrcOrdFeatures ? this.getOrderFeatures(req.processingSerial) : []
        ]);
        return new ProcessingOrderInfoModel(poRec.processingSerial, poRec.prcOrdDescription, moInfo, poRec.styleCode, poRec.processType, features);
    }

    //helper method to get ProcessingOrderMoInfoModel
    private async getProcessingOrderMoInfoModel(poRec: any, req: ProcessingOrderInfoRequest): Promise<ProcessingOrderMoInfoModel[]> {
        const moInfoRecords = await this.poLineRepo.getMoInfoForGivenPo(poRec.id);
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
    private async getProcessingOrderLines(moInfo: any, req: ProcessingOrderInfoRequest): Promise<ProcessingOrderLineInfo[]> {
        const lineRecords = await this.poLineRepo.find({ where: { poId: moInfo.poId, moId: moInfo.moId } });
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
                return new ProcessingOrderLineInfo(line.moLineNumber, line.processingSerial, line.processType, products, features);
            })
        );
    };

    private async getProcessingOrderProductInfo(line: PKMSPoLineEntity, req: ProcessingOrderInfoRequest): Promise<ProcessingOrderProductInfo[]> {
        const poSublineRes = await this.poSubLineLineRepo.getDistinctProductsForPoLine(req.processingSerial, line.id, req.companyCode, req.unitCode);
        return Promise.all(poSublineRes.map(async prod => {
            const [subLines, features] = await Promise.all([
                req.iNeedPrcOrdSubLineInfo ? this.getProcessingOrderProductSubLineInfo(line, req, prod.productRef) : [],
                req.iNeedPrcOrdProductFeatures ? this.getOrderFeatures(req.processingSerial, null, null, line.id) : []
            ]);
            return new ProcessingOrderProductInfo(prod.productCode, prod.productType, prod.productName, subLines, features);
        }));
    }

    private async getProcessingOrderProductSubLineInfo(
        poLineEntity: PKMSPoLineEntity,
        req: ProcessingOrderInfoRequest,
        productRef: string
    ): Promise<ProcessingOrderProductSubLineInfo[]> {
        const subLines = await this.poSubLineLineRepo.find({
            where: { processingSerial: poLineEntity.processingSerial, processType: poLineEntity.processType, poLineId: poLineEntity.id, productRef: productRef }
        });

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


    async deletePackOrder(req: PackSerialRequest): Promise<GlobalResponseObject> {
        const findExistedPackLists = await this.dataSource.getRepository(PLConfigEntity).find({ select: ['id'], where: { packSerial: req.packSerial, companyCode: req.companyCode, unitCode: req.unitCode } })
        const processingSerialIds = findExistedPackLists.map(rec => rec.id)
        const findInsPlIds = await this.dataSource.getRepository(InsConfigItemsEntity).exist({ where: { plRefId: In(processingSerialIds) } })
        if (findInsPlIds) {
            throw new ErrorResponse(64516, "You can't delete an Inspection Request that has associated Pack Orders.")
        }
        return await this.executeWithTransaction(async (transactionManager) => {
            const packOrder = await transactionManager.getRepository(PKMSProcessingOrderEntity).findOne({ where: { processingSerial: req.packSerial } });
            if (!packOrder) {
                throw new ErrorResponse(36065, 'Pack Order does not exists');
            }
            const packListExist = await transactionManager.getRepository(PLConfigEntity).count({ where: { packSerial: req.packSerial } })
            if (packListExist > 0) {
                throw new ErrorResponse(36066, 'Pack list exist, Cannot delete the Pack order');
            }
            await transactionManager.getRepository(PKMSPoSubLineEntity).delete({ processingSerial: req.packSerial })
            await transactionManager.getRepository(PKMSProductSubLineFeaturesEntity).delete({ processingSerial: req.packSerial });
            await transactionManager.getRepository(PKMSPoProductEntity).delete({ processingSerial: req.packSerial });
            await transactionManager.getRepository(PKMSPoLineEntity).delete({ processingSerial: req.packSerial });
            await transactionManager.getRepository(PKMSProcessingOrderEntity).delete({ processingSerial: req.packSerial });
            return new CommonResponse(true, 36067, "Pack Order Deleted Successfully");
        });
    };

    async getPKMSMoNumbers(req: CommonRequestAttrs): Promise<CommonResponse> {
        const findMoNUmbers = await this.poLineRepo.findDistinctMoNumbers(req);
        if (!findMoNUmbers?.length) {
            throw new ErrorResponse(523243, "Please create Po's");
        }
        return new CommonResponse(true, 64486, "Mos retrieved Successfully", findMoNUmbers);
    };


    async getPKMSPackOrdersByMo(req: MoNumberResDto): Promise<CommonResponse> {
        const findPos = await this.poLineRepo.find({ select: ['poId'], where: { moNumber: req.moNumber, unitCode: req.unitCode, companyCode: req.companyCode } });
        const poIds = findPos.map(rec => rec.poId)
        const poNumbers = await this.pKMSProcessingOrderRepository.find({ select: ['prcOrdDescription', 'id'], where: { id: In(poIds), unitCode: req.unitCode, companyCode: req.companyCode } })
        if (!poNumbers) {
            throw new ErrorResponse(6546, "Please select valid MOs for the created Pack Orders.")
        }
        const pos = poNumbers.map((rec) => {
            const dto = new PackOrderResponseDto(rec.prcOrdDescription, rec.id)
            return dto
        })
        return new CommonResponse(true, 64563, "Pack orders Retrieved Successfully", pos)
    }

    async getPoQtysInfoForMoPSLIds(reqObj: MoPslIdsRequest): Promise<MoPslQtyInfoResponse> {
        const { moPslIds, unitCode, companyCode } = reqObj;
        const moWiseSubLineIds = await this.poSubLineLineRepo.find({ where: { moProductSubLineId: In(moPslIds), unitCode, companyCode }, select: ['processType', 'processingSerial', 'quantity'] })
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
                            const quantityType = orderFeatures?.[0]?.oqType
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
}
