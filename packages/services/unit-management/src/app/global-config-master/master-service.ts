import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { AssetsLocationsCreateDto, AttributesIdModelDto, AttributesMasterCreateReq, AttributesMasterModelDto, AttributesMasterResponse, CommonRequestAttrs, CommonResponse, ConfigGcIdModelDto, ConfigMasterCreateReq, ConfigMasterModelIdDto, ConfigMasterResponse, DepartmentTypeEnumForMasters, GbMasterNamesEnum, GenericOptionsTypeEnum, GetAttributesByGcId, GetAttributesByGcIdResponseDto, GlobalResponseObject, MasterModelDto, MasterResponse, MasterToggleDto, ProcessTypeEnum } from "@xpparel/shared-models";
import { DataSource, Not } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ConfigMasterAttributesMappingEntity } from "./entity/config-master-attributes-entity";
import { ConfigMasterEntity } from "./entity/config-master-entity";
import { GlobalConfigEntity } from "./entity/global-config-entity";
import { AttributesMasterRepository } from "./repo/attributes-repo";
import { ConfigMasterRepository } from "./repo/config-master-repo";
import { GlobalConfigMasterRepository } from "./repo/global-config-master-repo";
import { AttributesMasterEntity } from "./entity/attributes-master-entity";
import { ConfigMasterAttributesMappingRepository } from "./repo/config-master-attributes-repo";
import { AssetLocationsService } from "@xpparel/shared-services";
import { AttributesQueryResDto } from "./dto/attributes-query-res-dto";

@Injectable()
export class MasterService {
    constructor(
        private dataSource: DataSource,
        private globalConfigRepo: GlobalConfigMasterRepository,
        private configMasterRepo: ConfigMasterRepository,
        private attributesMasterRepo: AttributesMasterRepository,
        private attributesMappingRepo: ConfigMasterAttributesMappingRepository,
        private assetLocationsService: AssetLocationsService
    ) {

    }

    async saveGlobalConfigMasters(dto: MasterModelDto): Promise<MasterResponse> {
        const transactionalManager = new GenericTransactionManager(this.dataSource)
        try {
            await transactionalManager.startTransaction();
            const gn = new GlobalConfigEntity();
            gn.masterName = dto.masterName
            gn.masterCode = dto.masterCode
            gn.masterLabel = dto.masterLabel
            gn.parentId = dto.parentId;
            gn.companyCode = dto.companyCode;
            gn.unitCode = dto.unitCode;
            gn.createdUser = dto.username;
            if (dto.id) {
                gn.id = dto.id;
                gn.updatedUser = dto.username;
                await transactionalManager.getRepository(ConfigMasterAttributesMappingEntity).delete({ globalConfigId: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode });
            }
            const saveGlobalConfig = await transactionalManager.getRepository(GlobalConfigEntity).save(gn);
            if (dto?.attributes?.length) {
                const attributes = [];
                for (const att of dto.attributes) {
                    const attributesE = new ConfigMasterAttributesMappingEntity();
                    attributesE.companyCode = dto.companyCode;
                    attributesE.unitCode = dto.unitCode;
                    attributesE.createdUser = dto.username;
                    attributesE.attributesId = att;
                    attributesE.globalConfigId = saveGlobalConfig.id;
                    attributes.push(attributesE);
                }
                await transactionalManager.getRepository(ConfigMasterAttributesMappingEntity).save(attributes);
            }

            await transactionalManager.completeTransaction();
            return new GlobalResponseObject(true, dto?.id ? 209 : 210, dto.id ? 'Updated Successfully' : 'Created Successfully')
        } catch (error) {
            await transactionalManager.releaseTransaction();
            throw new ErrorResponse(5611, error.message)
        }
    }

    async getDropDownParentId(req: CommonRequestAttrs): Promise<CommonResponse> {
        try {
            const data = await this.globalConfigRepo.find({ select: ['id', 'masterCode', 'parentId', 'masterName', 'masterLabel'], where: { companyCode: req.companyCode, unitCode: req.unitCode }, order: { createdAt: 'DESC' } })
            if (data.length > 0) {
                return new CommonResponse(true, 200, 'Data retrieved successfully', data)
            } else {
                return new CommonResponse(false, 204, 'No Data Found', []);
            }
        }
        catch (error) {
            console.error('Error fetching masters:', error);
            return new CommonResponse(false, 500, 'Internal Server Error', []);
        }
    }


