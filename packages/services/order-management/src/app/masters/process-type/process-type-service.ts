import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ProcessTypeRepository } from "./repository/process-type-repository";
import { CommonResponse, GlobalResponseObject, ProcessTypeCreateRequest, ProcessTypeIdRequest, ProcessTypeModel, ProcessTypeResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../../database/typeorm-transactions/generic-transaction-manager";
import { ProcessTypeEntity } from "./entity/process-type-entity";
import { ErrorResponse } from "@xpparel/backend-utils";


@Injectable()
export class ProcessTypeService {
  constructor(
    private dataSource: DataSource,
    private processTypeRepo: ProcessTypeRepository,
  ) { }

  async createProcessType(reqModel: ProcessTypeCreateRequest): Promise<ProcessTypeResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ProcessTypeEntity[] = [];
      let isUpdate = false;

      for (const processType of reqModel.processtype) {
          const existingRecords = await this.processTypeRepo.find({
            where: [
              { processTypeCode: processType.processTypeCode },
            ]
          });

          if (existingRecords.length > 0 && !processType.id) {
            throw new ErrorResponse(55689, "process type already exists");
          }
        
        const entity = new ProcessTypeEntity();
        entity.id = processType.id;
        entity.processTypeName = processType.processTypeName;
        entity.processTypeCode = processType.processTypeCode;
        entity.processTypeDescription = processType.processTypeDescription;
        entity.remarks = processType.remarks;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        if (processType.id) {
          entity.updatedUser = reqModel.username;
          isUpdate = true;
        } else {
          entity.createdUser = reqModel.username;
        }

        const savedEntity = await transManager.getRepository(ProcessTypeEntity).save(entity);
        resultEntity.push(savedEntity);
      }
      await transManager.completeTransaction();
      const message = isUpdate ? "Updated" : "Created";
      return new ProcessTypeResponse(true, 85552, `ProcessType ${message} Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  async deleteProcessType(reqModel: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please give process type Id");
    }
    if (reqModel.id) {
      const records = await this.processTypeRepo.find({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(55689, "No records found");
      }
      const deleteProcessType = await this.processTypeRepo.delete(reqModel.id);
      return new ProcessTypeResponse(true, 85552, 'Process Type Deleted Successfully');
    }
  }

  async getAllProcessType(reqData: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    try {
      const records = await this.processTypeRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode } });
      const resultData: ProcessTypeModel[] = records.map(data => {
        return new ProcessTypeModel(data.id, data.processTypeName, data.processTypeCode, data.processTypeDescription, data?.remarks, data.imageName, data.imagePath, data.isActive);
      });
      return new ProcessTypeResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }


  async activateDeactivateProcessType(reqModel: ProcessTypeIdRequest): Promise<ProcessTypeResponse> {
    const getRecord = await this.processTypeRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });

    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.processTypeRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new ProcessTypeResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "ProcessType Activated Successfully" : "ProcessType Deactivated Successfully"
    );
  }


  async updateImagePath(files: any, id: number): Promise<CommonResponse> {
    try {
      const updateData: any = {};
      if (files && files.length > 0) {
        updateData.imageName = files[0].filename;
        updateData.imagePath = files[0].path;
      } else {
        updateData.imageName = null;
        updateData.imagePath = null;
      }
      const filePathUpdate = await this.processTypeRepo.update(
        { id: id },
        updateData
      );
      if (filePathUpdate.affected > 0) {
        return new CommonResponse(true, 11, 'Image Updated successfully', filePathUpdate);
      } else {
        return new CommonResponse(false, 11, 'Image Update failed', filePathUpdate);
      }
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }


}