import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProcessingSerialProdCodeRequest, KC_KnitGroupQtySummaryResp, KC_KnitGroupPoSerialRequest, KC_KnitGroupRatioResponse, MOC_MoProductFabConsResponse, KC_KnitRatioCreationRequest, GlobalResponseObject, KC_KnitRatioPoSerialRequest, ProcessingOrderInfoRequest, ProcessTypeEnum, MOC_OpRoutingModel, KC_KnitGroupQtySummaryModel, BomItemTypeEnum, kc_SizeWiseKnitGroupQtyInfo, KC_KnitJobConfStatusEnum, KC_KnitJobGenStatusEnum, KC_KnitGroupRatioModel, KC_KnitGroupSizeRatioModel, KC_KnitGroupRatioStatusModel, MOC_OpRoutingSubProcessList, MOC_MoProductFabConsumptionModel, MC_ProductSubLineProcessTypeRequest, MOC_OpRoutingResponse, ProcessingOrderStatusEnum } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { PoKnitJobRatioEntity } from '../common/entities/po-knit-job-ratio-entity';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { PoKnitJobRatioSubLineRepository } from '../common/repository/po-knit-job-ratio-sub-line.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { ProcessingOrderInfoService } from '../processing-order/processing-order-info.service';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoKnitJobRatioLineEntity } from '../common/entities/po-knit-job-ratio-line-entity';
import { PoKnitJobRatioSubLineEntity } from '../common/entities/po-knit-job-ratio-sub-line-entity';
import { MOConfigService, MoOpRoutingService } from '@xpparel/shared-services';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';

@Injectable()
export class KnittingConfigurationService {
    constructor(
        private dataSource: DataSource,
        private knitJobRatioRepo: PoKnitJobRatioRepository,
        private knitJobRatioLineRepo: PoKnitJobRatioLineRepository,
        private knitJobRatioSubLineRepo: PoKnitJobRatioSubLineRepository,
        private poRepo: ProcessingOrderRepository,
        private poLineRepo: PoLineRepository,
        private poSubLineRepo: PoSubLineRepository,
        private poProductRepo: PoProductRepository,
        @Inject(forwardRef(() => ProcessingOrderInfoService)) private poInfoService: ProcessingOrderInfoService,
        private orderConfigService: MOConfigService,
        private moRoutingService: MoOpRoutingService
    ) { }


