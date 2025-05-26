import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { WarehouseUnitmappingRepository } from "./REPO/warehouse-unitmapping-repo";
import { WarehouseUnitmappingDto } from "./DTO/warehouse-unitmapping-dto";
import { GlobalResponseObject, WarehouseUnitmappingCreateRequest, WarehouseUnitmappingIdRequest, WarehouseUnitmappingModel, WarehouseUnitmappingResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions/generic-transaction-manager";
import { WarehouseUnitmappingEntity } from "./warehouse-unitmapping-entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class WarehouseUnitmappingService {
  constructor(
    private dataSource: DataSource,
    private warehouseUnitmappingRepo: WarehouseUnitmappingRepository,
  ) {}

  async createWarehouseUnitmapping(reqModel: WarehouseUnitmappingCreateRequest): Promise<WarehouseUnitmappingResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: WarehouseUnitmappingEntity[] = [];

      for (const warehouseUnitmapping of reqModel.warehouseUnitmappings) {
				const records = await this.warehouseUnitmappingRepo.find({ where: { warehouseCode: warehouseUnitmapping.warehouseCode, unitsCode: warehouseUnitmapping.unitsCode }});
				if (records.length > 0 && !warehouseUnitmapping.id) {
					throw new ErrorResponse(925, "Already exists");
				}

      const entity = new WarehouseUnitmappingEntity();
      entity.warehouseCode = warehouseUnitmapping.warehouseCode;
      entity.unitsCode = warehouseUnitmapping.unitsCode;
      entity.companysCode = warehouseUnitmapping.companysCode;
      entity.companyCode = reqModel.companyCode;
      entity.unitCode = reqModel.unitCode;
      entity.createdUser = reqModel.username;
      if (warehouseUnitmapping.id) {
        entity.id = warehouseUnitmapping.id;
        entity.updatedUser = reqModel.username;

      }

      if (records.length === 0) {
        const saveData = await transManager.getRepository(WarehouseUnitmappingEntity).save(entity);
      } else if (warehouseUnitmapping.id) {
        const saveData = await transManager.getRepository(WarehouseUnitmappingEntity).save(entity);
      } else {
        throw new ErrorResponse(55689, "Data exists with same component");
      }
    }

    await transManager.completeTransaction();
    return new WarehouseUnitmappingResponse(true, 85552, `warehouseUnitmapping "Updated" : "Created" Successfully`,resultEntity);
  } catch (error) {
    await transManager.releaseTransaction();
    throw error;
  }
}

  async deleteWarehouseUnitmapping(reqModel: WarehouseUnitmappingIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, 'Please provide warehouse unit mapping Id');
    }
    const records = await this.warehouseUnitmappingRepo.find({ where: { id: reqModel.id } });
    if (records.length === 0) {
      throw new ErrorResponse(55689, "No records found");
    }
    await this.warehouseUnitmappingRepo.delete({ id: reqModel.id });
    return new GlobalResponseObject(true, 85552, 'Deleted Successfully');
  }

  async getWarehouseUnitmapping(reqData: WarehouseUnitmappingIdRequest): Promise<WarehouseUnitmappingResponse> {
    try {
      const records = await this.warehouseUnitmappingRepo.find();
      if (records.length === 0) {
        throw new ErrorResponse(924, 'No Data Found');
      }
      const resultData: WarehouseUnitmappingModel[] = records.map(data => {
        return new WarehouseUnitmappingModel(data.id,data.warehouseCode,data.unitsCode,data.companysCode,data.isActive);
      });
      return new WarehouseUnitmappingResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(968, "Internal Server Error");
    }
  }

  // async updateWarehouseUnitmapping(req: WarehouseUnitmappingDto): Promise<WarehouseUnitmappingResponse> {
  //   const warehouseUnitmapping = await this.warehouseUnitmappingRepo.findOne({ where: { id: req.id } });
  //   if (!warehouseUnitmapping) {
  //     return new WarehouseUnitmappingResponse(false, 924, "No Data Found", req.id);
  //   }
  //   const duplicate = await this.warehouseUnitmappingRepo.findOne({
  //     where: { warehouseCode: req.warehouseCode, unitsCode: req.unitsCode, id: req.id }
  //   });
  //   if (duplicate) {
  //     return new WarehouseUnitmappingResponse(false, 925, 'Already exists');
  //   }
  //   await this.warehouseUnitmappingRepo.update({ id: req.id }, {
  //     warehouseCode: req.warehouseCode,
  //     unitsCode: req.unitsCode,
  //     companysCode: req.companysCode,
  //     unitCode: req.unitCode,
  //     companyCode: req.companyCode,
  //     userId: req.userId,
  //     isActive: req.isActive
  //   });
  //   return new WarehouseUnitmappingResponse(true, 85552, "Updated Successfully", req.id);
  // }


  async activeDeactiveWarehouseUnitmapping(reqModel: WarehouseUnitmappingIdRequest): Promise<WarehouseUnitmappingResponse> {
    const getRecord = await this.warehouseUnitmappingRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.warehouseUnitmappingRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new WarehouseUnitmappingResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Warehouse Unit Activated Successfully" : "Warehouse Unit Deactivated Successfully"
    );
  }
}