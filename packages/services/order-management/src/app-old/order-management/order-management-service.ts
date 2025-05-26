import { Injectable } from "@nestjs/common";
import { GlobalResponseObject, ManufacturingOrderDumpRequest } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PslOperationRmEntity } from "../common/entity/psl-operation-rm.entity";
import { PslOperationEntity } from "../common/entity/psl-operation.entity";
import { RmInfoEntity } from "../common/entity/rm-info.entity";
import { SoInfoEntity } from "../common/entity/mo-info.entity";
import { SoLineProductEntity } from "../common/entity/mo-line-product.entity";
import { SoLineEntity } from "../common/entity/mo-line.entity";
import { SoProductSubLineEntity } from "../common/entity/mo-product-sub-line.entity";
import { PslOpRawMaterialRepository } from "../common/repository/psl-opearation-rm.repository";
import { PslOperationRepository } from "../common/repository/psl-operation.repository";
import { RawMaterialInfoRepository } from "../common/repository/rm-info.repository";
import { SoInfoRepository } from "../common/repository/mo-info.repository";
import { SoLineProductRepository } from "../common/repository/mo-line-product.repository";
import { SoLineRepository } from "../common/repository/mo-line.repository";
import { SoProductSubLineRepository } from "../common/repository/mo-product-sub-line.repository";

@Injectable()
export class OrderManagementService {

    constructor(
        private dataSource: DataSource,
        private soInfoRepo: SoInfoRepository,
        private soLineRepo: SoLineRepository,
        private soLineProductRepo: SoLineProductRepository,
        private soProductSubLineRepo: SoProductSubLineRepository,
        private pslOperationRepo: PslOperationRepository,
        private pslOperationRmRepo: PslOpRawMaterialRepository,
        private rmInfoRepo: RawMaterialInfoRepository

    ) {
    }
    // async saveSaleOrderDumpData(req: ManufacturingOrderDumpRequest): Promise<GlobalResponseObject> {
    //     const transactionalEntityManager = new GenericTransactionManager(this.dataSource);

    //     try {
    //         await transactionalEntityManager.startTransaction();

    //         for (const saleOrderDump of req.manufacturingOrderDumpData) {
    //             const existingUnconfirmedSoInfo = await this.soInfoRepo.findOne({
    //                 where: { soNumber: saleOrderDump.moNumber },
    //             });

    //             // 0 - order placed but not confirmed can be updated or deleted or
    //             // 1 - order confirmedn and is not being processed can be unconfirmed and updated
    //             // 2 - order confirmed and is being processed cannot be updated or deleted or unconfirmed
    //             // 3 - order completed
               
    //            if(existingUnconfirmedSoInfo && existingUnconfirmedSoInfo.isConfirmed===0){
    //                await this.soInfoRepo.delete(existingUnconfirmedSoInfo.id);
    //                }

    //             if(existingUnconfirmedSoInfo && existingUnconfirmedSoInfo.isConfirmed===1){
    //                 await transactionalEntityManager.releaseTransaction();
    //                 return new GlobalResponseObject(false,1, "Sale Order already confirmed, Unconfirm the existing  order to update");
    //             }

    //             if(existingUnconfirmedSoInfo && existingUnconfirmedSoInfo.isConfirmed===2){
    //                 await transactionalEntityManager.releaseTransaction();
    //                 return new GlobalResponseObject(false,1, "Sale Order is being processed, Cannot update");
    //             }

    //             if(existingUnconfirmedSoInfo && existingUnconfirmedSoInfo.isConfirmed===3){
    //                 await transactionalEntityManager.releaseTransaction();
    //                 return new GlobalResponseObject(false,1, "Sale Order is completed, Cannot update");
    //             }
                   
    //             const entity = new SoInfoEntity();
    //             entity.companyCode = req.companyCode;
    //             entity.unitCode = req.unitCode;
    //             entity.createdUser = req.username;
    //             entity.soNumber = saleOrderDump.moNumber;
    //             entity.style = saleOrderDump.style;
    //             entity.plantStyleRef = saleOrderDump.plantStyleRef;
    //             entity.coNumber = saleOrderDump.coNumber;
    //             entity.customerName = saleOrderDump.customerName;
    //             entity.soRefNo = saleOrderDump.moRefNumber;
    //             entity.customerLoc = saleOrderDump.customerLocation;
    //             entity.quantity = saleOrderDump.quantity;
    //             entity.packMethod = saleOrderDump.packMethod;
    //             entity.isConfirmed = 0;
    //             entity.customerCode = saleOrderDump.customerCode;
    //             entity.profitCenterCode = saleOrderDump.profitCenterCode;
    //             entity.profitCenterName = saleOrderDump.profitCenterName;
    //             entity.styleName = saleOrderDump.styleName;
    //             entity.styleCode = saleOrderDump.styleCode;
    //             entity.styleDescription = saleOrderDump.styleDescription;
    //             entity.soProgressStatus = saleOrderDump.moProgressStatus;
    //             entity.businessHead = saleOrderDump.businessHead;
    //             entity.soItem = saleOrderDump.moItem;
    //             entity.customerStylesDesignNo = saleOrderDump.customerStylesDesignNo;
    //             entity.soCreationDate = saleOrderDump.moCreationDate;
    //             entity.soClosedDate = saleOrderDump.moClosedDate;
    //             entity.exFactoryDate = saleOrderDump.exFactoryDate;

