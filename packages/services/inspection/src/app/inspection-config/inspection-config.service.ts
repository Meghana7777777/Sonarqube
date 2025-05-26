import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { InsBuyerCodeRequest, InsConfigFabValModel, InsConfigItemsModel, InsConfigThreadValModel, InsConfigTrimValModel, InsConfigValModel, InsConfigYarnValModel, InsFabInsConfigModel, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigModel, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest, InsThreadInsConfigModel, InsThreadInsConfigRequest, InsThreadInsConfigResponse, InsTrimInsConfigModel, InsTrimInsConfigRequest, InsTrimInsConfigResponse, InsYarnInsConfigModel, InsYarnInsConfigRequest, InsYarnInsConfigResponse, PackFabricInspectionRequestCategoryEnum, ThreadTypeEnum, TrimTypeEnum, YarnTypeEnum } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsConfigEntity } from "../masters/entity/ins-config.entity";
import { InsTypesRepo } from "../masters/repositories/ins-types.repository";
import { InsConfigItemRepo } from "./repositories/ins-config-item.repository";
import { InsHeaderConfigRepo } from "./repositories/ins-header.config.repository";
import { InsConfigItemsEntity } from "../entities/ins-header-config-items";
import { InsConfigHeaderEntity } from "../entities/ins-header-config.entity";

@Injectable()
export class InspectionConfigService {
    constructor(
        private dataSource: DataSource,
        private insTypesRepo: InsTypesRepo,
        private insConfigHeaderRepo: InsHeaderConfigRepo,
        private insConfigItemRepo: InsConfigItemRepo
    ) { }

