import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { WarehouseRepository } from "./REPO/warehouse-repo";
import { WarehouseDto } from "./DTO/warehouse-dto";
import { GlobalResponseObject, WarehouseCreateRequest, WarehouseIdRequest, WarehouseModel, WarehouseResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions/generic-transaction-manager";
import { WarehouseEntity } from "./warehouse-entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()  
export class WarehouseService {
  constructor(
    private dataSource: DataSource,
    private warehouseRepo: WarehouseRepository,
  ) {

  }
  
  async createWarehouse(reqModel: WarehouseCreateRequest): Promise<WarehouseResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: WarehouseEntity[] = [];

       
      for (const warehouse of reqModel.warehouses) {
				const records = await this.warehouseRepo.find({ where: { warehouseCode: warehouse.warehouseCode} });
				if (records.length > 0 && !warehouse.id) {
					throw new ErrorResponse(925, "Already exists");
				}

      const entity = new WarehouseEntity();
      entity.warehouseName = warehouse.warehouseName;
      entity.warehouseCode = warehouse.warehouseCode;
      entity.companysCode = warehouse.companysCode;
      entity.location = warehouse.location;
      entity.address = warehouse.address;
      entity.warehouseType = warehouse.warehouseType;
      entity.companyCode = reqModel.companyCode;
      entity.unitCode = reqModel.unitCode;
      entity.createdUser = reqModel.username;
      entity.latitude = warehouse.latitude;
      entity.longitude = warehouse.longitude;
      if (warehouse.id) {
        entity.id = warehouse.id;
        entity.updatedUser = reqModel.username;
      }

      if (records.length === 0) {
        const saveData = await transManager.getRepository(WarehouseEntity).save(entity);
      } else if (warehouse.id) {
        const saveData = await transManager.getRepository(WarehouseEntity).save(entity);
      } else {
        throw new ErrorResponse(55689, "Data exists with same component");
      }
    }

    await transManager.completeTransaction();
    return new WarehouseResponse(true, 85552, 'warehouse Updated Successfully:warehouse Created Successfully',resultEntity);
  } catch (error) {
    await transManager.releaseTransaction();
    throw error;
  }
}


  async deleteWarehouse(reqModel: WarehouseIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, 'Please give warehouse Id');
    }
    if (reqModel.id) {
      const records = await this.warehouseRepo.find({where: {id: reqModel.id}});
      if (records.length === 0) {
        throw new ErrorResponse(55689, "No records found")
      }
      const deleteWarehouse = await this.warehouseRepo.delete({id: reqModel.id});
      return new GlobalResponseObject(true, 85552, 'Deleted Successfully');
    }

  }

  async getWarehouse(reqData: WarehouseIdRequest): Promise<WarehouseResponse> {
    try {
      const records = await this.warehouseRepo.find();
      if (records.length === 0) {
        throw new ErrorResponse(924, 'No Data Found');
      }
      const resultData: WarehouseModel[] = records.map(data => {
        return new WarehouseModel(data.id,data.warehouseName,data.warehouseCode,data.companysCode,data.location,data.address,data.warehouseType,data.isActive,data.latitude,data.longitude);
      });
      return new WarehouseResponse(true, 967,  "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(968, "Internal Server Error");
    }
  }

  // async updateWarehouse(req: WarehouseDto): Promise<WarehouseResponse>
  //   {
  //     const warehouse = await this.warehouseRepo.findOne({ where: { id: req.id } });
  //     if (!warehouse) {
  //       return new WarehouseResponse(false, 6541,"No Data Found", req.id);
  //   }
  //   const duplicate = await this.warehouseRepo.findOne({
  //     where: { warehouseCode: req.warehouseCode,warehouseName: req.warehouseName }
  //   });
  //   if (duplicate) {
  //     return new WarehouseResponse(false, 3, 'Already exists');
  //   }
  //   await this.warehouseRepo.update({ id: req.id },{
  //     warehouseName: req.warehouseName,
  //     warehouseCode: req.warehouseCode,
  //     companysCode: req.companysCode,
  //     location: req.location,
  //     address: req.address,
  //     warehouseType: req.warehouseType,
  //     unitCode: req.unitCode,
  //     companyCode: req.companyCode,
  //     userId: req.userId,
  //     isActive: req.isActive,
  //     latitude: req.latitude,
  //     longitude: req.longitude
  //   });
  //   return new WarehouseResponse(true, 85552, "Updated Successfully", req.id);
  //   } 

  //   async activateDeactiveWarehouse(reqModel: WarehouseDto): Promise<WarehouseResponse> {
  //     const getRecord = await this.warehouseRepo.findOne({ where: { id: reqModel.id } });
  //     const toggle = await this.warehouseRepo.update({ id: reqModel.id },
  //       { isActive: getRecord.isActive == true ? false : true });
  //       return new WarehouseResponse(true,getRecord.isActive ? 0 : 1, getRecord.isActive ? " Warehouse Deactivated Successfully" : "Warehouse Activated Successfully");
  // }

  async activateDeactiveWarehouse(reqModel: WarehouseIdRequest): Promise<WarehouseResponse> {
    const getRecord = await this.warehouseRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    console.log("getRecord", getRecord);
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.warehouseRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new WarehouseResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Warehouse Activated Successfully" : "Warehouse Deactivated Successfully"
    );
  }

}