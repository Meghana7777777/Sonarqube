import { Inject, Injectable } from "@nestjs/common";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, MaterialTypeResponseDto, MaterialTypesResponse } from "@xpparel/shared-models";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { MTCreateDto, MTtoggleDto } from "./dtos";
import { MaterialTypeEntity } from "./entities/material-type.entity";
import { MaterialTypeRepoInterface } from "./repositories/material-type.repo.interface";
import { DataSource, Not } from "typeorm";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ItemsEntity } from "../items/entities/items.entity";

@Injectable()
export class MaterialTypeService extends TransactionalBaseService {
    constructor(
        @Inject('MaterialTypeRepoInterface')
        private readonly materialTypeRepo: MaterialTypeRepoInterface,
        @Inject('TransactionManager')
        
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        private dataSource: DataSource
    ) {
        super(transactionManager, logger)
    }

    async saveWithTransaction(dto: MTCreateDto) {
        return this.executeWithTransaction(async (transactionManager) => {
            const newMaterialType = this.materialTypeRepo.create(dto);
            await this.materialTypeRepo.save(newMaterialType);
            this.logMessage('material type saved successfully');
            return new CommonResponse(true, 36001, 'material type saved successfully');
        });
    }

    async createMaterialType(dto: MTCreateDto) {
        if (dto.materialTypeCode) {
            const findRecord = await this.materialTypeRepo.findOne({ where: { materialTypeCode: dto.materialTypeCode } });
            if (findRecord && findRecord.id !== dto.id) {
                throw new ErrorResponse(36002, "Material Type Code already exists.");
            }
        }
        const materialType = this.materialTypeRepo.create(dto);
        await this.materialTypeRepo.save(materialType);
        this.logMessage('Data Saved');
        return new GlobalResponseObject(true, dto?.id ? 922:923, dto.id ? 'Updated Successfully' : 'Created Successfully');
        }


    async getAllMaterialTypes(dto: CommonRequestAttrs) {
        const getMaterialType: any = await this.materialTypeRepo.find({ where: { companyCode: dto.companyCode, unitCode: dto.unitCode }, order: { createdAt: 'desc' } })
        if (getMaterialType.length) {
            for (const rec of getMaterialType) {
                const materialIsExist = await this.materialTypeRepo.materialIdExist(dto, rec.id);
                rec.isExist = materialIsExist
            }
            return new MaterialTypesResponse(true, 36003, 'material type data retrieved successfully', getMaterialType)
        } else {
            return new MaterialTypesResponse(false, 924, 'No Data Found', [])
        }
    }

    async toggleMaterialType(dto: MTtoggleDto) {
        const toggleMaterialType = await this.materialTypeRepo.findOneById(dto.id)
        if (toggleMaterialType) {
            const entity = new MaterialTypeEntity()
            entity.id = dto.id
            entity.isActive = !toggleMaterialType.isActive
            await this.materialTypeRepo.save(entity)
            let message = toggleMaterialType.isActive ? "Deactivated Successfully" : " Activated Successfully"
            return new CommonResponse(true, toggleMaterialType.isActive ? 920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async getMaterialsToItems() {
        const getMaterialType = await this.materialTypeRepo.getMaterialToItems()
        if (getMaterialType) {
            return new MaterialTypesResponse(true, 36004, 'items data retrieved successfully', getMaterialType)
        } else {
            return new MaterialTypesResponse(false, 924, 'No Data Found', [])
        }

    }
}