    async saveFabInsConfig(req: InsFabInsConfigRequest): Promise<InsFabInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            // Delete existing records for the supplier
            await manager.getRepository(InsConfigEntity).delete({ supplierCode: req.supplierCode, itemCategoryType: req.itemCategory });
            // Map request DTOs directly to entity objects
            const entities: InsConfigEntity[] = req.insConfigs.map(config => {
                const insConfigEntity = new InsConfigEntity();
                insConfigEntity.createdUser = req.username;
                insConfigEntity.companyCode = req.companyCode;
                insConfigEntity.unitCode = req.unitCode;
                insConfigEntity.supplierCode = req.supplierCode;
                insConfigEntity.insTypeI1 = config?.insType
                insConfigEntity.defaultPerc = config?.pickPerc;
                insConfigEntity.materialReady = config?.requiredForMaterialReady;
                insConfigEntity.selected = config.selected;
                insConfigEntity.buyerCode = '';
                insConfigEntity.insTypeI2 = '';
                insConfigEntity.insspectionSelectionType = config.insSelectionType
                insConfigEntity.itemCategoryType = config.itemCategory
                return insConfigEntity;
            });
            // Save the entities
            await manager.getRepository(InsConfigEntity).save(entities, { reload: false });
            await manager.completeTransaction();
            return new InsFabInsConfigResponse(true, 0, 'Configuration saved successfully');
        } catch (error) {
            await manager.releaseTransaction();
            console.error('error.message:', error);
            return new InsFabInsConfigResponse(false, 500, error.message);
        }
    }

    async getFabInsConfig(req: InsSupplierCodeRequest): Promise<InsFabInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insTypesRepo.find({ where: { supplierCode: req.supplierCode, itemCategoryType: req.itemCategory } });
            // If no records found, return empty response
            if (!entities.length)
                throw new ErrorResponse(2323, 'No data found');


            // Create the InsConfigValModel list
            const insConfigs: InsConfigFabValModel[] = entities.map(entity => {
                const insType: any = entity.insTypeI1
                const itemCategoryType: any = entity.itemCategoryType
                return new InsConfigFabValModel(
                    entity.id,
                    insType,
                    entity.defaultPerc,
                    entity.materialReady,
                    entity.selected,
                    entity.supplierCode,
                    entity.buyerCode,
                    entity.insspectionSelectionType,
                    [],
                    undefined,
                    itemCategoryType
                )
            });

            // Group all configs under a single response model
            const responseData: InsFabInsConfigModel[] = [
                new InsFabInsConfigModel(req.supplierCode, undefined, undefined, insConfigs),
            ];

            return new InsFabInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsFabInsConfigResponse(false, 500, error.message, []);
        }
    }

    async saveFgInsConfigPLLevel(req: InsFgInsConfigRequest): Promise<InsFabInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            console.log('req123', req);
            await manager.startTransaction();
            // Delete existing records for the supplier
            for (const config of req.insConfigs) {
                const isRecExist = await manager.getRepository(InsConfigHeaderEntity).findOne({ where: { supplierCode: req.buyerCode, refId: req.plRefId, insTypeI1: config?.insType } });
                console.log(isRecExist, 'isRecExist')
                if (isRecExist) {
                    await this.saveRollsOfInsCat(isRecExist.id, isRecExist.refId, config.insConfigItems, manager);
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
        console.log(headerRef, plRefId, insConfigItems, "143");
        for (const items of insConfigItems) {
            const configItem = new InsConfigItemsEntity();
            configItem.plRefId = plRefId;
            configItem.headerRef = headerRef;
            configItem.insItemId = items.refId;
            configItem.insItemBarcode = items.refBarcode;
            childEntities.push(configItem);
        }
        await manager.getRepository(InsConfigItemsEntity).save(childEntities, { reload: false });
    };



    async saveFgInsConfig(req: InsFgInsConfigRequest): Promise<InsFgInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            console.log('save34', req);
            const existingRecords = await this.insTypesRepo.find({ where: { buyerCode: req.buyerCode, itemCategoryType: req.itemCategory } });
            await manager.startTransaction();
            if (existingRecords.length > 0) {
                await manager.getRepository(InsConfigEntity).delete({ buyerCode: req.buyerCode, itemCategoryType: req.itemCategory });
            }
            // Map request DTOs directly to entity objects
            const entities: InsConfigEntity[] = req.insConfigs.map(config => {
                const insConfigEntity = new InsConfigEntity();
                insConfigEntity.createdUser = req.username;
                insConfigEntity.companyCode = req.companyCode;
                insConfigEntity.unitCode = req.unitCode;
                insConfigEntity.buyerCode = req.buyerCode;
                insConfigEntity.insTypeI1 = config?.insType;
                insConfigEntity.defaultPerc = config?.pickPerc;
                insConfigEntity.materialReady = config?.requiredForMaterialReady;
                insConfigEntity.supplierCode = '';
                insConfigEntity.insTypeI2 = '';
                insConfigEntity.insspectionSelectionType = config.insSelectionType;
                insConfigEntity.itemCategoryType = config.itemCategory
                return insConfigEntity;
            });

            await this.insTypesRepo.save(entities);
            await manager.completeTransaction();
            return new InsFgInsConfigResponse(true, 0, 'Inspection Request Created Successfully');
        } catch (error) {
            await manager.releaseTransaction();
            return new InsFgInsConfigResponse(false, 500, error.message);
        }
    }


    async getFgInsConfig(req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insTypesRepo.find({ where: { buyerCode: req.buyerCode, companyCode: req.companyCode, unitCode: req.unitCode } });
            // If no records found, return empty response
            if (!entities?.length) {
                return new InsFgInsConfigResponse(false, 0, 'No data found', []);
            }
            // Create the InsConfigValModel list
            const insConfigs: InsConfigValModel[] = entities.map((entity) => {
                return new InsConfigValModel(
                    entity.id,
                    PackFabricInspectionRequestCategoryEnum[entity.insTypeI1],
                    entity.defaultPerc,
                    entity.materialReady,
                    entity.selected,
                    entity.supplierCode,
                    entity.buyerCode,
                    entity.insspectionSelectionType,
                    [],
                    undefined,
                    entity.itemCategoryType,
                    false
                )
            });

            // Group all configs under a single response model
            const responseData: InsFgInsConfigModel[] = [
                new InsFgInsConfigModel(req.buyerCode, "Buyer Name", insConfigs),
            ];

            return new InsFgInsConfigResponse(true, 555, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsFgInsConfigResponse(false, 500, error.message, []);
        }
    }


    async saveTrimInsConfig(req: InsTrimInsConfigRequest): Promise<InsTrimInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            const existingRecords = await this.insTypesRepo.find({ where: { supplierCode: req.supplierCode, itemCategoryType: req.itemCategory } });
            if (existingRecords.length > 0) {
                await this.insTypesRepo.delete({ supplierCode: req.supplierCode, itemCategoryType: req.itemCategory });
            }
            // Map request DTOs directly to entity objects
            const entities: InsConfigEntity[] = req.insConfigs.map(config => {
                const insConfigEntity = new InsConfigEntity();
                insConfigEntity.createdUser = req.username;
                insConfigEntity.companyCode = req.companyCode;
                insConfigEntity.unitCode = req.unitCode;
                insConfigEntity.supplierCode = req.supplierCode;
                insConfigEntity.insTypeI1 = config?.insType
                insConfigEntity.selected = config?.selected
                insConfigEntity.defaultPerc = config?.pickPerc;
                insConfigEntity.materialReady = config?.requiredForMaterialReady;
                insConfigEntity.insTypeI2 = '';
                insConfigEntity.insspectionSelectionType = config.insSelectionType;
                insConfigEntity.itemCategoryType = config.itemCategory;
                insConfigEntity.buyerCode = '';
                return insConfigEntity;
            });

            await this.insTypesRepo.save(entities);
            await manager.completeTransaction();
            return new InsTrimInsConfigResponse(true, 0, 'Configuration saved successfully');
        } catch (error) {
            await manager.releaseTransaction();
            return new InsTrimInsConfigResponse(false, 500, error.message);
        }
    }

    async getFgInsConfigPLLevel(req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insConfigHeaderRepo.find({ where: { buyerCode: req.buyerCode, refId: req.plRefId } });

            // If no records found, return empty response
            if (entities.length == 0)
                return await this.getFgInsConfig(req);

            const insConfigs: InsConfigValModel[] = [];
            for (const entity of entities) {
                const insType: any = entity.insTypeI1;
                const itemCategoryType: any = entity.itemCategoryType;
                const model = new InsConfigValModel(
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
            const responseData: InsFgInsConfigModel[] = [
                new InsFgInsConfigModel(req.buyerCode, undefined, insConfigs, req.plRefId)
            ];
            if (responseData) {
                new ErrorResponse(65465, 'No Data Found')
            }
            return new InsFgInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsFgInsConfigResponse(false, 500, error.message);
        }
    }

    async getTrimInsConfig(req: InsSupplierCodeRequest): Promise<InsTrimInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insTypesRepo.find({ where: { supplierCode: req.supplierCode, itemCategoryType: req.itemCategory } });

            // If no records found, return empty response
            if (!entities.length) {
                return new InsTrimInsConfigResponse(true, 0, 'No data found', []);
            }

            // Create the InsConfigValModel list
            const insConfigs: InsConfigTrimValModel[] = entities.map(entity => ({
                id: entity.id,
                insType: TrimTypeEnum[entity.insTypeI1 as keyof typeof TrimTypeEnum],
                pickPerc: entity.defaultPerc,
                requiredForMaterialReady: entity.materialReady,
                selected: entity.selected,
                supplierCode: entity.supplierCode,
                buyerCode: entity.buyerCode,
                insSelectionType: entity.insspectionSelectionType,
                itemCategory: entity.itemCategoryType
            }));

            // Group all configs under a single response model
            const responseData: InsTrimInsConfigModel[] = [
                new InsTrimInsConfigModel(req.supplierCode, "Buyer Name", insConfigs),
            ];

            return new InsTrimInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsTrimInsConfigResponse(false, 500, 'Error fetching data', []);
        }
    }



    async saveThreadInsConfig(req: InsThreadInsConfigRequest): Promise<InsThreadInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            // Delete existing records for the supplier
            await manager.getRepository(InsConfigEntity).delete({ supplierCode: req.supplierCode, itemCategoryType: req.itemCategory });
            console.log('after dletee')
            // Map request DTOs directly to entity objects
            const entities: InsConfigEntity[] = req.insConfigs.map(config => {
                const insConfigEntity = new InsConfigEntity();
                insConfigEntity.createdUser = req.username;
                insConfigEntity.companyCode = req.companyCode;
                insConfigEntity.unitCode = req.unitCode;
                insConfigEntity.supplierCode = req.supplierCode;
                insConfigEntity.insTypeI1 = config?.insType
                insConfigEntity.defaultPerc = config?.pickPerc;
                insConfigEntity.materialReady = config?.requiredForMaterialReady;
                insConfigEntity.selected = config.selected;
                insConfigEntity.buyerCode = '';
                insConfigEntity.insTypeI2 = '';
                insConfigEntity.insspectionSelectionType = config.insSelectionType;
                insConfigEntity.itemCategoryType = config.itemCategory
                return insConfigEntity;
            });
            // Save the entities
            await manager.getRepository(InsConfigEntity).save(entities, { reload: false });
            await manager.completeTransaction();
            return new InsThreadInsConfigResponse(true, 0, 'Configuration saved successfully');
        } catch (error) {
            await manager.releaseTransaction();
            console.error(error.message, error);
            return new InsThreadInsConfigResponse(false, 500, error.message);
        }
    }


    async getThreadInsConfig(req: InsSupplierCodeRequest): Promise<InsThreadInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insTypesRepo.find({ where: { supplierCode: req.supplierCode, itemCategoryType: req.itemCategory } });

            // If no records found, return empty response
            if (!entities.length)
                throw new ErrorResponse(2323, 'No data found');


            // Create the InsConfigValModel list
            const insConfigs: InsConfigThreadValModel[] = entities.map(entity => {
                const insType: any = entity.insTypeI1;
                const itemCategoryType: any = entity.itemCategoryType
                return new InsConfigThreadValModel(
                    entity.id,
                    insType.ThreadTypeEnum[entity.insTypeI1 as keyof typeof ThreadTypeEnum],
                    entity.defaultPerc,
                    entity.materialReady,
                    entity.selected,
                    entity.supplierCode,
                    entity.buyerCode,
                    entity.insspectionSelectionType,
                    itemCategoryType
                )
            });

            // Group all configs under a single response model
            const responseData: InsThreadInsConfigModel[] = [
                new InsThreadInsConfigModel(req.supplierCode, undefined, undefined, insConfigs),
            ];

            return new InsThreadInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsThreadInsConfigResponse(false, 500, 'Error fetching data', []);
        }
    }

    async saveYarnInsConfig(req: InsYarnInsConfigRequest): Promise<InsYarnInsConfigResponse> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            // Delete existing records for the supplier
            await manager.getRepository(InsConfigEntity).delete({ supplierCode: req.supplierCode, itemCategoryType: req.itemCategory });
            console.log('after dletee')
            // Map request DTOs directly to entity objects
            const entities: InsConfigEntity[] = req.insConfigs.map(config => {
                const insConfigEntity = new InsConfigEntity();
                insConfigEntity.createdUser = req.username;
                insConfigEntity.companyCode = req.companyCode;
                insConfigEntity.unitCode = req.unitCode;
                insConfigEntity.supplierCode = req.supplierCode;
                insConfigEntity.insTypeI1 = config?.insType
                insConfigEntity.defaultPerc = config?.pickPerc;
                insConfigEntity.materialReady = config?.requiredForMaterialReady;
                insConfigEntity.selected = config.selected;
                insConfigEntity.buyerCode = '';
                insConfigEntity.insTypeI2 = '';
                insConfigEntity.insspectionSelectionType = config.insSelectionType;
                insConfigEntity.itemCategoryType = config.itemCategory
                return insConfigEntity;
            });
            // Save the entities
            await manager.getRepository(InsConfigEntity).save(entities, { reload: false });
            await manager.completeTransaction();
            return new InsYarnInsConfigResponse(true, 0, 'Configuration saved successfully');
        } catch (error) {
            await manager.releaseTransaction();
            console.error(error.message, error);
            return new InsYarnInsConfigResponse(false, 500, error.message);
        }
    }



    async getYarnInsConfig(req: InsSupplierCodeRequest): Promise<InsYarnInsConfigResponse> {
        try {
            // Fetch records filtered by supplierCode
            const entities = await this.insTypesRepo.find({ where: { supplierCode: req.supplierCode, itemCategoryType: req.itemCategory } });

            // If no records found, return empty response
            if (!entities.length)
                throw new ErrorResponse(2323, 'No data found');


            // Create the InsConfigValModel list
            const insConfigs: InsConfigYarnValModel[] = entities.map(entity => {
                const insType: any = entity.insTypeI1;
                const itemCategoryType: any = entity.itemCategoryType
                return new InsConfigYarnValModel(
                    entity.id,
                    insType.YarnTypeEnum[entity.insTypeI1 as keyof typeof YarnTypeEnum],
                    entity.defaultPerc,
                    entity.materialReady,
                    entity.selected,
                    entity.supplierCode,
                    entity.buyerCode,
                    entity.insspectionSelectionType,
                    itemCategoryType
                )
            });

            // Group all configs under a single response model
            const responseData: InsYarnInsConfigModel[] = [
                new InsYarnInsConfigModel(req.supplierCode, undefined, insConfigs),
            ];

            return new InsYarnInsConfigResponse(true, 0, 'Data fetched successfully', responseData);
        } catch (error) {
            return new InsYarnInsConfigResponse(false, 500, error.message, []);
        }
    }





}




