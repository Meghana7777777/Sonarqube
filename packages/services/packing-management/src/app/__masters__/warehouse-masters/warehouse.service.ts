import { Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, WareHouseResponse } from "@xpparel/shared-models";
import { TransactionalBaseService } from "../../../base-services";
import { ITransactionManager } from "../../../database/typeorm-transactions";
import { LoggerService } from "../../../logger";
import { WHCreateDto, WHtoggleDto } from "./dto";
import { FGMWareHouseEntity } from "./entities/fg-m-warehouse.entity";
import { WareHouseRepoInterface } from "./repositories/warehouse.repo.interface";


@Injectable()
export class WareHouseService extends TransactionalBaseService {
    constructor(
        @Inject('WareHouseRepoInterface')
        private readonly wareHouseRepo: WareHouseRepoInterface,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
    ) {
        super(transactionManager, logger)
    }

    async saveWithTransaction(dto: WHCreateDto) {
        return this.executeWithTransaction(async (transactionManager) => {
            const newWareHouse = this.wareHouseRepo.create(dto);
            await this.wareHouseRepo.save(newWareHouse);
            this.logMessage('Warehouse type saved successfully');
            return new CommonResponse(true, 46080, 'Warehouse type saved successfully');
        });
    }

    async createWareHouse(dto: WHCreateDto) {
        if (dto.wareHouseCode) {
            const findRecord = await this.wareHouseRepo.findOne({ where: { wareHouseCode: dto.wareHouseCode} });
            if (findRecord && findRecord.id !== dto.id) {
                throw new ErrorResponse(46081, "warehouse Code already exists.");
            }
        }
        const newWareHouse = this.wareHouseRepo.create(dto);
        await this.wareHouseRepo.save(newWareHouse);
        this.logMessage('Warehouse type saved successfully');
        return new GlobalResponseObject(true, dto?.id ? 46082:46083, dto.id ?'Warehouse updated Successfully':'Warehouse created Successfully')
    
    }

    async getAllWareHouse(dto: CommonRequestAttrs) {
        const getWareHouse = await this.wareHouseRepo.find({ where: { companyCode: dto.companyCode, unitCode: dto.unitCode }, order: { createdAt: 'DESC' } })
        if (getWareHouse.length) {
            return new WareHouseResponse(true, 46084, 'warehouse data retrieved successfully', getWareHouse)
        } else {
            return new WareHouseResponse(false, 924, 'No Data Found', [])
        }
    }

    async getWareHouseDropDown(dto: CommonRequestAttrs) {
        const getWareHouse = await this.wareHouseRepo.find({ select: ['id', 'wareHouseCode', 'wareHouseDesc', 'noOfFloors'], where: { companyCode: dto.companyCode, unitCode: dto.unitCode } })
        if (getWareHouse.length) {
            return new WareHouseResponse(true, 46084, 'warehouse data retrieved successfully', getWareHouse);
        } else {
            return new WareHouseResponse(false, 924, 'No Data Found', []);
        };
    }

    async toggleWareHouse(dto: WHtoggleDto) {
        const toggleWareHouse = await this.wareHouseRepo.findOneById(dto.id)
        if (toggleWareHouse) {
            const entity = new FGMWareHouseEntity()
            entity.id = dto.id
            entity.isActive = !toggleWareHouse.isActive
            await this.wareHouseRepo.save(entity)
            let message = toggleWareHouse.isActive ? "Deactivated Successfully" : " Activated Successfully"
            return new CommonResponse(true,toggleWareHouse.isActive ? 920 : 921, message)
        } else {
            return new CommonResponse(false, 924, "No Data Found")
        }
    }

    async getWareHouseToRacks(req: CommonRequestAttrs) {
        const getWareHouse = await this.wareHouseRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode ,isActive: true} })
        if (getWareHouse) {
            return new WareHouseResponse(true, 5554, 'items data retrieved successfully', getWareHouse)
        } else {
            return new WareHouseResponse(false, 924, 'No Data Found', [])
        }
    }

    async getWareHouseDropDownToRacks(req: CommonRequestAttrs) {
        const getWareHouse = await this.wareHouseRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode} })
        if (getWareHouse) {
            return new WareHouseResponse(true, 5554, 'items data retrieved successfully', getWareHouse)
        } else {
            return new WareHouseResponse(false, 924, 'No Data Found', [])
        }
    }

}