    /**
     * Service to create Knit group ratio against to given details 
     * Calls from UI after creating knitting ratio
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async createKnitGroupRatio(reqObj: KC_KnitRatioCreationRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, userId, username, processingSerial, processType } = reqObj;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const poInfoReq = new ProcessingOrderInfoRequest(username, unitCode, companyCode, userId, processingSerial, processType, false, true, false, true, false, true, false, true, false);
            const poDetails = await this.poInfoService.getProcessingOrderInfo(poInfoReq);
            if (!poDetails.status) {
                throw new ErrorResponse(poDetails.errorCode, poDetails.internalMessage);
            }
            // Validating that Ratio quantity should not be greater than the original quantity for the PO
            // PRODUCT + FG COLOR -> SIZE -> ORIGINAL QTY
            const productColorSizeWiseOriginalQty = new Map<string, Map<string, number>>();
            for (const eachPo of poDetails.data) {
                for (const eachPoSo of eachPo.prcOrdMoInfo) {
                    for (const eachPoLine of eachPoSo.prcOrdLineInfo) {
                        for (const eachPoLineProd of eachPoLine.productInfo) {
                            for (const eachPoSubLine of eachPoLineProd.prcOrdSubLineInfo) {
                                const key = `${eachPoLineProd.productCode}-${eachPoSubLine.fgColor}`;
                                if (!productColorSizeWiseOriginalQty.has(key)) {
                                    productColorSizeWiseOriginalQty.set(key, new Map<string, number>());
                                }
                                if (!productColorSizeWiseOriginalQty.get(key).has(eachPoSubLine.size)) {
                                    productColorSizeWiseOriginalQty.get(key).set(eachPoSubLine.size, 0);
                                }
                                const preQty = productColorSizeWiseOriginalQty.get(key).get(eachPoSubLine.size);
                                productColorSizeWiseOriginalQty.get(key).set(eachPoSubLine.size, preQty + Number(eachPoSubLine.quantity));
                            }
                        }
                    }
                }
            }
            // KG -> PRODUCT + FG COLOR -> SIZE -> QTY
            const productColorSizeWiseBalanceQty = new Map<string, Map<string, Map<string, number>>>();
            for (const eachKnitGroup of reqObj.knitRatios) {
                if (!productColorSizeWiseBalanceQty.has(eachKnitGroup.knitGroup)) {
                    productColorSizeWiseBalanceQty.set(eachKnitGroup.knitGroup, new Map<string, Map<string, number>>());
                }
                const knitRatioGeneratedQtyForKnitGroup = await this.getKnitRatioForPoAndKnitGroup(processType, processingSerial, unitCode, companyCode, eachKnitGroup.knitGroup);
                console.log(productColorSizeWiseOriginalQty)
                for (const [key, keyInfo] of productColorSizeWiseOriginalQty) {
                    console.log(key,'key intial')
                    if (!productColorSizeWiseBalanceQty.get(eachKnitGroup.knitGroup).has(key)) {
                        productColorSizeWiseBalanceQty.get(eachKnitGroup.knitGroup).set(key, new Map<string, number>())
                    }
                    for (const [size, qty] of keyInfo) {
                        if (!productColorSizeWiseBalanceQty.get(eachKnitGroup.knitGroup).get(key).has(size)) {
                            let balanceQty = qty;
                            const knitRatioGenQty = knitRatioGeneratedQtyForKnitGroup.get(key)?.get(size);
                            if (knitRatioGenQty) {
                                balanceQty -= knitRatioGenQty;
                            }
                            productColorSizeWiseBalanceQty.get(eachKnitGroup.knitGroup).get(key).set(size, balanceQty);
                        }
                    }
                }
            }
            for (const eachKnitGroup of reqObj.knitRatios) {
                for (const eachSizeRatio of eachKnitGroup.sizeRatios) {
                    const key = `${eachKnitGroup.productCode}-${eachKnitGroup.fgColor}`;
                    console.log(key,'key second');
                    const balanceQty = productColorSizeWiseBalanceQty.get(eachKnitGroup.knitGroup).get(key).get(eachSizeRatio.size);
                    if (Number(eachSizeRatio.ratioQty > balanceQty)) {
                        throw new ErrorResponse(0, 'You are trying to generate knit ratio for more than available qty please check' + `${key} , ${eachSizeRatio.size} Ratio Qty: ${eachSizeRatio.ratioQty} but available qty is ${balanceQty}`);
                    }
                }
            }
            await manager.startTransaction();
            for (const eachKnitGroup of reqObj.knitRatios) {
                const productRefInfo = await this.poProductRepo.findOne({ where: { productCode: eachKnitGroup.productCode, unitCode, companyCode, processingSerial, isActive: true, processType: reqObj.processType } });
                if (!productRefInfo) {
                    throw new ErrorResponse(0, 'Product Reference information not found for the given product' + `${eachKnitGroup.productCode} AND ${eachKnitGroup.processingSerial}`)
                }
                let currentRatioCountForKG = await this.knitJobRatioRepo.count({ where: { productRef: productRefInfo.productRef, unitCode, companyCode, groupCode: eachKnitGroup.knitGroup } })
                const ratioEntity = new PoKnitJobRatioEntity();
                ratioEntity.companyCode = companyCode;
                ratioEntity.createdUser = username;
                ratioEntity.groupCode = eachKnitGroup.knitGroup;
                ratioEntity.jobForEachSize = true;
                ratioEntity.processType = processType;
                ratioEntity.processingSerial = processingSerial;
                ratioEntity.productRef = productRefInfo.productRef;
                ratioEntity.ratioCode = `${eachKnitGroup.knitGroup}/${++currentRatioCountForKG}`;
                ratioEntity.ratioDesc = reqObj.ratioName;
                ratioEntity.remarks = reqObj.remarks;
                ratioEntity.unitCode = unitCode;
                ratioEntity.ratioKnitJobQty = eachKnitGroup.highLevelKnitJobQty;
                const knitRatioInfo = await manager.getRepository(PoKnitJobRatioEntity).save(ratioEntity);
                const ratioLineEntity = new PoKnitJobRatioLineEntity();
                ratioLineEntity.companyCode = companyCode;
                ratioLineEntity.createdUser = username;
                ratioLineEntity.poKnitJobRatioId = knitRatioInfo.id;
                ratioLineEntity.processType = processType;
                ratioLineEntity.processingSerial = processingSerial;
                ratioLineEntity.productRef = productRefInfo.productRef;
                ratioLineEntity.unitCode = unitCode;
                const knitRatioLineInfo = await manager.getRepository(PoKnitJobRatioLineEntity).save(ratioLineEntity);
                for (const eachSize of eachKnitGroup.sizeRatios) {
                    const ratioSubLineEntity = new PoKnitJobRatioSubLineEntity();
                    ratioSubLineEntity.companyCode = companyCode;
                    ratioSubLineEntity.createdUser = username;
                    ratioSubLineEntity.fgColor = eachKnitGroup.fgColor;
                    ratioSubLineEntity.logicalBundleQty = eachSize.logicalBundleQty;
                    ratioSubLineEntity.maxJobQty = eachSize.jobQty;
                    ratioSubLineEntity.poKnitJobRatioLineId = knitRatioLineInfo.id;
                    ratioSubLineEntity.processType = processType;
                    ratioSubLineEntity.processingSerial = processingSerial;
                    ratioSubLineEntity.quantity = eachSize.ratioQty;
                    ratioSubLineEntity.size = eachSize.size;
                    ratioSubLineEntity.unitCode = unitCode;
                    await manager.getRepository(PoKnitJobRatioSubLineEntity).save(ratioSubLineEntity, { reload: false });
                }
            }
            await manager.getRepository(ProcessingOrderEntity).update({unitCode, companyCode, processingSerial, processType},{status:ProcessingOrderStatusEnum.INPROGRESS})
            await manager.completeTransaction()
            return new GlobalResponseObject(true, 0, 'Knitting Ratio Created Successfully For given Knit Group');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }

    /**
     * Service to get knit ratio generated quantity for Knit group
     * helper function for getting Knit ratio created quantity
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
     * @param knitGroupCode 
    */
    async getKnitRatioForPoAndKnitGroup(processType: ProcessTypeEnum, processingSerial: number, unitCode: string, companyCode: string, knitGroupCode: string): Promise<Map<string, Map<string, number>>> {
        const knitGroupRatioQtyInfo = await this.knitJobRatioRepo.getKnitTotalKnitRatioQtyForPoAndKGGroupByConStatus(knitGroupCode, processingSerial, unitCode, companyCode, processType);
        const productColorSizeWiseKnitRatioGeneratedQty = new Map<string, Map<string, number>>();
        for (const eachRatio of knitGroupRatioQtyInfo) {
            const key = `${eachRatio.product_code}-${eachRatio.fg_color}`;
            if (!productColorSizeWiseKnitRatioGeneratedQty.has(key)) {
                productColorSizeWiseKnitRatioGeneratedQty.set(key, new Map<string, number>());
            }
            if (!productColorSizeWiseKnitRatioGeneratedQty.get(key).has(eachRatio.size)) {
                productColorSizeWiseKnitRatioGeneratedQty.get(key).set(eachRatio.size, 0);
            }
            const preQty = productColorSizeWiseKnitRatioGeneratedQty.get(key).get(eachRatio.size);
            productColorSizeWiseKnitRatioGeneratedQty.get(key).set(eachRatio.size, preQty + Number(eachRatio.quantity));
        }
        return productColorSizeWiseKnitRatioGeneratedQty;

    }






