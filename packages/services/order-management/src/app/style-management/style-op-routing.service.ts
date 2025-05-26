import { Injectable } from '@nestjs/common';
import { StyleProductTypeRepository } from './repository/style-product-type.repository';
import { SPOpVersionRepository } from './repository/sp-op-version.repository';
import { SPProcessTypeRepository } from './repository/sp-proc-type.repository';
import { SPSubProcessRepository } from './repository/sp-sub-process.repository';
import { SPSubProcessBomRepository } from './repository/sp-sub-proc-bom.repository';
import { SPSubProcessOpRepository } from './repository/sp-sub-process-op.repository';
import { SPSubProcessComponentRepository } from './repository/sp-sub-proc-comp.repository';
import { BomItemTypeEnum, CommonRequestAttrs, GlobalResponseObject, OpVersionAbstractModel, OpVersionAbstractResponse, ProcessTypeEnum, PhItemCategoryEnum, MOP_OpRoutingBomList, MOP_OpRoutingCompsList, MOP_OpRoutingModel, MOP_OpRoutingOpsList, MOP_OpRoutingProcessTypeList, MOP_OpRoutingRetrievalRequest, MOP_OpRoutingSubProcessList, MOP_OpRoutingVersionRequest, StyleOpRoutingResponse, StyleProductOpVersionAbstract, StyleProductTypeOpVersionAbstractResponse, OpVersionReq } from '@xpparel/shared-models';
import { StyleProductTypeEntity } from './entity/style-product.entity';
import { SpOpVersionEntity } from './entity/sp-op-version.entity';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { DataSource } from 'typeorm';
import { SpProcTypeEntity } from './entity/sp-proc-type.entity';
import { SpSubprocessEntity } from './entity/sp-sub-process.entity';
import { SPSubProcessBomEntity } from './entity/sp-sub-proc-bom.entity';
import { SpSubProcessOPEntity } from './entity/sp-sub-process-op.entity';
import { SpSubProcessComponentEntity } from './entity/sp-sub-proc-comp.entity';
import { OperationService } from '@xpparel/shared-services';

@Injectable()
export class StyleOpRoutingService {

    constructor(
        private dataSource: DataSource,
        private styleProductRepo: StyleProductTypeRepository,
        private spOpVersionRepo: SPOpVersionRepository,
        private spProcessTypeRepo: SPProcessTypeRepository,
        private spSubProcessRepo: SPSubProcessRepository,
        private spSubProcessBomRepo: SPSubProcessBomRepository,
        private spSubProcessOpRepo: SPSubProcessOpRepository,
        private spSubProcessCompRepo: SPSubProcessComponentRepository,
        private operationService: OperationService,

    ) {

    }

    /**
     * Service to get style product type and operation version info
     * Usually calling by UI - for style operation version landing page
     * @param reqModel 
     * @returns 
    */
    async getStyleProductTypeOpVersionAbstract(reqModel: OpVersionReq): Promise<StyleProductTypeOpVersionAbstractResponse> {
        const { unitCode, companyCode, page, limit, style } = reqModel;
        const skip = (page - 1) * limit;
        const styleProductVersions: StyleProductOpVersionAbstract[] = [];
        let styleProdInfo: StyleProductTypeEntity[];
        if (style && style !== 'all') {
            styleProdInfo = await this.styleProductRepo.find({
                where: { unitCode, companyCode, isActive: true, styleCode: style },
                select: ['productType', 'styleCode', 'id'],
                // take: limit,
            });
        } else {
            styleProdInfo = await this.styleProductRepo.find({
                where: { unitCode, companyCode, isActive: true },
                select: ['productType', 'styleCode', 'id'],
                skip: skip,
                take: limit,
            });
        }

        if (reqModel.style && reqModel.style !== 'all') {
            styleProdInfo = styleProdInfo.filter(style => style.styleCode === reqModel.style);
        }

        for (const eachStyleProduct of styleProdInfo) {
            const opVersionInfo: SpOpVersionEntity[] = await this.spOpVersionRepo.find({ where: { styleProductTypeId: eachStyleProduct.id, unitCode, companyCode } });
            const styleOpVersionsForProductType: OpVersionAbstractModel[] = [];
            for (const eachVersion of opVersionInfo) {
                const opVersionModel = new OpVersionAbstractModel(eachVersion.id, eachVersion.description, eachVersion.version);
                styleOpVersionsForProductType.push(opVersionModel);
            }
            const styleOpVersionModel = new StyleProductOpVersionAbstract(eachStyleProduct.styleCode, eachStyleProduct.productType, styleOpVersionsForProductType);
            styleProductVersions.push(styleOpVersionModel);
        }
        return new StyleProductTypeOpVersionAbstractResponse(true, 0, 'Style Product Op Version Abstract Information Retrieved Successfully', styleProductVersions);
    }