    //             const soInfoEntity = await this.soInfoRepo.save(entity);

    //             const soLineEntities = [];
    //             for (const soLine of saleOrderDump.moLines) {
    //                 const soLineEntity = new SoLineEntity();
    //                 soLineEntity.companyCode = req.companyCode;
    //                 soLineEntity.unitCode = req.unitCode;
    //                 soLineEntity.createdUser = req.username;
    //                 soLineEntity.soNumber = soInfoEntity.soNumber;
    //                 soLineEntity.soId = soInfoEntity.id;
    //                 soLineEntity.soLineNumber = soLine.soLineNumber;

    //                 soLineEntities.push(soLineEntity);
    //             }
    //             const rmInfoEntities = [];
    //             for (const rawMaterial of saleOrderDump.rawMaterials) {
    //                 const rmInfoEntity = new RmInfoEntity();
    //                 rmInfoEntity.companyCode = req.companyCode;
    //                 rmInfoEntity.unitCode = req.unitCode;
    //                 rmInfoEntity.createdUser = req.username;
    //                 rmInfoEntity.soNumber = soInfoEntity.soNumber;
    //                 rmInfoEntity.itemCode = rawMaterial.itemCode;
    //                 rmInfoEntity.itemName = rawMaterial.itemName;
    //                 rmInfoEntity.itemDesc = rawMaterial.itemDesc;
    //                 rmInfoEntity.sequence = rawMaterial.sequence;
    //                 rmInfoEntity.consumption = rawMaterial.consumption;
    //                 rmInfoEntity.wastage = rawMaterial.wastage;
    //                 rmInfoEntity.itemType = rawMaterial.itemType;
    //                 rmInfoEntity.itemSubType = rawMaterial.itemSubType;
    //                 rmInfoEntity.itemColor = rawMaterial.itemColor;
    //                 rmInfoEntity.itemUom = rawMaterial.itemUom;
    //                 rmInfoEntities.push(rmInfoEntity);
    //             }

    //             await this.rmInfoRepo.save(rmInfoEntities);

    //             const soLineResults = await this.soLineRepo.save(soLineEntities);

    //             const soLineProductEntities = [];
    //             const soProductSubLineEntities = [];
    //             const pslOperationEntities = [];
    //             const pslOperationRmEntities = [];


    //             for (let i = 0; i < saleOrderDump.moLines.length; i++) {
    //                 const soLine = saleOrderDump.moLines[i];
    //                 const lineData = soLineResults[i];

    //                 for (const product of soLine.moLineProducts) {
    //                     const soLineProductEntity = new SoLineProductEntity();
    //                     soLineProductEntity.companyCode = req.companyCode;
    //                     soLineProductEntity.unitCode = req.unitCode;
    //                     soLineProductEntity.createdUser = req.username;
    //                     soLineProductEntity.soNumber = soInfoEntity.soNumber;
    //                     soLineProductEntity.soLineId = lineData.id;
    //                     soLineProductEntity.productCode = product.productCode;
    //                     soLineProductEntity.productName = product.productName;
    //                     soLineProductEntity.productType = product.productType;
    //                     soLineProductEntity.sequence = product.sequence;
    //                     soLineProductEntities.push(soLineProductEntity);
    //                 }
    //             }

    //             const soLineProductResults = await this.soLineProductRepo.save(soLineProductEntities);

    //             for (let i = 0; i < saleOrderDump.moLines.length; i++) {
    //                 const soLine = saleOrderDump.moLines[i];
    //                 const productLineData = soLineProductResults[i];

    //                 for (const product of soLine.moLineProducts) {
    //                     for (const subLine of product.moProductSubLines) {
    //                         const soProductSubLineEntity = new SoProductSubLineEntity();
    //                         soProductSubLineEntity.companyCode = req.companyCode;
    //                         soProductSubLineEntity.unitCode = req.unitCode;
    //                         soProductSubLineEntity.createdUser = req.username;
    //                         soProductSubLineEntity.soNumber = soInfoEntity.soNumber;
    //                         soProductSubLineEntity.soLineProductId = productLineData.id;
    //                         soProductSubLineEntity.fgColor = subLine.fgColor;
    //                         soProductSubLineEntity.size = subLine.size;
    //                         soProductSubLineEntity.quantity = subLine.quantity;
    //                         soProductSubLineEntity.destination = subLine.destination;
    //                         soProductSubLineEntity.deliveryDate = subLine.deliveryDate;
    //                         soProductSubLineEntity.schedule = subLine.schedule;
    //                         soProductSubLineEntity.zFeature = subLine.zFeature;
    //                         soProductSubLineEntity.planProdDate = subLine.planProdDate;
    //                         soProductSubLineEntity.planCutDate = subLine.planCutDate;