    /**
     * Service to get Knit group qty 
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupQtySummaryForPo(reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitGroupQtySummaryResp> {
        const { unitCode, companyCode, userId, username, processingSerial, processType, productCode, fgColor } = reqObj;
        const moInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType, unitCode, companyCode }, select: ['moProductSubLineId'] });
        if (!moInfo.length) {
            throw new ErrorResponse(0, 'Po Information not found. Please check and try again')
        }
        const moSubLineIds = moInfo.map(mo => mo.moProductSubLineId);
        const knitGroupInfoForPo = await this.getKnitGroupInfoForMOProductCodeAndFgColor(processType, moSubLineIds, reqObj.productCode, reqObj.fgColor, unitCode, companyCode);
        const knitGroupSummaryArray: KC_KnitGroupQtySummaryModel[] = [];
        const poSizes = await this.poSubLineRepo.getDistinctSizesForPoProductCodeAndFgColor(processType, processingSerial, reqObj.productCode, reqObj.fgColor, unitCode, companyCode);
        const key = `${reqObj.productCode}-${reqObj.fgColor}`;
        for (const eachProcessType of knitGroupInfoForPo.processTypesList) {
            for (const eachKnitGroup of eachProcessType.subProcessList) {
                const itemCodesForRmType = eachKnitGroup.bomList.filter(item => item.bomItemType == BomItemTypeEnum.RM);
                if (!itemCodesForRmType.length) {
                    throw new ErrorResponse(0, 'RM Info not found for the given knit group' + `${eachKnitGroup.subProcessName}`)
                }
                const overallItemCodes = itemCodesForRmType.map((eachBom) => {
                    return eachBom.bomItemCode;
                });
                const knitGroupComponents = eachKnitGroup.components.map((eachComp) => {
                    return eachComp.compName;
                });
                const knitGroupSizeQty: kc_SizeWiseKnitGroupQtyInfo[] = [];
                if (reqObj.iNeedSizesInfo) {
                    for (const eachSize of poSizes) {
                        let sizeKnitRatio = 0;
                        const knitRatioQty = await this.getKnitRatioForPoAndKnitGroup(processType, processingSerial, unitCode, companyCode, eachKnitGroup.subProcessName);
                        console.log(knitRatioQty);
                        if (knitRatioQty) {
                            const knitRatioMap = knitRatioQty.get(key)?.get(eachSize.size);
                            if (knitRatioMap) {
                                sizeKnitRatio = knitRatioMap;
                            }
                        }
                        const knitGroupSizeObj = new kc_SizeWiseKnitGroupQtyInfo(eachSize.size, sizeKnitRatio);
                        knitGroupSizeQty.push(knitGroupSizeObj);
                    }
                }
                const knitGroupSummaryObj = new KC_KnitGroupQtySummaryModel(eachKnitGroup.subProcessName, overallItemCodes, knitGroupComponents, knitGroupSizeQty);
                knitGroupSummaryArray.push(knitGroupSummaryObj);
            }
        }
        return new KC_KnitGroupQtySummaryResp(true, 0, 'Knit Group Summary Retrieved Successfully For Given PO', knitGroupSummaryArray);
    }


    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async deleteKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, userId, username, processingSerial, processType } = reqObj;
        try {
            const knitRatioInfo = await this.knitJobRatioRepo.findOne({ where: { id: reqObj.knitRatioId, unitCode, companyCode, isActive: true, processingSerial, processType }, select: ['jobsConfirmStatus', 'jobsGenStatus'] });
            if (knitRatioInfo.jobsConfirmStatus != KC_KnitJobConfStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Knit Ratio Already Confirmed . You cannot delete the knit Ratio')
            }
            if (knitRatioInfo.jobsGenStatus != KC_KnitJobGenStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Knit Ratio Already has Jobs . You cannot delete the knit Ratio')
            }
            await manager.startTransaction();
            const knitRatioLines = await this.knitJobRatioLineRepo.find({ where: { poKnitJobRatioId: reqObj.knitRatioId, unitCode, companyCode } });
            for (const eachKnitRatioLine of knitRatioLines) {
                await manager.getRepository(PoKnitJobRatioSubLineEntity).delete({ poKnitJobRatioLineId: eachKnitRatioLine.id, unitCode, companyCode });
            }
            await manager.getRepository(PoKnitJobRatioLineEntity).delete({ poKnitJobRatioId: reqObj.knitRatioId, unitCode, companyCode });
            await manager.getRepository(PoKnitJobRatioEntity).delete({ id: reqObj.knitRatioId, unitCode, companyCode });
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Knit Ratio Deleted Successfully. ');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
        
    }

    /**
     * Service to get Knit group qty fir given knit Group
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupQtySummaryForPoAndKnitGroup(reqObj: KC_KnitGroupPoSerialRequest): Promise<KC_KnitGroupQtySummaryResp> {
       
        const { unitCode, companyCode, userId, username, processingSerial, processType } = reqObj;
        const moInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType, unitCode, companyCode }, select: ['moProductSubLineId'] });
        const moSubLineIds = moInfo.map(mo => mo.moProductSubLineId);
        const knitGroupInfoForPo = await this.getKnitGroupInfoForMOProductCodeAndFgColor(processType, moSubLineIds, reqObj.productCode, reqObj.fgColor, unitCode, companyCode);
        const knitGroupSummaryArray: KC_KnitGroupQtySummaryModel[] = [];
        const poSizes = await this.poSubLineRepo.getDistinctSizesForPoProductCodeAndFgColor(processType, processingSerial, reqObj.productCode, reqObj.fgColor, unitCode, companyCode);
        const key = `${reqObj.productCode}-${reqObj.fgColor}`;
        for (const eachProcessType of knitGroupInfoForPo.processTypesList) {
            for (const eachKnitGroup of eachProcessType.subProcessList) {
                if (eachKnitGroup.subProcessName == reqObj.knitGroup) {
                    const itemCodesForRmType = eachKnitGroup.bomList.filter(item => item.bomItemType == BomItemTypeEnum.RM);
                    if (!itemCodesForRmType.length) {
                        throw new ErrorResponse(0, 'RM Info not found for the given knit group' + `${eachKnitGroup.subProcessName}`)
                    }
                    const overallItemCodes = itemCodesForRmType.map((eachBom) => {
                        return eachBom.bomItemCode;
                    });
                    const knitGroupComponents = eachKnitGroup.components.map((eachComp) => {
                        return eachComp.compName;
                    });
                    const knitGroupSizeQty: kc_SizeWiseKnitGroupQtyInfo[] = [];
                    if (reqObj.iNeedSizesInfo) {
                        for (const eachSize of poSizes) {
                            let sizeKnitRatio = 0;
                            const knitRatioQty = await this.getKnitRatioForPoAndKnitGroup(processType, processingSerial, unitCode, companyCode, eachKnitGroup.subProcessName);
                            if (knitRatioQty) {
                                const knitRatioMap = knitRatioQty.get(key)?.get(eachSize.size);
                                if (knitRatioMap) {
                                    sizeKnitRatio = knitRatioMap;
                                }
                            }
                            const knitGroupSizeObj = new kc_SizeWiseKnitGroupQtyInfo(eachSize.size, sizeKnitRatio);
                            knitGroupSizeQty.push(knitGroupSizeObj);
                        }
                    }
                    const knitGroupSummaryObj = new KC_KnitGroupQtySummaryModel(eachKnitGroup.subProcessName, overallItemCodes, knitGroupComponents, knitGroupSizeQty);
                    knitGroupSummaryArray.push(knitGroupSummaryObj);
                }
            }
        }
        return new KC_KnitGroupQtySummaryResp(true, 0, 'Knit Group Summary Retrieved Successfully For Given PO', knitGroupSummaryArray);
    }

    /**
     * Service to get knit group ratio Info For PO 
     * Calls from UI to display Ratio Wise information for PO
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupRatioInfoForPo(reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitGroupRatioResponse> {
        const { unitCode, companyCode, userId, username, processingSerial, processType } = reqObj;
        const ratiosForPo: KC_KnitGroupRatioModel[] = [];
        const knitRatiosInfo = await this.knitJobRatioRepo.getRatioInfoByProductFgColor(processingSerial, unitCode, companyCode, processType, reqObj.productCode, reqObj.fgColor)
        const moInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType, unitCode, companyCode }, select: ['moProductSubLineId'] });
        const moSubLineIds = moInfo.map(mo => mo.moProductSubLineId);
        for (const eachKnitRatio of knitRatiosInfo) {
            const productFgColorMap = new Map<string, Map<string, Map<string, PoKnitJobRatioSubLineEntity[]>>>();
            const productInfo = await this.poProductRepo.findOne({ where: { processingSerial, unitCode, companyCode, productRef: eachKnitRatio.productRef } });
            if (!productInfo) {
                throw new ErrorResponse(0, 'Product Info not found for the given Product ref. Please check and try again' + eachKnitRatio.productRef);
            }
            const knitRatioLineInfo = await this.knitJobRatioLineRepo.find({ where: { poKnitJobRatioId: eachKnitRatio.id, unitCode, companyCode, isActive: true, processingSerial, processType }, select: ['id'] });
            for (const knitRatioLine of knitRatioLineInfo) {
                const knitRatioSubLine = await this.knitJobRatioSubLineRepo.find({ where: { poKnitJobRatioLineId: knitRatioLine.id, unitCode, companyCode, processingSerial, processType } });
                for (const eachSubLine of knitRatioSubLine) {
                    if (!productFgColorMap.has(productInfo.productType)) {
                        productFgColorMap.set(productInfo.productType, new Map<string, Map<string, PoKnitJobRatioSubLineEntity[]>>());
                    }
                    if (!productFgColorMap.get(productInfo.productType).has(productInfo.productCode)) {
                        productFgColorMap.get(productInfo.productType).set(productInfo.productCode, new Map<string, PoKnitJobRatioSubLineEntity[]>());
                    }
                    if (!productFgColorMap.get(productInfo.productType).get(productInfo.productCode).has(eachSubLine.fgColor)) {
                        productFgColorMap.get(productInfo.productType).get(productInfo.productCode).set(eachSubLine.fgColor, [])
                    }
                    productFgColorMap.get(productInfo.productType).get(productInfo.productCode).get(eachSubLine.fgColor).push(eachSubLine);
                }


            };
            for (const [productType, prodTypeInfo] of productFgColorMap) {
                for (const [productCode, prodCodeInfo] of prodTypeInfo) {
                    for (const [fgColor, subLineInfo] of prodCodeInfo) {
                        const knitGroupInfoForPo: MOC_OpRoutingModel = await this.getKnitGroupInfoForMOProductCodeAndFgColor(processType, moSubLineIds, productCode, fgColor, unitCode, companyCode);
                        const knitGroupCodeAndInfoMap = new Map<string, MOC_OpRoutingSubProcessList>();
                        for (const eachProcessType of knitGroupInfoForPo.processTypesList) {
                            for (const eachKnitGroup of eachProcessType.subProcessList) {
                                if (!knitGroupCodeAndInfoMap.has(eachKnitGroup.subProcessName)) {
                                    knitGroupCodeAndInfoMap.set(eachKnitGroup.subProcessName, eachKnitGroup);
                                }
                            }
                        }
                        const knitGroupInfo = knitGroupCodeAndInfoMap.get(eachKnitRatio.groupCode);
                        if (!knitGroupInfo) {
                            throw new ErrorResponse(0, 'Knit Group related information not found in OMS' + eachKnitRatio.groupCode);
                        }
                        const itemCodesForRmType = knitGroupInfo.bomList.filter(item => item.bomItemType == BomItemTypeEnum.RM);
                        if (!itemCodesForRmType.length) {
                            throw new ErrorResponse(0, 'RM Info not found for the given knit group' + `${knitGroupInfo.subProcessName}`)
                        }
                        const overallItemCodes = itemCodesForRmType.map((eachBom) => {
                            return eachBom.bomItemCode;
                        });
                        const knitGroupComponents = knitGroupInfo.components.map((eachComp) => {
                            return eachComp.compName;
                        });
                        const ratioSizeInfo: KC_KnitGroupSizeRatioModel[] = subLineInfo.map((eachSubLine) => {
                            return new KC_KnitGroupSizeRatioModel(eachSubLine.size, eachSubLine.quantity, eachSubLine.maxJobQty, eachSubLine.logicalBundleQty);
                        });
                        const statusInfo = new KC_KnitGroupRatioStatusModel(eachKnitRatio.jobsGenStatus, eachKnitRatio.jobsConfirmStatus);
                        const knitRatioObj = new KC_KnitGroupRatioModel(eachKnitRatio.groupCode, productInfo.productType, productInfo.productCode, productInfo.productName, processingSerial, fgColor, eachKnitRatio.ratioKnitJobQty, ratioSizeInfo, statusInfo, overallItemCodes, knitGroupComponents, eachKnitRatio.ratioCode, eachKnitRatio.ratioDesc, eachKnitRatio.id,eachKnitRatio.remarks);
                        ratiosForPo.push(knitRatioObj);
                    }
                }
            }
        }
        return new KC_KnitGroupRatioResponse(true, 0, 'Ratio Info Retrieved Successfully.', ratiosForPo);
    }


    /**
     * Service to get component level Item consumption for given knit group
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getComponentLevelItemConsumptionForKnitGroup(reqObj: KC_KnitGroupPoSerialRequest): Promise<MOC_MoProductFabConsResponse> {
        const { unitCode, companyCode, userId, username, processingSerial, processType } = reqObj;
        const moInfo = await this.poSubLineRepo.find({ where: { processingSerial, processType, unitCode, companyCode }, select: ['moProductSubLineId'] });
        const moSubLineIds = moInfo.map(mo => mo.moProductSubLineId);
        const componentSizeConsumptionDetail = await this.getSizeWiseComponentConsumptionForPoForProduct(processType, moSubLineIds, reqObj.productCode, reqObj.fgColor, unitCode, companyCode)
        return new MOC_MoProductFabConsResponse(true, 0, 'Consumption Details Retrieved Successfully.', componentSizeConsumptionDetail);
    }


    /**
     * TODO: Service to get Knit Group Info For PO   --DONE
     * Getting Knit group information by calling OMS module , since the original knit group infomation will be available over there by sending PSLB ids
     * Helper function to get the knit group information 
     * @param processType 
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
    */
    async getKnitGroupInfoForMOProductCodeAndFgColor(processType: ProcessTypeEnum, moProductSubLineId: number[], productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<MOC_OpRoutingModel> {
        // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
        // should return the SOC_OpRoutingModel for given product code and fg color
        const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);
        console.log(routingReq);
        const opRoutingDetails: MOC_OpRoutingResponse = await this.moRoutingService.getKnitGroupInfoForMOProductSubLineDetails(routingReq);
        if (!opRoutingDetails.status) {
            throw new ErrorResponse(opRoutingDetails.errorCode, opRoutingDetails.internalMessage);
        }
        const opRoutingForProductAndFgColor = opRoutingDetails.data.find(route => route.fgColor == fgColor && route.prodName == productCode);
        if (!opRoutingForProductAndFgColor) {
            throw new ErrorResponse(0, 'Knit group details not found for the given mo Product sub line Ids')
        }
        return opRoutingForProductAndFgColor;
    }

