import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { OperationHelperService } from "./operation-helper.service";
import { OperationInfoService } from "./operation-info.service";
import { OperationRepository } from "./repository/operation.repository";
import { OperationEntity } from "./entity/operation.entity";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, MachineNameRequest, OperationCategoryFormRequest, OperationCodeRequest, OperationCreateRequest, OperationDataResponse, OperationModel, OperationResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class OperationService {
  constructor(
    private dataSource: DataSource,
    private infoService: OperationInfoService,
    private helperService: OperationHelperService,
    private operationRepo: OperationRepository
  ) {

  }

  async createOperation(req: OperationCreateRequest): Promise<GlobalResponseObject> {
    console.log("createOperation", req);
    
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const entityOp = new OperationEntity();
      entityOp.opName = req.opName;
      entityOp.iOpCode = req.iOpCode;
      entityOp.eOpCode = req.eOpCode;
      entityOp.opForm = req.opForm;
      entityOp.opCategory = req.opCategroy;
      entityOp.companyCode = req.companyCode;
      entityOp.createdUser = req.username;
      entityOp.unitCode = req.unitCode;
      entityOp.machineName = Array.isArray(req.machineName) ? req.machineName.join(', ') : req.machineName;
      const operationExists = await this.operationRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.iOpCode } });
      if (operationExists) {
        await this.operationRepo.update({ unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.iOpCode }, 
          { eOpCode: req.eOpCode, opForm: req.opForm, opName: req.opName, opCategory: req.opCategroy, updatedUser: req.username, machineName: Array.isArray(req.machineName) ? req.machineName.join(', ') : req.machineName });
        // throw new ErrorResponse(0, `Operation code ${req.iOpCode} already exist`);
      } else {
        await transManager.getRepository(OperationEntity).save(entityOp, { reload: false });
      }
      await transManager.completeTransaction();
          const message = operationExists
  ? "Operations Updated Successfully"
  : "Operations Created Successfully";

return new GlobalResponseObject(true, 85552, message);
} catch (error) {
await transManager.releaseTransaction();
throw error;
}
  }

  async deleteOperation(req: OperationCodeRequest): Promise<GlobalResponseObject> {
    if (!req.opCode) {
      throw new ErrorResponse(0, "Operation code must be provided");
    }
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode } });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Operation code is not Found");
    }
    // check if this op is utilized in the oes
    await this.operationRepo.delete({ unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode });
    return new GlobalResponseObject(true, 85552, 'Operation Deleted Successfully');
  }

  async deActivateOperation(req: OperationCodeRequest): Promise<GlobalResponseObject> {
    if (!req.opCode) {
      throw new ErrorResponse(0, "Operation code must be provided");
    }
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode } });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Operation code is not Found");
    }
    await this.operationRepo.update({ unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode }, { isActive: false });
    return new GlobalResponseObject(true, 0, 'Operation de-activated successfully');
  }

  async activateOperation(req: OperationCodeRequest): Promise<GlobalResponseObject> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode } });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Operation code is not Found");
    }
    await this.operationRepo.update({ unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode }, { isActive: false });
    return new GlobalResponseObject(true, 0, 'Operation activated successfully');
  }

  async getAllOperations(req: CommonRequestAttrs): Promise<OperationResponse> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultModel: OperationModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
    for (const op of records) {
    
      const res = new OperationModel(op.iOpCode, op.eOpCode, op.opCategory, op.opForm, op.opName, 0, '',0,op.machineName);
      resultModel.push(res);
    }
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully', resultModel);
  }

  async getAllOperationbyId(req: CommonRequestAttrs): Promise<OperationResponse> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultModel: OperationModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
    for (const op of records) {
      const res = new OperationModel(op.iOpCode, op.eOpCode, op.opCategory, op.opForm, op.opName, 0, '',0,op.machineName);
      resultModel.push(res);
    }
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully', resultModel);
  }

  async getOperationsByCategory(req: OperationCategoryFormRequest): Promise<OperationResponse> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, opCategory: req.opCategory } });
    const resultModel: OperationModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
    for (const op of records) {
      const res = new OperationModel(op.iOpCode, op.eOpCode, op.opCategory, op.opForm, op.opName, 0, '',0,op.machineName);
      resultModel.push(res);
    }
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully', resultModel);
  }

  async OperationsTypeDropDown(req: any): Promise<OperationDataResponse> {
    const getRecord = await this.operationRepo.findOne({ where: { id: req.id } });

    const data = await this.operationRepo.find({ select: ['id', 'iOpCode', 'opName'], });
    if (data.length) {
      return new OperationDataResponse(true, 967, "Data Retrieved Successfully", data)
    } else {
      return new OperationDataResponse(false, 965, 'Data Not Found')
    }
  }

  async getOperationsByOperationForm(req: OperationCategoryFormRequest): Promise<OperationResponse> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, opForm: req.opForm } });
    const resultModel: OperationModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
    for (const op of records) {
      const res = new OperationModel(op.iOpCode, op.eOpCode, op.opCategory, op.opForm, op.opName, 0, '',0,op.machineName);
      resultModel.push(res);
    }
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully', resultModel);
  }

  async getAllActiveOperations(): Promise<CommonResponse> {
    try {
      const query = await this.operationRepo.getAllActiveOperations()
      if (query) {
        return new CommonResponse(true, 1, "Data Retrieved", query)
      } else {
        return new CommonResponse(false, 965, "No Data Found")
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOperationsByMachineName(req: MachineNameRequest): Promise<OperationResponse> {
    const records = await this.operationRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, machineName : req.machineName } });
    const resultModel: OperationModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
    for (const op of records) {
      const res = new OperationModel(op.iOpCode, op.eOpCode, op.opCategory, op.opForm, op.opName, 0, '',0,op.machineName);
      resultModel.push(res);
    }
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully for the Machine Name', resultModel);
  }


  async getOperationbyOpCode(req: OperationCodeRequest): Promise<OperationResponse> {
    const record = await this.operationRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, iOpCode: req.opCode } });
    console.log("getOperationbyOpCode", record);
    const resultModel: OperationModel[] = [];
    if (!record) {
      throw new ErrorResponse(55689, "Operations not Found")
    }
      const res = new OperationModel(record.iOpCode, record.eOpCode, record.opCategory, record.opForm, record.opName, 0, '',0,record.machineName);
      resultModel.push(res);
    
    return new OperationResponse(true, 85552, 'Operations Retrieved Successfully', resultModel);
  }

}