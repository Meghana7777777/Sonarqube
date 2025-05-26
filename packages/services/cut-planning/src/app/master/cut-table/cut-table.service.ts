import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");
import { CommonRequestAttrs, CutTableCreateRequest, CutTableIdRequest, CutTableModel, CutTableResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CutTableRepository } from "./repository/cut-table.repository";
import { CutTableEntity } from "./entity/cut-table.entity";
import { CutTableHelperService } from "./cut-table-helper.service";

@Injectable()
export class CutTableService {
  constructor(
    private dataSource: DataSource,
    private cutTableRepo: CutTableRepository,
    private cutTableHelperService: CutTableHelperService

  ) {

  }
  async createCutTable(reqModel: CutTableCreateRequest): Promise<CutTableResponse> {
    console.log(reqModel);
    const startspacces = /^\s/;
    const endspacces = /\s$/;
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: CutTableEntity[] = [];
      for (const cutTbls of reqModel.cutTables) {
        const records = await this.cutTableRepo.find({ where: { tableName: cutTbls.tableName } });
        const entity = new CutTableEntity();
        entity.tableName = cutTbls.tableName,
          entity.tableDesc = cutTbls.tableDesc,
          entity.capacity = cutTbls.capacity,
          entity.extRefCode = cutTbls.extRefCode,
          entity.companyCode = reqModel.companyCode,
          entity.createdUser = reqModel.username,
          entity.unitCode = reqModel.unitCode;
        if (cutTbls.id) {
          entity.id = cutTbls.id;
          entity.updatedUser = reqModel.username;
        }
        console.log(records);
        if (records.length === 0 && !startspacces.test(cutTbls.tableName) && !endspacces.test(cutTbls.tableName)) {
          const saveData = await transManager.getRepository(CutTableEntity).save(entity);
        }
        else if (cutTbls.id) {
          const saveData = await transManager.getRepository(CutTableEntity).save(entity);
        }
        else if (startspacces.test(cutTbls.tableName) || endspacces.test(cutTbls.tableName)) {
          throw new ErrorResponse(55689, "Spaces not allowed in starting and ending")
        }
        else {
          throw new ErrorResponse(55689, "Data exits with same CutTable")
        }

      }

      await transManager.completeTransaction();
      return new CutTableResponse(true, 85552, `CutTable  "Updated" : "Created"} Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteCutTable(reqModel: CutTableIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.cutTableId) {
      throw new ErrorResponse(55689, "Please give CutTable Id")
    }
    if (reqModel.cutTableId) {
      const records = await this.cutTableRepo.find({ where: { id: reqModel.cutTableId } });
      if (records.length === 0) {
        throw new ErrorResponse(55689, "CutTable Data not Found")
      }
      const activeAndInactiveDockets = await this.cutTableHelperService.getActiveInactiveDocketsForCutTable(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, reqModel.cutTableId);
      const docketsCount = (activeAndInactiveDockets.completedDockets + activeAndInactiveDockets.inActiveDockets + activeAndInactiveDockets.inProgressDockets);
      if (docketsCount > 0) {
        throw new ErrorResponse(0, 'Cut Table Already In Use.Cannot Be Deleted');
      }
      const deleteProduct = await this.cutTableRepo.delete({ id: reqModel.cutTableId });
      return new GlobalResponseObject(true, 85552, 'CutTable Deleted Successfully');
    }

  }

  async getCutTablebyId(reqData: CutTableIdRequest): Promise<CutTableResponse> {
    const records = await this.cutTableRepo.find({ where: { id: reqData.cutTableId } });
    const resultData: CutTableModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new CutTableModel(data.id, data.capacity, data.tableName, data.tableDesc, data.extRefCode);
        resultData.push(eachRow);
      })
      return new CutTableResponse(true, 85552, 'Data Retrievd Successfully', resultData)
    }
  }



  async getAllCutTables(reqData: CommonRequestAttrs): Promise<CutTableResponse> {
    const records = await this.cutTableRepo.find({ where: { unitCode: reqData.unitCode } });
    const resultData: CutTableModel[] = [];
    // if (records.length === 0) {
    //   throw new ErrorResponse(55689, "Data Not Found")
    // }
    records.forEach(data => {
      const eachRow = new CutTableModel(data.id, data.capacity, data.tableName, data.tableDesc, data.extRefCode);
      resultData.push(eachRow);
    });
    return new CutTableResponse(true, 85552, 'Data Retrievd Successfully', resultData)
  }


  async getCutTableRecordById(tableId: number, companyCode: string, unitCode: string): Promise<CutTableEntity> {
    return await this.cutTableRepo.findOne({ where: { id: tableId, companyCode: companyCode, unitCode: unitCode } });
  }
}