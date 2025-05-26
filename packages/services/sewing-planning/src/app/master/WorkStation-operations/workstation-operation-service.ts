import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, WorkstationOperationIdRequest, WorkstationOperationResponse } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions/generic-transaction-manager";
import { WorkStationOpeartionDto } from "./workstation-operation-dto";
import { WorkstationOperationEntity } from "./workstation-operation-entity";
import { WorkstationOperationRepository } from "./workstation-operation-repository";
import { WorkstationEntity } from "../workstation/workstation.entity";


@Injectable()
export class WorkstationOperationService {
  constructor(
    private dataSource: DataSource,
    private WorkstationOperationRepo: WorkstationOperationRepository,

  ) {

  }
  
  async createWorkstationOperation(reqsModel: WorkStationOpeartionDto[]): Promise<WorkstationOperationResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {

        await transManager.startTransaction();
        const entities = [];
        let isUpdate = false;

        for (const reqModel of reqsModel) {
            const entity = new WorkstationOperationEntity();
            entity.wsCode = reqModel.wsCode;
            entity.iOpCode = reqModel.iOpCode;
            entity.opName = reqModel.opName;
            entity.externalRefCode = reqModel.externalRefCode;
            entity.companyCode = reqModel.companyCode;
            entity.createdUser = reqModel.username;
            entity.unitCode = reqModel.unitCode;
            if (reqModel.id) {
                entity.id = reqModel.id;
                entity.updatedUser = reqModel.username;
                isUpdate = true;
            }
            entities.push(entity);
        }
        const saveData = await transManager.getRepository(WorkstationOperationEntity).save(entities);
        await transManager.completeTransaction();
        const message = isUpdate ? "Updated successfully" : "Created Successfully";
        return new WorkstationOperationResponse(true, 85552, message, saveData);
    } catch (error) {
        throw error;
    }
}

  async deleteWorkstationOperation(reqModel: WorkstationOperationIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(26120, "Please give work station operation Id")
    }
    if (reqModel.id) {
      const records = await this.WorkstationOperationRepo.find({ where: { id: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(26121, "workstation Data not Found")
      }
      const deleteWorkstationOperation = await this.WorkstationOperationRepo.delete({ id: reqModel.id });
      return new GlobalResponseObject(true, 26122, 'workstation Deleted Successfully');
    }

  }

  async getWorkstationOperation(): Promise<WorkstationOperationResponse> {
    try {
      const data = await this.WorkstationOperationRepo.find()
      const empty = []
      for (const rec of data) {
        const findWorkStations = await this.dataSource.getRepository(WorkstationEntity).findOne({ where: { wsCode: rec.wsCode } })
        empty.push({
          id: rec.id,
          wsCode: rec.wsCode,
          iOpCode: rec.iOpCode,
          wsName: findWorkStations?.wsName,
          opName: rec.opName,
          externalRefCode: rec.externalRefCode,
          isActive:rec.isActive
        })
      }
      if (empty?.length) {
        return new WorkstationOperationResponse(true, 967, "Data Retrieved Successfully", empty);
      }
      // else {
      //   return new WorkstationOperationResponse(false, 924, "No Data Found ", []);

      // }
    } catch (err) {
      return new WorkstationOperationResponse(false, err.errorCode, err.message);
    }
  }

  // async updateWorkstationOperation(req: WorkStationOpeartionDto): Promise<WorkstationOperationResponse> {
  //   console.log(req, 'vvvvvvvvvvvvvvvvv');
  //   const workstationoperation = await this.WorkstationOperationRepo.findOne({ where: { id: req.id } });

  //   if (workstationoperation) {
  //     await this.WorkstationOperationRepo.update({ id: req.id }, req);
      
  //     return new WorkstationOperationResponse(true, 65152, "Updated Successfully", req.id);
  //   } else {
  //     return new WorkstationOperationResponse(false, 6541, "Updation Failed", req.id);
  //   }
  // }


  async activateDeactivateWorkStationOperation(reqModel: WorkStationOpeartionDto): Promise<WorkstationOperationResponse> {
    const getRecord = await this.WorkstationOperationRepo.findOne({ where: { id: reqModel.id } });
    const toggle = await this.WorkstationOperationRepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new WorkstationOperationResponse(true, getRecord.isActive ? 26133 : 26123, getRecord.isActive ? 'workstation operation de-activated successfully' : 'workstation operation activated successfully');

  }



}