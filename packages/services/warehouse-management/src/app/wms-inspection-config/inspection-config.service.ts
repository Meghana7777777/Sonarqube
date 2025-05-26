import { Injectable } from "@nestjs/common";
import { GlobalResponseObject, InsConfigFabValModel, InsConfigItemsModel, INSConfigTransferReqModel, InsFabInsConfigModel, InsFabInsConfigRequest, InsFabInsConfigResponse, InsSupplierCodeRequest, PackListIdRequest } from "@xpparel/shared-models";
import { InsBullQueueService, InspectionConfigService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsConfigItemsEntity } from "./entities/ins-header-config-items";
import { InsConfigHeaderEntity } from "./entities/ins-header-config.entity";
import { InsConfigItemRepo } from "./repositories/ins-config-item.repository";
import { InsHeaderConfigRepo } from "./repositories/ins-header.config.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PhItemsRepo } from "../packing-list/repository/ph-items.repository";

@Injectable()
export class WMSInspectionConfigService {
    constructor(
        private dataSource: DataSource,
        private insConfigHeaderRepo: InsHeaderConfigRepo,
        private insConfigItemRepo: InsConfigItemRepo,
        private supplierInsConfig: InspectionConfigService,
        private insBullService: InsBullQueueService,
        private phItemsRepo: PhItemsRepo
    ) { }

    async saveFabInsConfigPLLevel(req: InsFabInsConfigRequest): Promise<InsFabInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            console.log("req", req)
            for (const config of req.insConfigs) {
                const isRecExist = await manager.getRepository(InsConfigHeaderEntity).findOne({
                    where: {
                        supplierCode: req.supplierCode,
                        refId: req.plRefId,
                        insTypeI1: config?.insType,
                        itemCategoryType: config.itemCategory
                    }
                });

                if (isRecExist) {
                    await manager.getRepository(InsConfigHeaderEntity).save(isRecExist);
                    await this.saveRollsOfInsCat(isRecExist.id, isRecExist.refId, config.insConfigItems, manager);
                    if (req.insConfigs.length === 1 && config.selected) {
                        await this.insBullService.addRMInspections(new INSConfigTransferReqModel(req.username, req.unitCode, req.companyCode, req.userId, config.insType, req.plRefId, config.itemCategory, req.supplierCode, undefined));
                    }
                } else {
                    const insConfigEntity = new InsConfigHeaderEntity();
                    insConfigEntity.createdUser = req.username;
                    insConfigEntity.companyCode = req.companyCode;
                    insConfigEntity.unitCode = req.unitCode;
                    insConfigEntity.supplierCode = req.supplierCode;
                    insConfigEntity.refId = req.plRefId;
                    insConfigEntity.insTypeI1 = config?.insType;
                    insConfigEntity.defaultPerc = config?.pickPerc;
                    insConfigEntity.materialReady = config?.requiredForMaterialReady;
                    insConfigEntity.selected = config.selected;
                    insConfigEntity.buyerCode = null;
                    insConfigEntity.insTypeI2 = '';
                    insConfigEntity.insspectionSelectionType = config.insSelectionType;
                    insConfigEntity.itemCategoryType = config.itemCategory;
                    const headerConfig = await manager.getRepository(InsConfigHeaderEntity).save(insConfigEntity);
                    await this.saveRollsOfInsCat(headerConfig.id, req.plRefId, config.insConfigItems, manager);
                }
            }

            await manager.completeTransaction();
            return new InsFabInsConfigResponse(true, 0, 'Configuration saved successfully');
        } catch (error) {
            await manager.releaseTransaction();
            console.error('error.message:', error);
            return new InsFabInsConfigResponse(false, 500, error.message);
        }
    }

    async saveRollsOfInsCat(headerRef: number, plRefId: number, insConfigItems: InsConfigItemsModel[], manager: GenericTransactionManager) {
        const childEntities: InsConfigItemsEntity[] = []
        for (const items of insConfigItems) {
            const configItem = new InsConfigItemsEntity();
            configItem.plRefId = plRefId;
            configItem.headerRef = headerRef;
            configItem.insItemId = items.refId;
            configItem.insItemBarcode = items.refBarcode;
            childEntities.push(configItem);
        }
        await manager.getRepository(InsConfigItemsEntity).save(childEntities, { reload: false });
    }


    async getFabInsConfigPLLevel(req: InsSupplierCodeRequest): Promise<InsFabInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insConfigHeaderRepo.find({ where: { supplierCode: req.supplierCode, refId: req.plRefId, itemCategoryType: req.itemCategory } });
            // If no records found, return empty response
            if (!entities?.length) {
                return await this.supplierInsConfig.getFabInsConfig(req);
            }
            const insConfigs: InsConfigFabValModel[] = [];
            for (const entity of entities) {
                const insType: any = entity.insTypeI1;
                const itemCategoryType: any = entity.itemCategoryType
                const model = new InsConfigFabValModel(
                    entity.id,
                    insType,
                    entity.defaultPerc,
                    entity.materialReady,
                    entity.selected,
                    entity.supplierCode,
                    entity.buyerCode,
                    entity.insspectionSelectionType,
                    [],
                    entity.refId,
                    itemCategoryType
                )
                const items = await this.insConfigItemRepo.find({ where: { headerRef: entity.id } });
                items.forEach(item => {
                    model.insConfigItems.push(new InsConfigItemsModel(item.insItemId, item.insItemBarcode))
                })
                insConfigs.push(model);
            };

            // Group all configs under a single response model
            const responseData: InsFabInsConfigModel[] = [
                new InsFabInsConfigModel(req.supplierCode, undefined, req.plRefId, insConfigs),
            ];
            console.log("responseData", responseData)
            return new InsFabInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsFabInsConfigResponse(false, 500, error.message, []);
        }
    }

    async isAllInsConfigurationsSaved(req: PackListIdRequest): Promise<GlobalResponseObject> {
        const categories = await this.phItemsRepo.getDistinctItemCategories(req.packListId);
        const headers = await this.insConfigHeaderRepo.find({ where: { refId: req.packListId, selected: true,itemCategoryType: In(categories.map(category => category.itemCategory)) } });
        const items = await this.insConfigItemRepo.getDistinctInsCats(headers.map(header => header.id));
        console.log(headers);
        console.log(items);


        if (headers.length !== items.length)
            throw new ErrorResponse(0, 'All configurations are not saved');
        return new InsFabInsConfigResponse(true, 0, 'All configurations are saved');
    }


}




