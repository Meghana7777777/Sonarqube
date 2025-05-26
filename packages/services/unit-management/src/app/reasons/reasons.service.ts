import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, ReasonCategoryRequest, ReasonCreateRequest, ReasonIdRequest, ReasonModel, ReasonResponse } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ReasonsEntity } from "./entity/reasons.entity";
import { ReasonsRepository } from "./repository/reasons.repository";
//import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import moment = require("moment");

@Injectable()
export class ReasonService {
  constructor(
    private dataSource: DataSource,
    private reasonRepo: ReasonsRepository,

  ) {

  }

  async createReason(reqModel: ReasonCreateRequest): Promise<ReasonResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      for (const reasons of reqModel.reasons) {
        const records = await this.reasonRepo.find({ where: { reasonCode: reasons.reasonCode, reasonCategory: reasons.reasonCategory } });
        const entity = new ReasonsEntity();
        entity.reasonName = reasons.reasonName,
          entity.reasonCode = reasons.reasonCode,
          entity.reasonDesc = reasons.reasonDesc,
          entity.reasonCategory = reasons.reasonCategory,
          entity.companyCode = reqModel.companyCode,
          entity.createdUser = reqModel.username,
          entity.unitCode = reqModel.unitCode;
        if (reasons.id) {
          entity.id = reasons.id;
          entity.updatedUser = reqModel.username;
        }
        console.log(records);
        if (records.length === 0 || reasons.id) {
          const saveData = await transManager.getRepository(ReasonsEntity).save(entity);
        }
        else {
          throw new ErrorResponse(55689, "Data exits with same reason and category")
        }

      }

      await transManager.completeTransaction();
      return new ReasonResponse(true, 85552, `Reason  "Updated" : "Created"} Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteReason(reqModel: ReasonIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.reasonId) {
      throw new ErrorResponse(55689, "Please give Reason Id")
    }
    if (reqModel.reasonId) {
      const records = await this.reasonRepo.find({ where: { id: reqModel.reasonId } });
      if (records.length === 0) {
        throw new ErrorResponse(55689, "Reason Data not Found")
      }
      const deleteProduct = await this.reasonRepo.delete({ id: reqModel.reasonId });
      return new GlobalResponseObject(true, 85552, 'Reason Deleted Successfully');
    }

  }

  async getReasonbyId(reqData: ReasonIdRequest): Promise<ReasonResponse> {
    const records = await this.reasonRepo.find({ where: { id: reqData.reasonId } });
    const resultData: ReasonModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ReasonModel(data.id, data.reasonCode, data.reasonName, data.reasonDesc, data.reasonCategory);
        resultData.push(eachRow);
      })
      return new ReasonResponse(true, 967, 'Data Retrieved Successfully', resultData)
    }
  }

  async getReasonsByCategory(req: ReasonCategoryRequest): Promise<ReasonResponse> {
    const records = await this.reasonRepo.find({ where: { reasonCategory: req.reasonCategory, companyCode: req.companyCode, unitCode: req.unitCode, isActive: true } });
    const resultData: ReasonModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ReasonModel(data.id, data.reasonCode, data.reasonName, data.reasonDesc, data.reasonCategory);
        resultData.push(eachRow);
      })
      return new ReasonResponse(true, 967, 'Data Retrieved Successfully', resultData)
    }
  }



  async getAllReasons(reqData: CommonRequestAttrs): Promise<ReasonResponse> {
    const records = await this.reasonRepo.find({ where: { unitCode: reqData.unitCode } });
    const resultData: ReasonModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    }
    records.forEach(data => {
      const eachRow = new ReasonModel(data.id, data.reasonCode, data.reasonName, data.reasonDesc, data.reasonCategory);
      resultData.push(eachRow);
    });
    return new ReasonResponse(true, 967, 'Reasons Data Retrieved Successfully', resultData)
  }

  async getAllActiveReasons(): Promise<CommonResponse> {
    try {
      const query = await this.reasonRepo.getAllActiveReasons()
      if (query) {
        return new CommonResponse(true, 1, "Data Retrived", query)
      } else {
        return new CommonResponse(false, 0, "No Data Found")
      }
    } catch (err) {
      console.log(err);
    }
  }


}