    async getGlobalConfigMasters(req: ConfigMasterModelIdDto): Promise<CommonResponse> {
        try {
            const whereClause = new GlobalConfigEntity();
            whereClause.companyCode = req.companyCode;
            whereClause.unitCode = req.unitCode;
            if (req.id) {
                whereClause.id = req.id;
            }
            const data: any = await this.globalConfigRepo.find({ select: ['masterCode', 'masterName', 'masterLabel', 'parentId', 'id', 'isActive'], where: whereClause, order: { createdAt: 'DESC' } })
            if (data.length > 0) {
                for (const rec of data) {
                    if (rec.parentId) {
                        const findParentCode = await this.globalConfigRepo.findOne({ select: ['masterName'], where: { companyCode: req.companyCode, unitCode: req.unitCode, id: rec.parentId } })
                        rec.parentCode = findParentCode?.masterName;
                    };
                    const attributes = await this.attributesMappingRepo.find({ select: ['attributesId'], where: { globalConfigId: rec.id } })
                    rec.attributes = attributes.map((rec) => Number(rec.attributesId));
                }
                return new CommonResponse(true, 200, 'Data retrieved successfully', data);
            } else {
                return new CommonResponse(false, 204, 'No Data Found', []);
            }
        } catch (error) {
            console.error('Error fetching masters:', error);
            return new CommonResponse(false, 500, 'Internal Server Error', []);
        }
    }

    async saveConfigMasters(dto: any): Promise<ConfigMasterResponse> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            const saveValue = await this.globalConfigRepo.findOne({ select: ['masterName'], where: { id: dto.globalConfigId, companyCode: dto.companyCode, unitCode: dto.unitCode } })
            if (!saveValue) {
                throw new ErrorResponse(36098, "Global Config does not exist.");
            }
            const configMe = new ConfigMasterEntity();
            configMe.code = dto.code;
            configMe.name = dto.name;
            configMe.companyCode = dto.companyCode;
            configMe.createdUser = dto.username;
            configMe.unitCode = dto.unitCode;
            configMe.globalConfigId = dto.globalConfigId;
            configMe.parentId = dto.parentId;
            if (dto.id) {
                const findOldConfigId = await this.configMasterRepo.findOne({ select: ['id'], where: { unitCode: dto.unitCode, companyCode: dto.companyCode, configMasterId: dto.id, code: Not('null'), name: Not('null'), globalConfigId: dto.globalConfigId } })
                configMe.id = findOldConfigId.id;
                configMe.updatedUser = dto.userName;
                await transManager.getRepository(ConfigMasterEntity).delete({ unitCode: dto.unitCode, companyCode: dto.companyCode, configMasterId: dto.id, attributeName: Not('null'), attributeValue: Not('null'), globalConfigId: dto.globalConfigId })
            }
            const saveConfig = await transManager.getRepository(ConfigMasterEntity).save(configMe);
            delete dto.code;
            delete dto.name;
            delete dto.companyCode;
            delete dto.username;
            delete dto.unitCode;
            delete dto.globalConfigId;
            delete dto.parentId;
            delete dto.userId;
            delete dto.id
            const dynamicSave: ConfigMasterEntity[] = [];
            if (Object.keys(dto)?.length) {
                for (const reqKeys of Object.keys(dto)) {
                    const findAttributeId = await this.attributesMasterRepo.findOne({ select: ['id'], where: { unitCode: saveConfig.unitCode, companyCode: saveConfig.companyCode, name: reqKeys } })
                    const configDynamic = new ConfigMasterEntity();
                    configDynamic.attributeName = reqKeys;
                    configDynamic.attributeValue = dto[reqKeys];
                    configDynamic.attributesId = findAttributeId.id;
                    configDynamic.companyCode = saveConfig.companyCode;
                    configDynamic.unitCode = saveConfig.unitCode;
                    configDynamic.createdUser = saveConfig.createdUser;
                    configDynamic.globalConfigId = saveConfig.globalConfigId;
                    configDynamic.parentId = saveConfig.parentId;
                    configDynamic.configMasterId = saveConfig.id;
                    await transManager.getRepository(ConfigMasterEntity).update({ id: saveConfig.id }, { configMasterId: saveConfig.id });
                    dynamicSave.push(configDynamic)
                };
            } else {
                await transManager.getRepository(ConfigMasterEntity).update({ id: saveConfig.id }, { configMasterId: saveConfig.id });
            }

