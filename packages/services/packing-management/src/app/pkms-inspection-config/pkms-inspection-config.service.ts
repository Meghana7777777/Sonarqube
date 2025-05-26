import { Injectable } from "@nestjs/common";
import { CommonResponse, InsBuyerCodeRequest, InsConfigFabValModel, InsConfigItemsModel, INSConfigTransferReqModel, InsConfigValModel, InsFabInsConfigModel, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigModel, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest, InsTypesEnum, PackListIdRequest } from "@xpparel/shared-models";
import { InsBullQueueService, InspectionConfigService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsConfigItemsEntity } from "./entities/pkms-ins-header-config-items";
import { InsConfigHeaderEntity } from "./entities/pkms-ins-header-config.entity";
import { InsConfigItemRepo } from "./repositories/pkms-ins-config-item.repository";
import { InsHeaderConfigRepo } from "./repositories/pkms-ins-header.config.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CrtnEntity } from "../packing-list/entities/crtns.entity";
import { ContainerGroupCreationService } from "../location-allocation/container-group-creation.service";

@Injectable()
export class PKMSInspectionConfigService {
    constructor(
        private dataSource: DataSource,
        private insConfigHeaderRepo: InsHeaderConfigRepo,
        private insConfigItemRepo: InsConfigItemRepo,
        private supplierInsConfig: InspectionConfigService,
        private insBullService: InsBullQueueService,
        private containerGroupCreationService: ContainerGroupCreationService
    ) { }



    async saveRollsOfInsCat(headerRef: number, plRefId: number, insConfigItems: InsConfigItemsModel[], manager: GenericTransactionManager, companyCode: string, unitCode: string) {
        const childEntities: InsConfigItemsEntity[] = [];
        for (const items of insConfigItems) {
            const refId = await this.dataSource.getRepository(CrtnEntity).findOne({ select: ['id'], where: { barcode: items.refBarcode, companyCode, unitCode } })
            const findExistedCartons = await this.dataSource.getRepository(InsConfigItemsEntity).exist({ where: { companyCode, unitCode, plRefId, insItemId: refId.id } })
            if (findExistedCartons) {
                continue
            }
            const configItem = new InsConfigItemsEntity();
            configItem.plRefId = plRefId;
            configItem.headerRef = headerRef;
            configItem.insItemId = refId.id;
            configItem.insItemBarcode = items.refBarcode;
            configItem.companyCode = companyCode;
            configItem.unitCode = unitCode;
            childEntities.push(configItem);
        }
        await manager.getRepository(InsConfigItemsEntity).save(childEntities, { reload: false });
    }




    async savePKMSFgInsConfigPLLevel(req: InsFgInsConfigRequest): Promise<InsFabInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            //
            const containerCreationsReq: InsConfigValModel[] = []
            for (const config of req.insConfigs) {
                const isRecExist = await this.dataSource.getRepository(InsConfigHeaderEntity).findOne({ where: { supplierCode: req.buyerCode, refId: req.plRefId, insTypeI1: config?.insType } });
                
                if (isRecExist) {
                    if (config?.insType === InsTypesEnum.PRE_INSPECTION) {
                        containerCreationsReq.push(config)
                    }
                    await this.saveRollsOfInsCat(isRecExist.id, config.plRefId, config.insConfigItems, manager, req.companyCode, req.unitCode);
                    if (req.insConfigs.length && config.selected) {
                        await this.insBullService.addFGInspections(new INSConfigTransferReqModel(req.username, req.unitCode, req.companyCode, req.userId, config.insType, config.plRefId, config.itemCategory, undefined, req.buyerCode, config.insConfigItems));
                    }
                } else {
                    const insConfigEntity = new InsConfigHeaderEntity();
                    insConfigEntity.createdUser = req.username;
                    insConfigEntity.companyCode = req.companyCode;
                    insConfigEntity.unitCode = req.unitCode;
                    insConfigEntity.supplierCode = req.buyerCode;
                    insConfigEntity.refId = req.plRefId;
                    insConfigEntity.insTypeI1 = config?.insType
                    insConfigEntity.defaultPerc = config?.pickPerc;
                    insConfigEntity.materialReady = config?.requiredForMaterialReady;
                    insConfigEntity.selected = config.selected;
                    insConfigEntity.buyerCode = req.buyerCode;
                    insConfigEntity.insTypeI2 = '';
                    insConfigEntity.insspectionSelectionType = config.insSelectionType;
                    insConfigEntity.itemCategoryType = config.itemCategory
                    // Save the entities
                    const headerConfig = await manager.getRepository(InsConfigHeaderEntity).save(insConfigEntity);
                    await this.saveRollsOfInsCat(headerConfig.id, req.plRefId, config.insConfigItems, manager, req.companyCode, req.unitCode);
                }
            }
            await manager.completeTransaction();
            if (containerCreationsReq?.length) {
                for (const pkIds of containerCreationsReq) {
                    const reqObj = new PackListIdRequest(req.username, req.unitCode, req.companyCode, req.userId, pkIds.plRefId)
                    await this.containerGroupCreationService.createContainerGroupsForPackList(reqObj, true)
                }
            }

            return new InsFabInsConfigResponse(true, 0, 'Inspection Request Created Successfully');
        } catch (error) {
            await manager.releaseTransaction();
            console.error('error.message:', error);
            return new InsFabInsConfigResponse(false, 500, error.message);
        }
    }





    async getFgInsConfigPLLevel(req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const insConfigHeader = await this.supplierInsConfig.getFgInsConfig(req);
            if (!insConfigHeader.status) {
                throw new ErrorResponse(6512, insConfigHeader.internalMessage);
            }
            if (!insConfigHeader?.data[0]?.insConfigs?.length) {
                throw new ErrorResponse(5623, insConfigHeader.internalMessage)
            }
            const insConfigs: InsConfigValModel[] = [];
            for (const insHeader of insConfigHeader.data[0].insConfigs) {
                const entity = await this.insConfigHeaderRepo.findOne({ where: { buyerCode: req.buyerCode, refId: req.plRefId, insTypeI1: insHeader?.insType } });
                const isExistedBuyer = insHeader?.insType === entity?.insTypeI1;
                const model = new InsConfigValModel(
                    insHeader.id,
                    insHeader.insType,
                    insHeader.pickPerc,
                    insHeader.requiredForMaterialReady,
                    insHeader.selected,
                    insHeader.supplierCode,
                    insHeader.buyerCode,
                    insHeader.insSelectionType,
                    [],
                    insHeader.plRefId,
                    insHeader.itemCategory,
                    isExistedBuyer
                )
                if (entity) {
                    const items = await this.insConfigItemRepo.find({ where: { headerRef: entity.id } });
                    items.forEach(item => {
                        model.insConfigItems.push(new InsConfigItemsModel(item.insItemId, item.insItemBarcode))
                    })
                }
                insConfigs.push(model);
            };

            // Group all configs under a single response model
            const responseData: InsFgInsConfigModel[] = [new InsFgInsConfigModel(req.buyerCode, undefined, insConfigs, req.plRefId)];
            return new InsFgInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsFgInsConfigResponse(false, 500, error.message);
        }
    }


}




