import { Injectable } from "@nestjs/common";
import { MoOpProcessTypeRepository } from "./repository/mo-op-proc-type.repository";
import { MoOpSubProcessBomRepository } from "./repository/mo-op-sub-proc-bom.repository";
import { MoOpSubProcessComponentRepository } from "./repository/mo-op-sub-proc-comp.repository";
import { MoOpSubProcessOpRepository } from "./repository/mo-op-sub-process-op.repository";
import { MoOpSubProcessRepository } from "./repository/mo-op-sub-process.repository";
import { MoOpVersionRepository } from "./repository/mo-op-version.repository";
import { MOProductFgColorRepository } from "./repository/mo-product-fg-color.repository";
import { BomItemTypeEnum, GlobalResponseObject, MC_ProductSubLineProcessTypeRequest, MC_StyleMoNumbersRequest, MOC_OpRoutingBomList, MOC_OpRoutingCompsList, MOC_OpRoutingModel, MOC_OpRoutingOpsList, MOC_OpRoutingProcessTypeList, MOC_OpRoutingResponse, MOC_OpRoutingRetrievalRequest, MOC_OpRoutingSubProcessList, MOC_SubProcessAndProcessTypeModel, MOCProductFgColorVersionRequest, MOP_OpRoutingModel, MOP_OpRoutingRetrievalRequest, MoProductFgColorReq, OMS_R_MoOperationsListInfoResponse, OMS_R_MoStyleProdColOperationsListModel, OMS_R_MoStyleProdColOperationsListOpGroupModel, OMS_R_MoStyleProdColOperationsListOpModel, OpVersionAbstractModel, OpVersionAbstractResponse, OpVersionCheckResponse, PhItemCategoryEnum, ProcessTypeEnum, RoutingGroupDetail, RoutingGroupDetailsResponse, SI_MoNumberRequest, StyleOpRoutingResponse } from "@xpparel/shared-models";
import { StyleOpRoutingService } from "../style-management/style-op-routing.service";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { DataSource, In } from "typeorm";
import { ErrorResponse } from "@xpparel/backend-utils";
import { MoOpVersionEntity } from "./entity/mo-op-version.entity";
import { MoOpProcTypeEntity } from "./entity/mo-op-proc-type.entity";
import { MoOpSubprocessEntity } from "./entity/mo-op-sub-process.entity";
import { MoOpSubProcessOPEntity } from "./entity/mo-op-sub-process-op.entity";
import { MoOpSubProcessComponentEntity } from "./entity/mo-op-sub-proc-comp.entity";
import { MoOpSubProcessBomEntity } from "./entity/mo-op-sub-proc-bom.entity";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { MoItemConsumptionEntity } from "./entity/mo-item-consumption.entity";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { FgSkuEntity } from "../style-management/entity/fg-sku.entity";
import { RawMaterialInfoRepository } from "../repository/rm-info.repository";


@Injectable()
export class MoOpRoutingService {
    constructor(
        private dataSource: DataSource,
        private moProductFgColorRepo: MOProductFgColorRepository,
        private moOpVersionRepo: MoOpVersionRepository,
        private moOpProcessTypeRepo: MoOpProcessTypeRepository,
        private moOpSubProcessRepo: MoOpSubProcessRepository,
        private moOpSubProcessBomRepo: MoOpSubProcessBomRepository,
        private moOpSubProcessOpRepo: MoOpSubProcessOpRepository,
        private moOpSubProcessCompRepo: MoOpSubProcessComponentRepository,
        private styleOpVersionService: StyleOpRoutingService,
        private moProductSubLineRepo: MoProductSubLineRepository,
        private moInfoRepo: MoInfoRepository,
        private moItemRepo: RawMaterialInfoRepository

    ) {

    }