    /**
     * TODO: Service to get the size wise component consumption details for the given PO    --DONE
     * @param processType 
     * @param moProductSubLineId 
     * @param productCode 
     * @param fgColor 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getSizeWiseComponentConsumptionForPoForProduct(processType: ProcessTypeEnum, moProductSubLineId: number[], productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<MOC_MoProductFabConsumptionModel[]> {
        // Need to get the size, component wise single piece consumption for each item against to given 
        // should return the consumption details for given product code + fg color + item code + component
        const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);
        const fabDetails: MOC_MoProductFabConsResponse = await this.orderConfigService.getSizeWiseComponentConsumptionForSubLineIds(routingReq);
        if (!fabDetails.status) {
            throw new ErrorResponse(fabDetails.errorCode, fabDetails.internalMessage);
        }
        const consumptionDetailForProductAndFgColor = fabDetails.data.filter(route => route.fgColor == fgColor && route.productCode == productCode);
        if (!consumptionDetailForProductAndFgColor) {
            throw new ErrorResponse(0, 'Size wise component consumption details not found please check and try again')
        }
        return consumptionDetailForProductAndFgColor;
    }

    /**
     * TODO: Service to get the size wise component consumption details for the given PO --DONE
     * @param processType 
     * @param moProductSubLineId 
     * @param productCode 
     * @param fgColor 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getSizeWiseComponentConsumptionForPo(processType: ProcessTypeEnum, moProductSubLineId: number[], unitCode: string, companyCode: string): Promise<MOC_MoProductFabConsumptionModel[]> {
        // Need to get the size, component wise single piece consumption for each item against to given 
        // should return the consumption details for given product code + fg color + item code + component
        const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);
        const fabDetails: MOC_MoProductFabConsResponse = await this.orderConfigService.getSizeWiseComponentConsumptionForSubLineIds(routingReq);
        if (!fabDetails.status) {
            throw new ErrorResponse(fabDetails.errorCode, fabDetails.internalMessage);
        }
        return fabDetails.data;
    }

    

}