    /**
     * TODO: Need to get the operation name from master and attach in the object
     * Service to create operation version for style and product type 
     * @param reqModel includes -> process type -> sub process -> operations -> bom -> components
     * @returns 
    */
    async createOpVersionForStyleAndProductType(reqModel: MOP_OpRoutingVersionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource)
        try {
            const { unitCode, companyCode, username, userId, style, productType } = reqModel;
            // checking version exists already for style + product type or not
            const styleProdInfo: StyleProductTypeEntity = await this.styleProductRepo.findOne({ where: { unitCode, companyCode, isActive: true, styleCode: style, productType: productType }, select: ['productType', 'styleCode', 'id'] });
            if (!styleProdInfo) {
                throw new ErrorResponse(0, 'Given Style Product Type Does not exists Please Verify and try again');
            }
            const existingVersionInfo = await this.spOpVersionRepo.findOne({ where: { styleProductTypeId: styleProdInfo.id, unitCode, companyCode, isActive: true, version: reqModel.version } });
            if (existingVersionInfo) {
                throw new ErrorResponse(0, 'Given Version Already exists . Please check and try again');
            }
            const subProcessInfoMap = new Map<string, SpSubprocessEntity>();
            await manager.startTransaction();
            const opVersionEntity = new SpOpVersionEntity();
            opVersionEntity.companyCode = companyCode;
            opVersionEntity.createdUser = username;
            opVersionEntity.description = reqModel.desc;
            opVersionEntity.styleProductTypeId = styleProdInfo.id;
            opVersionEntity.unitCode = unitCode;
            opVersionEntity.version = reqModel.version;
            const opVersionDetail = await manager.getRepository(SpOpVersionEntity).save(opVersionEntity);
            for (const eachProcessType of reqModel.processTypesList) {
                const opProcessTypeEntity = new SpProcTypeEntity();
                opProcessTypeEntity.companyCode = companyCode;
                opProcessTypeEntity.createdUser = username;
                opProcessTypeEntity.depProcType = eachProcessType.depProcessType.toString();
                opProcessTypeEntity.order = eachProcessType.processOrder;
                opProcessTypeEntity.procType = eachProcessType.processType;
                opProcessTypeEntity.spVersionId = opVersionDetail.id;
                opProcessTypeEntity.unitCode = unitCode;
                opProcessTypeEntity.routingGroup = eachProcessType.routingGroup;
                opProcessTypeEntity.bundleQty = eachProcessType.bundleQuantity;
                opProcessTypeEntity.outPutBundleQty = eachProcessType.outPutBundleQty;
                const processTypeDetail = await manager.getRepository(SpProcTypeEntity).save(opProcessTypeEntity);
                for (const eachSubProcess of eachProcessType.subProcessList) {
                    const outPutSku = `${eachSubProcess.subProcessName}-${styleProdInfo.id.toString().padStart(5, '0')}`;
                    const subProcessEntity = new SpSubprocessEntity()
                    subProcessEntity.companyCode = companyCode;
                    subProcessEntity.createdUser = username;
                    subProcessEntity.order = eachSubProcess.order;
                    subProcessEntity.outPutItemSku = outPutSku;
                    subProcessEntity.procType = eachProcessType.processType;
                    subProcessEntity.processTypeId = processTypeDetail.id;
                    subProcessEntity.subProcessName = eachSubProcess.subProcessName;
                    subProcessEntity.unitCode = unitCode;
                    subProcessEntity.depSubProcesses = eachSubProcess.dependentSubProcesses.toString();
                    const subProcessDetail = await manager.getRepository(SpSubprocessEntity).save(subProcessEntity);
                    subProcessInfoMap.set(eachSubProcess.subProcessName, subProcessDetail);
                    for (const eachSubProcessBom of eachSubProcess.operations) {
                        const subProcessOpEntity = new SpSubProcessOPEntity();
                        const operationInfo = await this.operationService.getOperationbyOpCode({
                            unitCode, companyCode, opCode: eachSubProcessBom.opCode,
                            username: '',
                            userId: 0
                        });
                        console.log('operationInfo', operationInfo);

                        if (!operationInfo.data[0]) {
                            throw new ErrorResponse(operationInfo.errorCode, operationInfo.internalMessage);
                        }
                        subProcessOpEntity.companyCode = companyCode;
                        subProcessOpEntity.createdUser = username;
                        subProcessOpEntity.opCode = eachSubProcessBom.opCode;
                        subProcessOpEntity.opName = operationInfo.data[0].opName;
                        subProcessOpEntity.order = eachSubProcessBom.opOrder;
                        subProcessOpEntity.procType = eachProcessType.processType;
                        subProcessOpEntity.smv = 0;
                        subProcessOpEntity.subProcessId = subProcessDetail.id;
                        subProcessOpEntity.subProcessName = eachSubProcess.subProcessName;
                        subProcessOpEntity.unitCode = unitCode;
                        subProcessOpEntity.opGroup = eachSubProcessBom.opGroup;
                        await manager.getRepository(SpSubProcessOPEntity).save(subProcessOpEntity);
                    }
                    for (const eachSubProcessComp of eachSubProcess.components) {

                        const subProcessCompEntity = new SpSubProcessComponentEntity();
                        subProcessCompEntity.componentName = eachSubProcessComp.compName;
                        subProcessCompEntity.procType = eachProcessType.processType;
                        subProcessCompEntity.subProcessId = subProcessDetail.id;
                        subProcessCompEntity.subProcessName = eachSubProcess.subProcessName;
                        subProcessCompEntity.companyCode = companyCode;
                        subProcessCompEntity.unitCode = unitCode;
                        subProcessCompEntity.createdUser = username;
                        await manager.getRepository(SpSubProcessComponentEntity).save(subProcessCompEntity);
                    }
                }
            }
            // Need to insert BOM for each sub process type by getting dependent sub process.
            for (const eachProcessType of reqModel.processTypesList) {
                for (const eachSubProcess of eachProcessType.subProcessList) {
                    for (const eachSubProcessBom of eachSubProcess.dependentSubProcesses) {
                        const subProcessBomDetail = subProcessInfoMap.has(eachSubProcessBom) ? subProcessInfoMap.get(eachSubProcessBom) : null;
                        const actualSubProcessDetail = subProcessInfoMap.get(eachSubProcess.subProcessName);
                        if (subProcessBomDetail) {
                            const subProcessBomEntity = new SPSubProcessBomEntity();
                            subProcessBomEntity.bomItemCode = subProcessBomDetail.outPutItemSku;
                            subProcessBomEntity.companyCode = companyCode;
                            subProcessBomEntity.createdUser = username;
                            subProcessBomEntity.bomItemDesc = subProcessBomDetail.outPutItemSku;
                            subProcessBomEntity.bomItemType = subProcessBomDetail.procType == ProcessTypeEnum.KNIT ? BomItemTypeEnum.PANEL : BomItemTypeEnum.SFG;
                            subProcessBomEntity.bomSku = subProcessBomDetail.outPutItemSku;
                            subProcessBomEntity.procType = eachSubProcess.processType;
                            subProcessBomEntity.subProcessName = subProcessBomDetail.subProcessName;
                            subProcessBomEntity.subProcessId = actualSubProcessDetail.id;
                            subProcessBomEntity.unitCode = unitCode;
                            subProcessBomEntity.itemType = PhItemCategoryEnum.DEFAULT;
                            await manager.getRepository(SPSubProcessBomEntity).save(subProcessBomEntity);
                        }
                    }
                }
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Operation version created successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }

    // operation version drop down
    /**
     * Service to get operation versions for the style and product type which are already saved
     * @param reqModel Usually it calls from UI to show the operation version drop down
     * @returns 
    */
    async getOpVersionsForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest): Promise<OpVersionAbstractResponse> {
        const { unitCode, companyCode, username, userId, style, productType } = reqModel;
        // checking version exists already for style + product type or not
        const styleProdInfo: StyleProductTypeEntity = await this.styleProductRepo.findOne({ where: { unitCode, companyCode, isActive: true, styleCode: style, productType: productType }, select: ['productType', 'styleCode', 'id'] });
        if (!styleProdInfo) {
            throw new ErrorResponse(0, 'Given Style Product Type Does not exists Please Verify and try again');
        }
        const opVersionsInfo: OpVersionAbstractModel[] = [];
        const existingVersionInfo = await this.spOpVersionRepo.find({ where: { styleProductTypeId: styleProdInfo.id, unitCode, companyCode, isActive: true } });
        for (const eachVersion of existingVersionInfo) {
            const versionObj = new OpVersionAbstractModel(eachVersion.id, eachVersion.description, eachVersion.version);
            opVersionsInfo.push(versionObj);
        }
        return new OpVersionAbstractResponse(true, 0, 'Style product type op versions abstract retrieved successfully', opVersionsInfo);
    }

