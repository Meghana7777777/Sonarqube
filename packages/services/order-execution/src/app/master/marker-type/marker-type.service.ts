import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import moment = require("moment");
import { MarkerTypeRepository } from "./repository/marker-type.repository";
import { GlobalResponseObject, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeModel, MarkerTypeResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { MarkerTypeEntity } from "./entity/marker-type.entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class MarkerTypService {
  constructor(
    private dataSource: DataSource,
    private markerTypRepo: MarkerTypeRepository,
  ) {

  }

  async createMarkerType(reqModel: MarkerTypeCreateRequest): Promise<MarkerTypeResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: MarkerTypeEntity[] = [];
      for (const markers of reqModel.markerTypes) {
        const records = await this.markerTypRepo.find({ where: { markerType: markers.markerType } });
        const entity = new MarkerTypeEntity();
        entity.markerType = markers.markerType,
          entity.markerDesc = markers.markerDesc,
          entity.companyCode = reqModel.companyCode,
          entity.createdUser = reqModel.username,
          entity.unitCode = reqModel.unitCode;
        if (markers.id) {
          entity.id = markers.id;
          entity.updatedUser = reqModel.username;
        }
        console.log(records);
        if (records.length === 0) {
          const saveData = await transManager.getRepository(MarkerTypeEntity).save(entity);
        }
        else if (markers.id) {
          const saveData = await transManager.getRepository(MarkerTypeEntity).save(entity);
        }
        else {
          throw new ErrorResponse(55689, "Data exits with same Marker")
        }

      }

      await transManager.completeTransaction();
      return new MarkerTypeResponse(true, 85552, `Markers  "Updated" : "Created"} Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }

  }

  async deleteMarkerType(reqModel: MarkerTypeIdRequest): Promise<GlobalResponseObject> {
    // if (!reqModel.markerTypeId) {
    //   throw new ErrorResponse(55689, "Please give Marker Id")
    // }
    if (reqModel.markerTypeId) {
      const records = await this.markerTypRepo.find({ where: { id: reqModel.markerTypeId } });
      if (records.length === 0) {
        throw new ErrorResponse(55689, "Marker type not found")
      }
      const deleteProduct = await this.markerTypRepo.delete({ id: reqModel.markerTypeId });
      return new GlobalResponseObject(true, 85552, 'Markers Deleted Successfully');
    }
  }

  async deActivateMarkerType(reqModel: MarkerTypeIdRequest): Promise<GlobalResponseObject> {
    const getRecord = await this.markerTypRepo.findOne({ where: { id: reqModel.markerTypeId } });

    const toggle = await this.markerTypRepo.update(
      { id: reqModel.markerTypeId },
      { isActive: getRecord.isActive == true ? false : true });
    return new GlobalResponseObject(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'Markers de-activated successfully' : 'Markers activated successfully');
  }

  async getAllMarkerTypes(reqData: MarkerTypeCreateRequest): Promise<MarkerTypeResponse> {
    const records = await this.markerTypRepo.find({ where: { unitCode: reqData.unitCode } });
    const resultData: MarkerTypeModel[] = [];
    // if (records.length === 0) {
    //   throw new ErrorResponse(55689, "Marker types not found")
    // }
    records.forEach(data => {
      const eachRow = new MarkerTypeModel(data.id, data.markerType, data.markerDesc, data.isActive);
      resultData.push(eachRow);
    });
    if (resultData) {
      return new MarkerTypeResponse(true, 85552, 'Markers Retrievd Successfully', resultData)
    } else {
      return new MarkerTypeResponse(false, 855520, 'Failed To Retrive', [])
    }
  }

  async getMarkerType(reqData: MarkerTypeIdRequest): Promise<MarkerTypeResponse> {
    const records = await this.markerTypRepo.find({ where: { id: reqData.markerTypeId } });
    const resultData: MarkerTypeModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Marker types not found")
    } else {
      records.forEach(data => {
        const eachRow = new MarkerTypeModel(data.id, data.markerType, data.markerDesc);
        resultData.push(eachRow);
      })
      return new MarkerTypeResponse(true, 85552, 'Data Retrievd Successfully', resultData)
    }
  }


  async getMarkerRecordTypeByMarkerTypeId(makretTypeId: number, companyCode: string, unitCode: string): Promise<MarkerTypeEntity> {
    return await this.markerTypRepo.findOne({ where: { id: makretTypeId, companyCode: companyCode, unitCode: unitCode } });
  }

}