    /**
     * Service to save op Version for MO product and FG color
     * Usually calls from UI, after user selects the op version against to MO + PRODUCT CODE + FG COLOR
     * @param reqModel 
     * @returns 
    */
    async saveOpVersionForMoProductFgColor(reqModel: MOCProductFgColorVersionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, username, userId } = reqModel;
        const orderInfo = await this.moInfoRepo.findOne({ where: { moNumber: reqModel?.moNumber, unitCode, companyCode, isActive: true } });
        if (orderInfo.isConfirmed == 1) {
            throw new ErrorResponse(0, 'Manufacturing order already confirmed version cannot be Modified.')
        }
        try {
            const versionInfoReq = new MOP_OpRoutingRetrievalRequest(username, unitCode, companyCode, userId, reqModel.styleCode, reqModel.productType, reqModel.versionId, true, true)
            const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
            if (!moProductFgColorInfo) {
                throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
            }
            const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
            await manager.startTransaction();

            if (moProductFgColorVersion) {
                // throw new ErrorResponse(0, 'Operation Version already there for the given MO, Product Code and FG Color');
                await this.deleteVersionInfoWithManager(moProductFgColorInfo.id, unitCode, companyCode, manager);

            }
            const moOpVersionInfo: StyleOpRoutingResponse = await this.styleOpVersionService.getOpVersionInfoForStyleAndProductType(versionInfoReq);
            if (!moOpVersionInfo.status) {
                throw new ErrorResponse(moOpVersionInfo.errorCode, moOpVersionInfo.internalMessage);
            };
            const actualVersion: MOP_OpRoutingModel = moOpVersionInfo.data;

            const fgSkuCheck = await manager.getRepository(FgSkuEntity).findOne({ where: { styleCode: reqModel.styleCode, productCode: reqModel.productCode, fgColor: reqModel.fgColor } });
            if (!fgSkuCheck) {
                throw new ErrorResponse(0, 'FG SKU not found please check and try again');
            };
            const opVersionEntity = new MoOpVersionEntity();
            opVersionEntity.companyCode = companyCode;
            opVersionEntity.createdUser = username;
            opVersionEntity.description = actualVersion.desc;
            opVersionEntity.moProductFgColorId = moProductFgColorInfo.id;
            opVersionEntity.unitCode = unitCode;
            opVersionEntity.version = actualVersion.version;
            opVersionEntity.parentVersion = actualVersion.version;
            opVersionEntity.parentVersionId = actualVersion.versionId;
            const opVersionDetail = await manager.getRepository(MoOpVersionEntity).save(opVersionEntity);
            for (const eachProcessType of actualVersion.processTypesList) {
                const opProcessTypeEntity = new MoOpProcTypeEntity();
                opProcessTypeEntity.companyCode = companyCode;
                opProcessTypeEntity.createdUser = username;
                opProcessTypeEntity.depProcType = eachProcessType.depProcessType.toString();
                opProcessTypeEntity.order = eachProcessType.processOrder;
                opProcessTypeEntity.procType = eachProcessType.processType;
                opProcessTypeEntity.moOpVersionId = opVersionDetail.id;
                opProcessTypeEntity.unitCode = unitCode;
                opProcessTypeEntity.routingGroup = eachProcessType.routingGroup;
                opProcessTypeEntity.bundleQty = eachProcessType.bundleQuantity;
                opProcessTypeEntity.outPutBundleQty = eachProcessType.outPutBundleQty;
                opProcessTypeEntity.outPutItemSku = `${eachProcessType.processType.substring(0, 3)}-${fgSkuCheck.id.toString().padStart(5, '0')}`;
                opProcessTypeEntity.isBundlingOps = eachProcessType.isBundlingOps;
                const processTypeDetail = await manager.getRepository(MoOpProcTypeEntity).save(opProcessTypeEntity);
                for (const eachSubProcess of eachProcessType.subProcessList) {
                    const itemCodesOfSuProcess = new Set<string>();
                    const componentsOfSubProcess = new Set<string>();
                    const subProcessEntity = new MoOpSubprocessEntity()
                    subProcessEntity.companyCode = companyCode;
                    subProcessEntity.createdUser = username;
                    subProcessEntity.order = eachSubProcess.order;
                    subProcessEntity.outPutItemSku = eachSubProcess.outPutSku;
                    subProcessEntity.procType = eachProcessType.processType;
                    subProcessEntity.processTypeId = processTypeDetail.id;
                    subProcessEntity.subProcessName = eachSubProcess.subProcessName;
                    subProcessEntity.unitCode = unitCode;
                    subProcessEntity.depSubProcesses = eachSubProcess.dependentSubProcesses.toString();
                    const subProcessDetail = await manager.getRepository(MoOpSubprocessEntity).save(subProcessEntity);
                    for (const eachSubProcessBom of eachSubProcess.operations) {
                        const subProcessOpEntity = new MoOpSubProcessOPEntity();
                        subProcessOpEntity.companyCode = companyCode;
                        subProcessOpEntity.createdUser = username;
                        subProcessOpEntity.opCode = eachSubProcessBom.opCode;
                        subProcessOpEntity.opName = eachSubProcessBom.opName;
                        subProcessOpEntity.order = eachSubProcessBom.opOrder;
                        subProcessOpEntity.procType = eachProcessType.processType;
                        subProcessOpEntity.smv = 0;
                        subProcessOpEntity.subProcessId = subProcessDetail.id;
                        subProcessOpEntity.unitCode = unitCode;
                        subProcessOpEntity.subProcessName = subProcessDetail.subProcessName;
                        subProcessOpEntity.opGroup = eachSubProcessBom.opGroup;
                        await manager.getRepository(MoOpSubProcessOPEntity).save(subProcessOpEntity);
                    }
                    for (const eachSubProcessBom of eachSubProcess.bomList) {
                        const subProcessBomEntity = new MoOpSubProcessBomEntity();
                        subProcessBomEntity.bomItemCode = eachSubProcessBom.bomItemCode;
                        subProcessBomEntity.companyCode = companyCode;
                        subProcessBomEntity.createdUser = username;
                        subProcessBomEntity.bomItemDesc = eachSubProcessBom.bomItemDesc;
                        subProcessBomEntity.bomItemType = eachSubProcessBom.bomItemType
                        subProcessBomEntity.bomSku = eachSubProcessBom.bomItemCode;
                        subProcessBomEntity.procType = eachSubProcess.processType;
                        subProcessBomEntity.subProcessId = subProcessDetail.id;
                        subProcessBomEntity.unitCode = unitCode;
                        subProcessBomEntity.subProcessName = subProcessDetail.subProcessName;
                        subProcessBomEntity.consumption = 1;
                        if (eachSubProcessBom.bomItemType == BomItemTypeEnum.RM) {
                            const itemConsumption = await this.moItemRepo.findOne({ where: { moNumber: reqModel.moNumber, unitCode, companyCode, itemCode: eachSubProcessBom.bomItemCode } });
                            itemCodesOfSuProcess.add(eachSubProcessBom.bomItemCode);
                            if (itemConsumption) {
                                subProcessBomEntity.consumption = itemConsumption.consumption;
                            }
                        }
                        await manager.getRepository(MoOpSubProcessBomEntity).save(subProcessBomEntity);
                    }
                    for (const eachSubProcessComp of eachSubProcess.components) {
                        componentsOfSubProcess.add(eachSubProcessComp.compName);
                        const subProcessCompEntity = new MoOpSubProcessComponentEntity();
                        subProcessCompEntity.componentName = eachSubProcessComp.compName;
                        subProcessCompEntity.procType = eachProcessType.processType;
                        subProcessCompEntity.subProcessId = subProcessDetail.id;
                        subProcessCompEntity.subProcessName = subProcessDetail.subProcessName;
                        await manager.getRepository(MoOpSubProcessComponentEntity).save(subProcessCompEntity);
                    }
                }
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Operation Version Saved Successfully For Given MO Product Code and FG Color');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }


    async deleteVersionInfoWithManager(moProductFgColorId: number, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
        const version = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId, unitCode, companyCode, isActive: true }, });
        if (!version) return false;
        const processTypes = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: version.id, unitCode, companyCode, isActive: true }, });
        for (const processType of processTypes) {
            const subProcesses = await this.moOpSubProcessRepo.find({ where: { processTypeId: processType.id, unitCode, companyCode } });
            if (subProcesses.length > 0) {
                const subProcessIds = subProcesses.map(s => s.id);

                await manager.getRepository(MoOpSubProcessBomEntity).delete({ subProcessId: In(subProcessIds), unitCode, companyCode });
                await manager.getRepository(MoOpSubProcessComponentEntity).delete({ subProcessId: In(subProcessIds) });
                await manager.getRepository(MoOpSubProcessOPEntity).delete({ subProcessId: In(subProcessIds), unitCode, companyCode });
                await manager.getRepository(MoOpSubprocessEntity).delete({ processTypeId: processType.id, unitCode, companyCode });
            }
        }
        await manager.getRepository(MoOpProcTypeEntity).delete({ moOpVersionId: version.id, unitCode, companyCode });
        await manager.getRepository(MoOpVersionEntity).delete({ id: version.id, unitCode, companyCode, });

        return true;
    }

    /**
     * Service to delete op Version for MO product and FG color
     * @param req 
     * @returns 
     */
    async deleteOperationVersionForMo(req: MOCProductFgColorVersionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, username, userId } = req;

        try {
            const orderInfo = await this.moInfoRepo.findOne({ where: { moNumber: req?.moNumber, unitCode, companyCode, isActive: true } });
            if (!orderInfo) {
                throw new ErrorResponse(0, 'Manufacturing order info not found. Please check and try again')
            }
            if (orderInfo.isConfirmed == 1) {
                throw new ErrorResponse(0, 'MO already confirmed Operation Version Cannot be deleted.')
            }
            const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: req.styleCode, fgColor: req.fgColor, productCode: req.productCode, moNumber: req.moNumber } });
            await manager.startTransaction();
            await this.deleteVersionInfoWithManager(moProductFgColorInfo.id, unitCode, companyCode, manager);
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Operation version  deleted successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }


    }
    /**
     * Service to get operation version details for the given Mo product and fg Color info
     * @param reqModel 
     * @returns 
    */
    async getOpVersionForMoProductFgColor(reqModel: MOC_OpRoutingRetrievalRequest): Promise<MOC_OpRoutingResponse> {
        const { unitCode, companyCode, username, userId } = reqModel;
        const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
        if (!moProductFgColorInfo) {
            throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
        }
        const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
        if (!moProductFgColorVersion) {
            throw new ErrorResponse(0, 'Operation Version Not there for the given Mo, Product Code and FG Color');
        };
        const processingTypeListForOpVersion: MOC_OpRoutingProcessTypeList[] = [];
        const processingTypeInfo = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: moProductFgColorVersion.id, unitCode, companyCode, isActive: true } });
        const allProcessTypeIds = processingTypeInfo.map(pt => pt.id);
        const allSubProcess = await this.moOpSubProcessRepo.find({ where: { processTypeId: In(allProcessTypeIds), unitCode, companyCode, isActive: true } });
        const subProcessIsReqNeededMap = new Map<string, boolean>();
        let isRequestNeeded = false;
        for (let i = 0; i < processingTypeInfo.length; i++) {
            const eachProcessType = processingTypeInfo[i];
            const subProcesses = allSubProcess.filter(sp => sp.procType == eachProcessType.procType);
            // Map all subProcesses of current processType
            for (let j = 0; j < subProcesses.length; j++) {
                const eachSubProcess = subProcesses[j];
                if (!subProcessIsReqNeededMap.has(eachSubProcess.subProcessName)) {
                    subProcessIsReqNeededMap.set(eachSubProcess.subProcessName, isRequestNeeded);
                    // Only first subProcess consumes the flag → reset it immediately
                    if (isRequestNeeded) {
                        isRequestNeeded = false;
                    }
                }
            }
            // Prepare isRequestNeeded for NEXT process type
            if (eachProcessType.outPutBundleQty > 0) {
                isRequestNeeded = true;
            }
        };
        for (const eachProcessType of processingTypeInfo) {
            const suProcessListForProcType: MOC_OpRoutingSubProcessList[] = [];
            const subProcessDetails = await this.moOpSubProcessRepo.find({ where: { processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true } });
            for (const eachSubProcess of subProcessDetails) {
                const subProcessBomDetails = await this.moOpSubProcessBomRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessOpDetails = await this.moOpSubProcessOpRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessCompDetails = await this.moOpSubProcessCompRepo.find({ where: { subProcessId: eachSubProcess.id } });
                const bomDetail = subProcessBomDetails.map((eachBom) => {
                    return new MOC_OpRoutingBomList(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemDesc, eachBom.itemType, eachBom.bomItemType, eachBom.bomItemType == BomItemTypeEnum.RM ? false : true, eachBom.consumption)
                });
                const opDetail = subProcessOpDetails.map((eachOp) => {
                    return new MOC_OpRoutingOpsList(eachOp.opCode, eachOp.opName, eachOp.order, eachOp.smv, eachOp.procType, eachOp.opGroup)
                });
                const componentDetail = subProcessCompDetails.map((eachComp) => {
                    return new MOC_OpRoutingCompsList(eachComp.componentName, eachComp.componentName, []);
                });
                const depSubProcessInfo = [];
                if (eachSubProcess.depSubProcesses != 'N/A') {
                    for (const eachSub of eachSubProcess.depSubProcesses.split(',')) {
                        const processType = allSubProcess.find(sp => sp.subProcessName == eachSub);
                        // const depProcessTypeInfo = processingTypeInfo.find(pt =>  pt.procType == eachSubProcess.procType);
                        const subProcessObj = new MOC_SubProcessAndProcessTypeModel(eachSub, processType.procType, processType.outPutItemSku);
                        depSubProcessInfo.push(subProcessObj);
                    }
                }
                const subProcessObj = new MOC_OpRoutingSubProcessList(eachProcessType.procType, eachSubProcess.subProcessName, bomDetail, depSubProcessInfo, opDetail, eachSubProcess.order, eachSubProcess.outPutItemSku, subProcessIsReqNeededMap.get(eachSubProcess.subProcessName), componentDetail);
                suProcessListForProcType.push(subProcessObj);
            }
            const processingTypeInfo = new MOC_OpRoutingProcessTypeList(eachProcessType.procType, eachProcessType.order, eachProcessType.depProcType.split(','), suProcessListForProcType, eachProcessType.routingGroup, eachProcessType.bundleQty, eachProcessType.isBundlingOps, eachProcessType.isOperatorLevelTracking, eachProcessType.isInventoryItem, eachProcessType.outPutBundleQty, eachProcessType.outPutItemSku);
            processingTypeListForOpVersion.push(processingTypeInfo);
        }
        const opRoutingModel = new MOC_OpRoutingModel(moProductFgColorVersion.version, moProductFgColorVersion.description, reqModel.styleCode, reqModel.fgColor, reqModel.productCode, null, processingTypeListForOpVersion);
        return new MOC_OpRoutingResponse(true, 0, '', [opRoutingModel])
    }

    /**
     * Service to get operation version details for the given Mo product and fg Color info and process type
     * @param reqModel 
     * @returns 
    */
    async getOpVersionForMoProductFgColorAndProcessType(reqModel: MOC_OpRoutingRetrievalRequest, processType: ProcessTypeEnum): Promise<MOC_OpRoutingResponse> {
        const { unitCode, companyCode, username, userId } = reqModel;
        const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
        if (!moProductFgColorInfo) {
            throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
        }
        const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
        if (!moProductFgColorVersion) {
            throw new ErrorResponse(0, 'Operation Version Not there for the given Mo, Product Code and FG Color');
        };
        const processingTypeListForOpVersion: MOC_OpRoutingProcessTypeList[] = [];
        const allProcessingTypeInfo = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: moProductFgColorVersion.id, unitCode, companyCode, isActive: true } });
        const allProcessTypeIds = allProcessingTypeInfo.map(pt => pt.id);
        const allSubProcess = await this.moOpSubProcessRepo.find({ where: { processTypeId: In(allProcessTypeIds), unitCode, companyCode, isActive: true } });
        const subProcessIsReqNeededMap = new Map<string, boolean>();
        let isRequestNeeded = false;
        for (let i = 0; i < allProcessingTypeInfo.length; i++) {
            const eachProcessType = allProcessingTypeInfo[i];
            const subProcesses = allSubProcess.filter(sp => sp.procType == eachProcessType.procType);
            // Map all subProcesses of current processType
            for (let j = 0; j < subProcesses.length; j++) {
                const eachSubProcess = subProcesses[j];
                if (!subProcessIsReqNeededMap.has(eachSubProcess.subProcessName)) {
                    subProcessIsReqNeededMap.set(eachSubProcess.subProcessName, isRequestNeeded);
                    // Only first subProcess consumes the flag → reset it immediately
                    if (isRequestNeeded) {
                        isRequestNeeded = false;
                    }
                }
            }
            // Prepare isRequestNeeded for NEXT process type
            if (eachProcessType.isInventoryItem) {
                isRequestNeeded = true;
            }
        };
        const processingTypeInfo = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: moProductFgColorVersion.id, unitCode, companyCode, isActive: true, procType: processType } });
        for (const eachProcessType of processingTypeInfo) {
            const suProcessListForProcType: MOC_OpRoutingSubProcessList[] = [];
            const subProcessDetails = await this.moOpSubProcessRepo.find({ where: { processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true } });
            for (const eachSubProcess of subProcessDetails) {
                const subProcessBomDetails = await this.moOpSubProcessBomRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessOpDetails = await this.moOpSubProcessOpRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessCompDetails = await this.moOpSubProcessCompRepo.find({ where: { subProcessId: eachSubProcess.id } });
                const bomDetail = subProcessBomDetails.map((eachBom) => {
                    return new MOC_OpRoutingBomList(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemDesc, eachBom.itemType, eachBom.bomItemType, eachBom.bomItemType == BomItemTypeEnum.RM ? false : true, eachBom.consumption)
                });
                const opDetail = subProcessOpDetails.map((eachOp) => {
                    return new MOC_OpRoutingOpsList(eachOp.opCode, eachOp.opName, eachOp.order, eachOp.smv, eachOp.procType, eachOp.opGroup)
                });
                const componentDetail = subProcessCompDetails.map((eachComp) => {
                    return new MOC_OpRoutingCompsList(eachComp.componentName, eachComp.componentName, []);
                });
                const depSubProcessInfo = [];
                for (const eachSub of eachSubProcess.depSubProcesses.split(',')) {
                    if (eachSubProcess.depSubProcesses != 'N/A') {
                        const processType = allSubProcess.find(sp => sp.subProcessName == eachSub);
                        const depProcessTypeInfo = allProcessingTypeInfo.find(pt => pt.procType == processType.procType);
                        const depSubProcessInfoForAll = allSubProcess.find(sp => sp.subProcessName == eachSub);
                        const subProcessObj = new MOC_SubProcessAndProcessTypeModel(eachSub, processType.procType, subProcessIsReqNeededMap.get(eachSubProcess.subProcessName) ? depProcessTypeInfo.outPutItemSku : depSubProcessInfoForAll.outPutItemSku);
                        depSubProcessInfo.push(subProcessObj);
                    }
                }
                const subProcessObj = new MOC_OpRoutingSubProcessList(eachProcessType.procType, eachSubProcess.subProcessName, bomDetail, depSubProcessInfo, opDetail, eachSubProcess.order, eachSubProcess.outPutItemSku, subProcessIsReqNeededMap.get(eachSubProcess.subProcessName), componentDetail);
                suProcessListForProcType.push(subProcessObj);
            }
            const processingTypeInfo = new MOC_OpRoutingProcessTypeList(eachProcessType.procType, eachProcessType.order, eachProcessType.depProcType.split(','), suProcessListForProcType, eachProcessType.routingGroup, eachProcessType.bundleQty, eachProcessType.isBundlingOps, eachProcessType.isOperatorLevelTracking, eachProcessType.isInventoryItem, eachProcessType.outPutBundleQty, eachProcessType.outPutItemSku);
            processingTypeListForOpVersion.push(processingTypeInfo);
        }
        const opRoutingModel = new MOC_OpRoutingModel(moProductFgColorVersion.version, moProductFgColorVersion.description, reqModel.styleCode, reqModel.fgColor, reqModel.productCode, null, processingTypeListForOpVersion);
        return new MOC_OpRoutingResponse(true, 0, '', [opRoutingModel])
    }


    /**
       * Service to get processing type details for the given  Mo Product And Fg Color
       * @param moNumber 
       * @param unitCode 
       * @param companyCode 
      */
    async getRoutingGroupDetailForGivenMoProductAndFgColor(reqModel: MOC_OpRoutingRetrievalRequest): Promise<RoutingGroupDetail[]> {
        const { unitCode, companyCode, username, userId } = reqModel;
        const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
        if (!moProductFgColorInfo) {
            throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
        }
        const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
        if (!moProductFgColorVersion) {
            throw new ErrorResponse(0, 'Operation Version Not there for the given Mo, Product Code and FG Color');
        }

        const processingTypeInfo = await this.moOpProcessTypeRepo.find({
            where: { moOpVersionId: moProductFgColorVersion.id, unitCode, companyCode, isActive: true },
            select: ['procType', 'bundleQty', 'routingGroup', 'outPutItemSku']
        });

        // Filter to ensure only one object per procType
        const uniqueProcessingTypes = new Map<ProcessTypeEnum, RoutingGroupDetail>();

        for (const item of processingTypeInfo) {
            if (!uniqueProcessingTypes.has(item.procType)) {
                uniqueProcessingTypes.set(item.procType, new RoutingGroupDetail(item.procType, item.routingGroup, item.bundleQty, item.outPutItemSku));
            }
        }

        return Array.from(uniqueProcessingTypes.values());
    }


    /** 
     * Service to check all the given MO + Style Code + Product Code + FG color having same op routing or not
     * Need to get the operation version using getOpVersionForMoProductFgColor for each object and compare with other versions in the array, focusing only on MOC_OpRoutingSubProcessList. If any deviation occurs, specify that deviation and throw an error.
     * If everything is the same, return true from the global object.
     * @param reqModel 
     * @returns 
    */
    async checkGivenMoProductAndFgColorsHavingSameOpRouting(reqModel: MOC_OpRoutingRetrievalRequest[]): Promise<GlobalResponseObject> {
        let referenceSubProcesses: MOC_OpRoutingSubProcessList[] | null = null;

        for (const request of reqModel) {
            const response = await this.getOpVersionForMoProductFgColor(request);

            if (!response.status || !response.data || response.data.length === 0) {
                throw new Error(`No operation routing found for MO: ${request.moNumber}, Style: ${request.styleCode}, Product: ${request.productCode}, FG Color: ${request.fgColor}`);
            }
            const subProcesses = response.data[0].processTypesList.map(pt => pt.subProcessList).flat();
            if (!referenceSubProcesses) {
                referenceSubProcesses = subProcesses;
            } else if (JSON.stringify(referenceSubProcesses) !== JSON.stringify(subProcesses)) {
                throw new Error(`Operation routing sub-process details are not consistent across requests.`);
            }
        }
        return new GlobalResponseObject(true, 0, 'All Operation Routings are same for given Style, Product, and FG Color');
    }



    /**
     * TODO: Need to call this when user selected style and mo numbers to get the pslb details for processing order creation
     * Service to check the given MOs having same kind of products and versions to give routing groups and bundle quantities
     * once the given MOs are same need to return the response given
     * @param reqObj 
    */
    async checkAndGetBundleGroupsForGivenMos(reqObj: MC_StyleMoNumbersRequest): Promise<RoutingGroupDetailsResponse> {
        const { unitCode, companyCode, } = reqObj;
        for (const eachMo of reqObj.moNumbers) {
            const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: eachMo, unitCode, companyCode } });
            if (!moInfo) {
                throw new ErrorResponse(0, 'MO does not exists please check and try again' + eachMo);
            }
            if (!moInfo.moProceedingStatus) {
                throw new ErrorResponse(0, 'MO is not accepted for next proceedings please check and try again' + eachMo)
            }
        }
        // await this.checkGivenMOsHavingSameOpVersions(reqObj);
        const moNumbers = reqObj.moNumbers.map(mo => mo);
        if (moNumbers.length === 0) {
            throw new ErrorResponse(400, "MO numbers list cannot be empty");
        }
        const records = await this.moProductFgColorRepo.find({ where: { moNumber: In(moNumbers), unitCode, companyCode } });
        const fgColorIds = records.map(record => record.id);
        const versions = await this.moOpVersionRepo.find({ where: { moProductFgColorId: In(fgColorIds), unitCode, companyCode } });
        const versionIds = versions.map(ver => ver.id);
        const routingGroupDetails = await this.getRoutingGroupDetails(versionIds, unitCode, companyCode);
        return new RoutingGroupDetailsResponse(true, 0, 'Routing Group Details Retrieved Successfully', routingGroupDetails)
    }


    /**
     * Service to check the given MOs having same kind of products and versions to give routing groups and bundle quantities
     * once the given MOs are same need to return the response given
     * @param reqObj 
    */
    /**
 * Service to check whether the given MO+ProductCode+FgColor combinations have the same version.
 * @param reqList - Array of MoProductFgColorReq
 */
    async checkGivenMOsHavingSameOpVersions(reqList: MoProductFgColorReq[]): Promise<OpVersionCheckResponse> {
        if (!reqList || reqList.length === 0) {
            throw new ErrorResponse(400, "Request list cannot be empty");
        }

        const { unitCode, companyCode } = reqList[0]; // Assuming same unit & company for all requests
        const isMismatch = reqList.some(
            req => req.unitCode !== unitCode || req.companyCode !== companyCode
        );

        if (isMismatch) {
            throw new ErrorResponse(400, "All combinations must belong to the same unit and company");
        }

        // Step 1: Fetch all matching moProductFgColor records
        const conditions = reqList.map(req => ({
            moNumber: req.moNumber,
            productCode: req.productCode,
            fgColor: req.fgColor,
            unitCode,
            companyCode
        }));

        const records = await this.moProductFgColorRepo.find({ where: conditions });

        if (records.length === 0) {
            throw new ErrorResponse(404, "No records found for the given combinations");
        }

        // Step 2: Validate all combinations were found
        const foundKeys = new Set(records.map(r => `${r.moNumber}|${r.productCode}|${r.fgColor}`));
        const missing = reqList.filter(req => {
            const key = `${req.moNumber}|${req.productCode}|${req.fgColor}`;
            return !foundKeys.has(key);
        });

        if (missing.length > 0) {
            const missingKeys = missing.map(m => `${m.moNumber}|${m.productCode}|${m.fgColor}`).join(', ');
            throw new ErrorResponse(404, `No records found for combinations: ${missingKeys}`);
        }

        // Step 3: Fetch operation versions
        const fgColorIds = records.map(r => r.id);
        const versions = await this.moOpVersionRepo.find({
            where: { moProductFgColorId: In(fgColorIds), unitCode, companyCode }
        });

        if (versions.length === 0) {
            throw new ErrorResponse(404, "No version records found for the given combinations");
        }

        // Step 4: Validate all versions are the same
        const firstVersion = versions[0].version;
        const isSameVersion = versions.every(v => v.version === firstVersion);

        if (!isSameVersion) {
            throw new ErrorResponse(400, "Given combinations do not share the same version");
        }

        return new OpVersionCheckResponse(true, 0, 'Version Match Validated Successfully', isSameVersion);
    }


    async getRoutingGroupDetails(moOpVersionIds: number[], unitCode: string, companyCode: string): Promise<RoutingGroupDetail[]> {
        if (moOpVersionIds.length === 0) {
            throw new ErrorResponse(400, "MO operation version IDs list cannot be empty");
        }
        const procRecords = await this.moOpProcessTypeRepo.find({ where: { moOpVersionId: In(moOpVersionIds), unitCode, companyCode } });
        if (procRecords.length === 0) {
            throw new ErrorResponse(404, "No processing type records found for the given MO operation version IDs");
        }
        const routingGroupMap = new Map<string, RoutingGroupDetail>();
        for (const record of procRecords) {
            const key = `${record.procType}-${record.routingGroup}`;
            if (routingGroupMap.has(key)) {
                routingGroupMap.get(key)!.bundleQty += record.bundleQty;
            } else {
                routingGroupMap.set(key, new RoutingGroupDetail(record.procType, record.routingGroup, record.bundleQty, record.outPutItemSku));
            }
        }
        return Array.from(routingGroupMap.values());
    }


    /**
     * Service to get Knit Group Info For PO
     * Getting Knit group information by calling OMS module , since the original knit group infomation will be available over there by sending PSLB ids
     * Helper function to get the knit group information 
     * @param processType 
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
    */
    async getKnitGroupInfoForMOProductSubLineDetails(reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_OpRoutingResponse> {
        const { unitCode, companyCode } = reqObj
        // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
        // Need to get distinct MO + style + product code + fg Color combination for the given product sub line Ids
        // For every combination need to get the operation routing details 
        const overAllOpRoutings: MOC_OpRoutingModel[] = [];
        const styleProdDetails = await this.moProductSubLineRepo.getMoStyleProductInfoForGivenIds(reqObj.moProductSubLineIds, companyCode, unitCode)
        for (const eachCombo of styleProdDetails) {
            const versionReq = new MOC_OpRoutingRetrievalRequest(null, unitCode, companyCode, 0, eachCombo.moNumber, eachCombo.styleCode, eachCombo.productCode, eachCombo.fgColor, true, true);
            const opsInfo = await this.getOpVersionForMoProductFgColorAndProcessType(versionReq, reqObj.processType);
            if (!opsInfo.status) {
                throw new ErrorResponse(opsInfo.errorCode, opsInfo.internalMessage);
            }
            const actualOpsInfo = opsInfo.data;
            if (!actualOpsInfo.length) {
                throw new ErrorResponse(0, 'Operation routing details not found for the given combo' + JSON.stringify(eachCombo));
            }
            overAllOpRoutings.push(...actualOpsInfo);
        }
        return new MOC_OpRoutingResponse(true, 0, 'Knit group related operation info retrieved Successfully for given product sub line Ids', overAllOpRoutings);
    }

    /**
     * Service to get Current Version For Given Product Details 
     * @param reqModel 
     * @returns 
    */
    async getCurrentVersionForGivenProductDetail(reqModel: MOCProductFgColorVersionRequest): Promise<OpVersionAbstractResponse> {
        const { unitCode, companyCode, username, userId } = reqModel;
        const opVersionInfo: OpVersionAbstractModel[] = [];
        const moProductFgColorInfo = await this.moProductFgColorRepo.findOne({ where: { styleCode: reqModel.styleCode, fgColor: reqModel.fgColor, productCode: reqModel.productCode, moNumber: reqModel.moNumber } });
        if (!moProductFgColorInfo) {
            throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
        }
        const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: moProductFgColorInfo.id, unitCode, companyCode, isActive: true } });
        if (moProductFgColorVersion) {
            const parentVersionDetails = new OpVersionAbstractModel(moProductFgColorVersion.parentVersionId, moProductFgColorVersion.parentVersion, moProductFgColorVersion.parentVersion);
            opVersionInfo.push(parentVersionDetails);
        }
        return new OpVersionAbstractResponse(true, 0, 'Current version Abstract info retrieved successfully', opVersionInfo)
    }

    /**
    * Service to get Knit Group Info For PO
    * Getting Knit group information by calling OMS module , since the original knit group infomation will be available over there by sending PSLB ids
    * Helper function to get the knit group information 
    * @param processType 
    * @param processingSerial 
    * @param unitCode 
    * @param companyCode 
   */
    async getRoutingGroupInfoForMOProductSubLineDetails(reqObj: MC_ProductSubLineProcessTypeRequest): Promise<MOC_OpRoutingResponse> {
        const { unitCode, companyCode } = reqObj
        // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
        // Need to get distinct MO + style + product code + fg Color combination for the given product sub line Ids
        // For every combination need to get the operation routing details 
        const overAllOpRoutings: MOC_OpRoutingModel[] = [];
        const styleProdDetails = await this.moProductSubLineRepo.getMoStyleProductInfoForGivenIds(reqObj.moProductSubLineIds, companyCode, unitCode)
        for (const eachCombo of styleProdDetails) {
            const versionReq = new MOC_OpRoutingRetrievalRequest(null, unitCode, companyCode, 0, eachCombo.moNumber, eachCombo.styleCode, eachCombo.productCode, eachCombo.fgColor, true, true);
            const opsInfo = await this.getOpVersionForMoProductFgColorAndProcessType(versionReq, reqObj.processType);
            if (!opsInfo.status) {
                throw new ErrorResponse(opsInfo.errorCode, opsInfo.internalMessage);
            }
            const actualOpsInfo = opsInfo.data;
            if (!actualOpsInfo.length) {
                throw new ErrorResponse(0, 'Operation routing details not found for the given combo' + JSON.stringify(eachCombo));
            }
            overAllOpRoutings.push(...actualOpsInfo);
        }
        return new MOC_OpRoutingResponse(true, 0, 'Knit group related operation info retrieved Successfully for given product sub line Ids', overAllOpRoutings);
    }


    // Called from PTS Mostly
    async getOperationsListInfoForMo(req: SI_MoNumberRequest): Promise<OMS_R_MoOperationsListInfoResponse> {
        const { unitCode, companyCode, moNumber } = req;
        // get the mo product fg color ids for the mo
        const moProdColRecs = await this.moProductFgColorRepo.find({ select: ['id', 'productCode', 'fgColor', 'styleCode'], where: { companyCode: companyCode, unitCode: unitCode, moNumber: moNumber } });
        if (moProdColRecs.length == 0) {
            throw new ErrorResponse(0, `No color and product type records found for the mo number : ${moNumber}`);
        }
        const moProdColInfoMap = new Map<number, { style: string, pCode: string, color: string }>();
        moProdColRecs.forEach(r => moProdColInfoMap.set(r.id, { style: r.styleCode, pCode: r.productCode, color: r.fgColor }));

        const m1s: OMS_R_MoStyleProdColOperationsListModel[] = [];
        for (const [refId, info] of moProdColInfoMap) {
            // get the op version info
            const opVersionRec = await this.moOpVersionRepo.findOne({ select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, moProductFgColorId: refId } });

            const moOpProcRecs = await this.moOpProcessTypeRepo.find({ select: ['bundleQty', 'outPutBundleQty', 'order', 'depProcType', 'procType', 'id', 'outPutItemSku', 'routingGroup'], where: { companyCode: companyCode, unitCode: unitCode, moOpVersionId: opVersionRec.id }, order: { order: 'ASC' } });
            const procIds = moOpProcRecs.map(r => r.id);
            const procTypeInfoMap = new Map<ProcessTypeEnum, MoOpProcTypeEntity>();
            moOpProcRecs.forEach(r => { procTypeInfoMap.set(r.procType, r) });

            // now get the sub processes for the process types
            const moOpSubProcRecs = await this.moOpSubProcessRepo.find({ select: ['id', 'subProcessName', 'depSubProcesses', 'procType', 'order', 'outPutItemSku'], where: { companyCode: companyCode, unitCode: unitCode, processTypeId: In(procIds) }, order: { order: 'ASC' } });
            const subProcIds = moOpSubProcRecs.map(r => r.id);
            const procTypeSubProcsMap = new Map<ProcessTypeEnum, MoOpSubprocessEntity[]>();
            moOpSubProcRecs.forEach(r => {
                if (!procTypeSubProcsMap.has(r.procType)) {
                    procTypeSubProcsMap.set(r.procType, [])
                }
                procTypeSubProcsMap.get(r.procType).push(r);
            });

            // get the op groups for the sub procs
            const ops = await this.moOpSubProcessOpRepo.find({ select: ['smv', 'opCode', 'opGroup', 'subProcessName', 'order'], where: { companyCode: companyCode, unitCode: unitCode, subProcessId: In(subProcIds) }, order: { order: 'ASC' } });
            const subPoOpGroupOpsMap = new Map<string, Map<string, MoOpSubProcessOPEntity[]>>(); // sub process => op group => operations
            const subPoOpsMap = new Map<string, MoOpSubProcessOPEntity[]>(); // sub process => operations
            const opGroupOrderMap = new Map<string, number>();
            ops.forEach(r => {
                if (!subPoOpGroupOpsMap.has(r.subProcessName)) {
                    subPoOpsMap.set(r.subProcessName, []);
                    subPoOpGroupOpsMap.set(r.subProcessName, new Map<string, MoOpSubProcessOPEntity[]>());
                }
                if (!subPoOpGroupOpsMap.get(r.subProcessName).has(r.opGroup)) {
                    subPoOpGroupOpsMap.get(r.subProcessName).set(r.opGroup, []);
                }
                subPoOpGroupOpsMap.get(r.subProcessName).get(r.opGroup).push(r);
                subPoOpsMap.get(r.subProcessName).push(r);
                opGroupOrderMap.set(r.opGroup, r.order);
            });

            // now iterate all the operations and construct the response
            let opOrder = 1;
            const opGroupModels: OMS_R_MoStyleProdColOperationsListOpGroupModel[] = [];
            procTypeInfoMap.forEach((info, procType) => {
                console.log(procType);
                console.log(info);
                console.log(procTypeSubProcsMap);
                const subProcs = procTypeSubProcsMap.get(procType);
                subProcs.forEach(sub => {
                    const opGroups = subPoOpGroupOpsMap.get(sub.subProcessName);
                    const depSubProcStr = sub.depSubProcesses;
                    const depSubProcs: string[] = depSubProcStr.split(',');

                    let lastOpGroups: string[] = [];
                    depSubProcs.forEach(depProc => {
                        const subProcOps = subPoOpsMap.get(depProc);
                        // now get the last op group for each of the dep sub process of current sub process
                        const lastOpg = subProcOps ? subProcOps[subProcOps.length - 1].opGroup : '';
                        lastOpGroups.push(lastOpg);
                    });

                    // Here we finally the pre op groups as the "last op group" of all the previous sub processes.
                    let preOpgs = lastOpGroups;
                    opGroups.forEach((ops, opg) => {
                        const opgOrder = opGroupOrderMap.get(opg);
                        // calculate the dep op groups based on the sub processes
                        const o2 = ops.map(r => new OMS_R_MoStyleProdColOperationsListOpModel(r.opCode, r.smv, opOrder++));
                        const o1 = new OMS_R_MoStyleProdColOperationsListOpGroupModel(procType, info.outPutItemSku, sub.subProcessName, sub.outPutItemSku, opg, preOpgs, info.routingGroup, sub.order, opgOrder, o2);
                        opGroupModels.push(o1);
                        // RESET the preOpgs as the current opg (so if the process types has many op groups,)
                        preOpgs = [opg];
                    });
                });
            });
            const m1 = new OMS_R_MoStyleProdColOperationsListModel(moNumber, info.style, info.color, info.pCode, info.pCode, opGroupModels);
            m1s.push(m1);
        }
        return new OMS_R_MoOperationsListInfoResponse(true, 0, 'Op info retrieved', m1s);
    }
}