    //  Operation version info
    /**
     * Service to get operation version detailed info for given style , product type and operation version
     * Usually calls for operation routing view screen
     * @param reqModel 
     * @returns 
    */
    async getOpVersionInfoForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest): Promise<StyleOpRoutingResponse> {
        const { unitCode, companyCode, username, userId, style, productType } = reqModel;
        // checking version exists already for style + product type or not
        const styleProdInfo: StyleProductTypeEntity = await this.styleProductRepo.findOne({ where: { unitCode, companyCode, isActive: true, styleCode: style, productType }, select: ['productType', 'styleCode', 'id'] });
        if (!styleProdInfo) {
            throw new ErrorResponse(0, 'Given Style Product Type Does not exists Please Verify and try again');
        }
        const existingVersionInfo = await this.spOpVersionRepo.findOne({ where: { styleProductTypeId: styleProdInfo.id, unitCode, companyCode, isActive: true, id: reqModel.versionId } });
        if (!existingVersionInfo) {
            throw new ErrorResponse(0, 'Operation version does not exists for given details. Please check and try again')
        }
        const processingTypeListForOpVersion: MOP_OpRoutingProcessTypeList[] = [];
        const processingTypeInfo = await this.spProcessTypeRepo.find({ where: { spVersionId: existingVersionInfo.id, unitCode, companyCode, isActive: true } });
        for (const eachProcessType of processingTypeInfo) {
            const suProcessListForProcType: MOP_OpRoutingSubProcessList[] = [];
            const subProcessDetails = await this.spSubProcessRepo.find({ where: { processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true } });
            for (const eachSubProcess of subProcessDetails) {
                const subProcessBomDetails = await this.spSubProcessBomRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessOpDetails = await this.spSubProcessOpRepo.find({ where: { subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true } });
                const subProcessCompDetails = await this.spSubProcessCompRepo.find({ where: { subProcessId: eachSubProcess.id } });
                const bomDetail = subProcessBomDetails.map((eachBom) => {
                    return new MOP_OpRoutingBomList(eachBom.bomItemCode, eachBom.bomItemDesc, eachBom.bomItemType, true)
                });
                const opDetail = subProcessOpDetails.map((eachOp) => {
                    return new MOP_OpRoutingOpsList(eachOp.opCode, eachOp.opName, eachOp.order, eachOp.smv, eachOp.procType, eachOp.opGroup)
                });
                const componentDetail = subProcessCompDetails.map((eachComp) => {
                    return new MOP_OpRoutingCompsList(eachComp.componentName, eachComp.componentName, []);
                })
                const subProcessObj = new MOP_OpRoutingSubProcessList(eachProcessType.procType, eachSubProcess.subProcessName, bomDetail, eachSubProcess.depSubProcesses.split(','), opDetail, eachSubProcess.order, eachSubProcess.outPutItemSku, componentDetail);
                suProcessListForProcType.push(subProcessObj);
            }
            const processingTypeInfo = new MOP_OpRoutingProcessTypeList(eachProcessType.procType, eachProcessType.order, eachProcessType.depProcType.split(','), eachProcessType.routingGroup, eachProcessType.bundleQty, suProcessListForProcType, eachProcessType.isBundlingOps, eachProcessType.isOperatorLevelTracking, eachProcessType.isInventoryItem, eachProcessType.outPutBundleQty);
            processingTypeListForOpVersion.push(processingTypeInfo);
        }
        const opRoutingModel = new MOP_OpRoutingModel(existingVersionInfo.id, existingVersionInfo.version, existingVersionInfo.description, styleProdInfo.styleCode, styleProdInfo.productType, processingTypeListForOpVersion)

        return new StyleOpRoutingResponse(true, 0, 'Operation Version Details Retrieved Successfully', opRoutingModel);
    }


    /**
     * Service to delete operation version for style and product type
     * @param reqModel 
     * @returns 
    */
    async deleteOpVersionForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, username, userId } = reqModel;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            // checking version exists already for style + product type or not
            const styleProdInfo: StyleProductTypeEntity = await this.styleProductRepo.findOne({ where: { unitCode, companyCode, isActive: true }, select: ['productType', 'styleCode', 'id'] });
            if (!styleProdInfo) {
                throw new ErrorResponse(0, 'Given Style Product Type Does not exists Please Verify and try again');
            }
            const existingVersionInfo = await this.spOpVersionRepo.findOne({ where: { styleProductTypeId: styleProdInfo.id, unitCode, companyCode, isActive: true, id: reqModel.versionId } });
            if (!existingVersionInfo) {
                throw new ErrorResponse(0, 'Operation version does not exists for given details. Please check and try again')
            }
            const processingTypeInfo = await this.spProcessTypeRepo.find({ where: { spVersionId: existingVersionInfo.id, unitCode, companyCode, isActive: true } });
            await manager.startTransaction();
            for (const eachProcessType of processingTypeInfo) {
                const subProcessDetails = await this.spSubProcessRepo.find({ where: { processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true } });
                for (const eachSubProcess of subProcessDetails) {
                    await manager.getRepository(SPSubProcessBomEntity).delete({ subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true });
                    await manager.getRepository(SpSubProcessOPEntity).delete({ subProcessId: eachSubProcess.id, unitCode, companyCode, isActive: true });
                    await manager.getRepository(SpSubProcessComponentEntity).delete({ subProcessId: eachSubProcess.id });
                }
                await manager.getRepository(SpSubprocessEntity).delete({ processTypeId: eachProcessType.id, unitCode, companyCode, isActive: true });
            }
            await manager.getRepository(SpProcTypeEntity).delete({ spVersionId: existingVersionInfo.id, unitCode, companyCode, isActive: true });
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Version Deleted Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }

    }
}