            // if (saveValue.masterName === GbMasterNamesEnum.Module) {
            //     const req = new AssetsLocationsCreateDto(dto['locationType'], dto['code'])
            //     await this.assetLocationsService.createLocation(req);
            // }
            await transManager.getRepository(ConfigMasterEntity).save(dynamicSave);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, dto?.id ? 209 : 210, dto.id ? 'Updated Successfully' : 'Created Successfully')
        } catch (error) {
            await transManager.releaseTransaction();
            throw new ErrorResponse(561245, error.message)
        }

    }


    async getConfigMasters(req: ConfigGcIdModelDto, departmentType?: DepartmentTypeEnumForMasters, processType?: ProcessTypeEnum): Promise<CommonResponse> {
        try {
            const attributesWithProperties: GetAttributesByGcId[] = await this.globalConfigRepo.getAttributesByGcId(req);
            const keysAndLabels: { title: string, dataIndex: string }[] = [];
            keysAndLabels.push({ title: 'Name', dataIndex: 'name' });
            keysAndLabels.push({ title: 'Code', dataIndex: 'code' });
            for (const rec of attributesWithProperties[0].attributeProperties) {
                keysAndLabels.push({ title: rec.labelName, dataIndex: rec.name });
            };
            const findAttributes = await this.configMasterRepo.getGroupedConfigMastersData(req, departmentType,processType);
            const data = await this.attributesMappingAgainstToCmId(findAttributes, req.companyCode, req.unitCode, req.globalConfigId)
            return new CommonResponse(true, 3512, "Data Retrieved Successfully", { keysAndLabels, data: data })
        } catch (error) {
            console.error('Error fetching masters:', error);
            return new CommonResponse(false, 500, error.message, []);
        }
    };


    async attributesMappingAgainstToCmId(findAttributes: AttributesQueryResDto[], companyCode: string, unitCode: string, globalConfigId: number) {
        const mapValues = new Map<number, any>()
        for (const rec of findAttributes) {
            const key = rec.config_master_id ? rec.config_master_id : rec.cmId
            if (!mapValues.has(key)) {
                mapValues.set(key, {})
            }
            const values = Object.assign(mapValues.get(key), rec.attribute_name ? { [rec.attribute_name]: rec.attribute_value } : {}
            )
            if (rec.code !== null) {
                Object.assign(values, { code: rec.code, isActive: rec.is_active });
            }
            if (rec.name !== null) {
                Object.assign(values, { name: rec.name, isActive: rec.is_active });
            }
            if (rec.parent_id !== null) {
                const parent = await this.configMasterRepo.findOne({ select: ['code'], where: { id: rec.parent_id, companyCode: companyCode, unitCode: unitCode } })
                Object.assign(values, { parentCode: parent.code, parentId: String(rec.parent_id) })
            };
            const masterName = await this.globalConfigRepo.findOne({ select: ['masterCode'], where: { id: globalConfigId, companyCode: companyCode, unitCode: unitCode } })
            Object.assign(values, { configMasterId: key, [masterName?.masterCode + 'Id']: key })
            mapValues.set(key, values)
        };
        return Array.from(mapValues.values())
    }







    async getParentIdDropDownAgainstGcID(req: ConfigGcIdModelDto): Promise<CommonResponse> {
        try {
            const record = await this.configMasterRepo.getParentIdDropDownAgainstGcID(req)
            if (record.length > 0) {
                return new CommonResponse(true, 200, 'Data retrieved successfully', record);
            } else {
                return new CommonResponse(false, 204, 'No Data Found', []);
            }
        } catch (error) {
            console.error('Error fetching masters:', error);
            return new CommonResponse(false, 500, error.message, []);
        }
    }


    async toggleConfigMasters(dto: MasterToggleDto) {
        const transactionalManager = new GenericTransactionManager(this.dataSource)
        try {
            const togglePackType = await this.configMasterRepo.find({ select: ['id', 'isActive'], where: { configMasterId: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } })
            await transactionalManager.startTransaction();
            if (togglePackType?.length) {
                for (const rec of togglePackType) {
                    const entity = new ConfigMasterEntity()
                    entity.id = rec.id
                    entity.isActive = !rec.isActive
                    await transactionalManager.getRepository(ConfigMasterEntity).save(entity)
                }
                await transactionalManager.completeTransaction()
                let message = togglePackType[0].isActive ? "Deactivated Successfully" : "Activated Successfully"
                return new CommonResponse(true, togglePackType[0].isActive ? 920 : 921, message)
            } else {
                throw new ErrorResponse(924, "No Data Found")
            }
        } catch (error) {
            await transactionalManager.releaseTransaction();
            throw new ErrorResponse(6513, error.message)
        }

    }

    async toggleGlobalConfigMasters(dto: MasterToggleDto) {
        const togglePackType = await this.globalConfigRepo.findOneBy({ id: dto.id })
        if (togglePackType) {
            const entity = new GlobalConfigEntity()
            entity.id = dto.id
            entity.isActive = !togglePackType.isActive
            await this.globalConfigRepo.save(entity)
            let message = togglePackType.isActive ? "Deactivated Successfully" : "Activated Successfully"
            return new CommonResponse(true, togglePackType.isActive ? 920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    };


    // Attributes Master
    async toggleAttributesMasters(dto: MasterToggleDto) {
        const toggleAttributes = await this.attributesMasterRepo.findOneBy({ id: dto.id })
        if (toggleAttributes) {
            const entity = new AttributesMasterEntity()
            entity.id = dto.id
            entity.isActive = !toggleAttributes.isActive
            await this.attributesMasterRepo.save(entity)
            let message = toggleAttributes.isActive ? "Deactivated Successfully" : "Activated Successfully"
            return new CommonResponse(true, toggleAttributes.isActive ? 920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }
    async saveAttributesMasters(req: AttributesMasterCreateReq): Promise<AttributesMasterResponse> {
        try {
            const en = new AttributesMasterEntity()
            en.id = req.id
            en.name = req.name
            en.labelName = req.labelName
            en.inputType = req.inputType
            en.requiredField = req.requiredField
            en.placeHolder = req.placeHolder
            en.validationMessage = req.validationMessage
            en.maxLength = req.maxLength
            en.minLength = req.minLength
            en.companyCode = req.companyCode;
            en.unitCode = req.unitCode;
            en.createdUser = req.username;
            en.hidden = req.hidden;
            en.disabled = req.disabled;
            en.optionsType = req?.optionsType;
            en.optionsSource = req?.optionsSource?.toString()
            if (req.id) {
                en.id = req.id;
                en.updatedUser = req.username;
            }
            await this.attributesMasterRepo.save(en);
            return new GlobalResponseObject(true, req?.id ? 209 : 210, req.id ? 'Updated Successfully' : 'Created Successfully');
        } catch (error) {
            throw new ErrorResponse(56116, error.message)
        }

    }


    async getAttributesMasters(req: CommonRequestAttrs): Promise<AttributesMasterResponse> {
        const attribute = await this.attributesMasterRepo.find({ select: ['id', 'inputType', 'isActive', 'labelName', 'maxLength', 'minLength', 'name', 'placeHolder', 'requiredField', 'validationMessage', 'disabled', 'hidden', 'optionsSource', 'optionsType'], where: { companyCode: req.companyCode, unitCode: req.unitCode }, order: { createdAt: 'DESC' } });
        const data: AttributesMasterModelDto[] = [];
        if (!attribute?.length) {
            throw new ErrorResponse(36098, "Attribute not found");
        } else {
            for (const rec of attribute) {
                const optionsResource: string[] = rec.optionsType === GenericOptionsTypeEnum.API ? [rec.optionsSource] : rec.optionsSource?.split(',')
                data.push(new AttributesMasterModelDto(rec.id, rec.name, rec.labelName, rec.inputType, Boolean(rec.requiredField), rec.placeHolder, rec.validationMessage, rec.maxLength, rec.minLength, rec.isActive, [], rec.hidden, rec.disabled, rec.optionsType, optionsResource))
            }
            return new AttributesMasterResponse(true, 200, "Data retrieved successfully", data);
        }
    };


    async getAttributesByGcId(req: ConfigGcIdModelDto): Promise<GetAttributesByGcIdResponseDto> {
        const data = await this.globalConfigRepo.getAttributesByGcId(req)
        if (!data?.length) {
            throw new ErrorResponse(64561, 'There Is No Attributes Found')
        }
        return new GetAttributesByGcIdResponseDto(true, 54654, 'Data Retrieved Successfully', data)
    };


}


