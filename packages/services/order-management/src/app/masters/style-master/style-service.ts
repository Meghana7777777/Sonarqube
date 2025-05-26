import { Injectable } from "@nestjs/common";
import { Code, DataSource } from "typeorm";
import { StyleRepository } from "./repository/style-repository";
import { CommonResponse, StyleCreateRequest, StyleIdRequest, StyleModel, StyleResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { StyleEntity } from "./entity/style-entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class StyleService {
  constructor(
    private dataSource: DataSource,
    private styleRepo: StyleRepository,
  ) { }

  async createStyle(reqModel: StyleCreateRequest): Promise<StyleResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: StyleEntity[] = [];
      let isUpdate = false; 
      for (const style of reqModel.style) {
        const existingRecords =await transManager.getRepository(StyleEntity).find({
          where: [
            { styleCode: style.styleCode },
          ]
        });

        if (existingRecords.length > 0 && !style.id) {
          throw new ErrorResponse(55689, "Style Code already exists");
        }
        const entity = new StyleEntity();
        entity.id = style.id;
        entity.styleName = style.styleName;
        entity.styleCode = style.styleCode;
        entity.description = style.description;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        entity.processType = style.processType;
        if (style.id) {
          entity.updatedUser = reqModel.username;
          isUpdate = true;
        } else {
          entity.createdUser = reqModel.username;
        }

        const savedEntity = await transManager.getRepository(StyleEntity).save(entity);
        resultEntity.push(savedEntity);        
      }

      await transManager.completeTransaction();
      const message = isUpdate ? "Updated" : "Created";
      return new StyleResponse(true, 85552, `Style ${message} Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteStyle(reqModel: StyleIdRequest): Promise<StyleResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please provide style ID");
    }
    const records = await this.styleRepo.find({ where: {companyCode:reqModel.companyCode,unitCode:reqModel.unitCode,id:reqModel.id}});
    if (records.length === 0) {
      throw new ErrorResponse(55689, "No records found");
    }
    await this.styleRepo.delete(reqModel.id);
    return new StyleResponse(true, 85552, "Style Deleted Successfully");
  }
  
  async getAllStyles(reqData: StyleIdRequest): Promise<StyleResponse> {
    try {
      const records = await this.styleRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode } });
      const resultData: StyleModel[] = records.map(data => {
        return new StyleModel(data.id, data.styleName,data.styleCode,data.description,data.processType,data.imageName,data.imagePath,data.isActive );
      });
      return new StyleResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(56465, error.message);
    }
  }
  

  async activateDeactivateStyle(reqModel: StyleIdRequest): Promise<StyleResponse> {
    const getRecord = await this.styleRepo.findOne({ where: { companyCode: reqModel.companyCode,unitCode:reqModel.unitCode,id: reqModel.id}});
    
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive; 
    await this.styleRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new StyleResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Style Activated Successfully" : "Style Deactivated Successfully"
    );
  }

  async styleUpdateImage(files: any, id: number): Promise<CommonResponse> {
    try {
      const updateData: any = {};
      if (files && files.length > 0) {
        updateData.imageName = files[0].filename;
        updateData.imagePath = files[0].path;
      } else {
        updateData.imageName = null;
        updateData.imagePath = null;
      }
      const filePathUpdate = await this.styleRepo.update(
        { id: id },
        updateData
      );
      if (filePathUpdate.affected > 0) {
        return new  CommonResponse(true, 11, "Image Uploaded Successfully", filePathUpdate);
      } else {
        return new  CommonResponse(false, 11, "Image Upload Failed", filePathUpdate);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStyleByStyleCode(reqData: StyleIdRequest): Promise<StyleResponse> {
    try {
      const records = await this.styleRepo.find({ where: { companyCode:reqData.companyCode,unitCode:reqData.unitCode,styleCode: reqData.styleCode } });
      if (records.length === 0) {
        throw new ErrorResponse(404, "No Data Found for the given Style Code");
      }
      const resultData: StyleModel[] = records.map(data => {
        return new StyleModel( data.id, data.styleName, data.styleCode, data.description, data.processType, data.imageName, data.imagePath, data.isActive );
      });
  
      return new StyleResponse(true, 200, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  
  
}