    //                         soProductSubLineEntities.push(soProductSubLineEntity);
    //                     }
    //                 }
    //             }

    //             const soProductSubLineResults = await this.soProductSubLineRepo.save(soProductSubLineEntities);

    //             for (let i = 0; i < saleOrderDump.soLines.length; i++) {
    //                 const soLine = saleOrderDump.soLines[i];
    //                 const productSubLineData = soProductSubLineResults[i];

    //                 for (const product of soLine.soLineProducts) {
    //                     for (const subLine of product.soProductSubLines) {
    //                         for (const operation of subLine.pslOperations) {
    //                             const pslOperationEntity = new PslOperationEntity();
    //                             pslOperationEntity.companyCode = req.companyCode;
    //                             pslOperationEntity.unitCode = req.unitCode;
    //                             pslOperationEntity.createdUser = req.username;
    //                             pslOperationEntity.soNumber = soInfoEntity.soNumber;
    //                             pslOperationEntity.soProductSubLineId = productSubLineData.id;
    //                             pslOperationEntity.opForm = operation.opForm;
    //                             pslOperationEntity.opCode = operation.opCode;
    //                             pslOperationEntity.iOpCode = operation.iOpCode;
    //                             pslOperationEntity.eOpCode = operation.eOpCode;
    //                             pslOperationEntity.opName = operation.opName;
    //                             pslOperationEntity.processType = operation.processType;
    //                             pslOperationEntity.opSmv = parseFloat(operation.opSmv) || 0;
    //                             pslOperationEntity.opWkStation = operation.opWkStation;
    //                             pslOperationEntities.push(pslOperationEntity);

    //                             for (const rm of operation.pslOpRawMaterials) {
    //                                 const pslOperationRmEntity = new PslOperationRmEntity();
    //                                 pslOperationRmEntity.companyCode = req.companyCode;
    //                                 pslOperationRmEntity.unitCode = req.unitCode;
    //                                 pslOperationRmEntity.createdUser = req.username;
    //                                 pslOperationRmEntity.soNumber = soInfoEntity.soNumber;
    //                                 pslOperationRmEntity.pslOperationId = 1;//Todo
    //                                 pslOperationRmEntity.itemCode = rm.itemCode;
    //                                 pslOperationRmEntity.opCode = rm.opCode;
    //                                 pslOperationRmEntities.push(pslOperationRmEntity);
    //                             }
    //                         }


    //                     }
    //                 }
    //             }

    //             const pslOperationResults = await this.pslOperationRepo.save(pslOperationEntities);

    //             for (let i = 0; i < saleOrderDump.soLines.length; i++) {
    //                 const soLine = saleOrderDump.soLines[i];
    //                 const productSubLineData = soProductSubLineResults[i];

    //                 for (const product of soLine.soLineProducts) {
    //                     for (const subLine of product.soProductSubLines) {
    //                         for (let j = 0; j < subLine.pslOperations.length; j++) {
    //                             const operation = subLine.pslOperations[j];
    //                             const savedPslOperation = pslOperationResults.find(
    //                                 (op) => op.opCode === operation.opCode && op.soProductSubLineId === productSubLineData.id
    //                             );

    //                             if (savedPslOperation) {
    //                                 for (const rm of operation.pslOpRawMaterials) {
    //                                     const pslOperationRmEntity = new PslOperationRmEntity();
    //                                     pslOperationRmEntity.companyCode = req.companyCode;
    //                                     pslOperationRmEntity.unitCode = req.unitCode;
    //                                     pslOperationRmEntity.createdUser = req.username;
    //                                     pslOperationRmEntity.soNumber = soInfoEntity.soNumber;
    //                                     pslOperationRmEntity.pslOperationId = savedPslOperation.id;
    //                                     pslOperationRmEntity.itemCode = rm.itemCode;
    //                                     pslOperationRmEntity.opCode = rm.opCode;
    //                                     pslOperationRmEntities.push(pslOperationRmEntity);
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }

    //             await this.pslOperationRmRepo.save(pslOperationRmEntities);

    //         }

    //         await transactionalEntityManager.completeTransaction();
    //         return new GlobalResponseObject(true, 1, "Success");
    //     } catch (err) {
    //         if (transactionalEntityManager) {
    //             await transactionalEntityManager.releaseTransaction();
    //         }
    //         throw err;
    //     }
    // }





}

