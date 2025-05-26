import { Inject, Injectable } from "@nestjs/common";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, PackTypesResponse } from "@xpparel/shared-models";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { PackTypeRepoInterface } from "./repositories/pack-type.repo.interface";
import { PTCreateDto, PTToggleDto } from "./dtos";
import { PackTypeEntity } from "./entities/pack-type.entity";
import { Not } from "typeorm";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class PackTypeService extends TransactionalBaseService {
    constructor(
        @Inject('PackTypeRepoInterface')
        private readonly packTypeRepo: PackTypeRepoInterface,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
    ) {
        super(transactionManager, logger)
    }

    async saveWithTransaction(dto: PTCreateDto) {
        return this.executeWithTransaction(async (transactionManager) => {
            const newPackType = this.packTypeRepo.create(dto);
            await this.packTypeRepo.save(newPackType);
            this.logMessage('material type saved successfully');
            return new CommonResponse(true, 36016, 'material type saved successfully');
        });
    }
    async createPackType(dto: PTCreateDto) {

        if (dto.packTypeCode) {
            const findRecord = await this.packTypeRepo.findOne({ where: { packTypeCode: dto.packTypeCode } });
            if (findRecord && findRecord.id !== dto.id) {
                throw new ErrorResponse(36017, "Pack Type Code already exists.");
            }
        }

        const packtype = this.packTypeRepo.create(dto);
        await this.packTypeRepo.save(packtype);
        this.logMessage('Data saved successfully');
        return new GlobalResponseObject(true, dto?.id ? 922:923, dto.id ? 'updated Successfully':'created Successfully');
        }

    async getAllPackTypes(dto: CommonRequestAttrs) {
        const getPackType = await this.packTypeRepo.find({ where: { companyCode: dto.companyCode, unitCode: dto.unitCode }, order: { createdAt: 'DESC' } })
        if (getPackType) {
            return new PackTypesResponse(true, 36018, ' Pack type data retrieved successfully', getPackType)
        } else {
            return new PackTypesResponse(false, 924, 'No Data Found', [])
        }
    }

    async getAllPackTypesDropDown(dto: CommonRequestAttrs) {
        const getPackTypeDd = await this.packTypeRepo.getPackTypeDropDown(dto)
        if (getPackTypeDd) {
            return new PackTypesResponse(true, 36019, 'Pack type data retrieved successfully', getPackTypeDd)
        } else {
            return new PackTypesResponse(false, 924, 'No Data Found', [])
        }
    }



    async togglePackType(dto: PTToggleDto) {
        const togglePackType = await this.packTypeRepo.findOneById(dto.id)
        if (togglePackType) {
            const entity = new PackTypeEntity()
            entity.id = dto.id
            entity.isActive = !togglePackType.isActive
            await this.packTypeRepo.save(entity)
            let message = togglePackType.isActive ? "Deactivated Successfully" : " Activated Successfully"
            return new CommonResponse(true,togglePackType.isActive ?920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async getMaterialsToItems() {
        const getPackType = await this.packTypeRepo.find({ select: ['id', 'packTypeCode', 'packTypeDesc'] })
        if (getPackType) {
            return new PackTypesResponse(true, 36020, 'items data retrieved successfully', getPackType)
        } else {
            return new PackTypesResponse(false, 924, 'No Data Found', [])
        }

    }
}
