import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CommonResponse, ProductsCreateRequest, ProductsResponse, ProductsIdRequest, ProductsModel } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ProductsRepository } from "./repository/product-repository";
import { ProductsEntity } from "./entity/product-entity";

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    private productRepo: ProductsRepository,
  ) { }

  async createProduct(reqModel: ProductsCreateRequest): Promise<ProductsResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ProductsEntity[] = [];
      let isUpdate = false; 
      for (const product of reqModel.product) {
        const existingRecords =await transManager.getRepository(ProductsEntity).find({
          where: [
            { productCode: product.productCode },
          ]
        });

        if (existingRecords.length > 0 && !product.id) {
          throw new ErrorResponse(55689, "product code already exists");
        }
        const entity = new ProductsEntity();
        entity.id = product.id;
        entity.productName = product.productName;
        entity.productCode = product.productCode;
        entity.description = product.description;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        if (product.id) {
          entity.updatedUser = reqModel.username;
          isUpdate = true;
        } else {
          entity.createdUser = reqModel.username;
        }

        const savedEntity = await transManager.getRepository(ProductsEntity).save(entity);
        resultEntity.push(savedEntity);        
      }

      await transManager.completeTransaction();
      const message = isUpdate ? "Updated" : "Created";
      return new ProductsResponse(true, 85552, `Product ${message} Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteProduct(reqModel: ProductsIdRequest): Promise<ProductsResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please provide product ID");
    }
    const records = await this.productRepo.find({ where: { companyCode:reqModel.companyCode,unitCode:reqModel.unitCode,id: reqModel.id } });
    if (records.length === 0) {
      throw new ErrorResponse(55689, "No records found");
    }
    await this.productRepo.delete(reqModel.id);
    return new ProductsResponse(true, 85552, "Product Deleted Successfully");
  }

  async getAllProducts(reqData: ProductsIdRequest): Promise<ProductsResponse> {
    try {
      const records = await this.productRepo.find({ where: { companyCode:reqData.companyCode,unitCode:reqData.unitCode } });
      const resultData: ProductsModel[] = records.map(data => {
        return new ProductsModel(data.id,data.productName, data.productCode, data.description, data.imageName, data.imagePath, data.isActive);
      });
      return new ProductsResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  async activateDeactivateProduct(reqModel: ProductsIdRequest): Promise<ProductsResponse> {
    const getRecord = await this.productRepo.findOne({ where: { companyCode: reqModel.companyCode,unitCode:reqModel.unitCode,id: reqModel.id } });

    if (!getRecord) {
        throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive; 
    await this.productRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new ProductsResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Product Activated Successfully" : "Product Deactivated Successfully"
    );
}

  async updateProductImage(files: any, id: number): Promise<CommonResponse> {
    try {
      const updateData: any = {};
      if (files && files.length > 0) {
        updateData.imageName = files[0].filename;
        updateData.imagePath = files[0].path;
      } else {
        updateData.imageName = null;
        updateData.imagePath = null;
      }
      const filePathUpdate = await this.productRepo.update(
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

  async getProductByProductCode(reqData: ProductsIdRequest): Promise<ProductsResponse> {
    try {
      const records = await this.productRepo.find({ where: { companyCode:reqData.companyCode,unitCode:reqData.unitCode,productCode: reqData.productCode}});
      if (records.length === 0) {
        throw new ErrorResponse(404, "No Data Found for the given product Code");
      }
      const resultData: ProductsModel[] = records.map(data => {
        return new ProductsModel(data.id,data.productName, data.productCode, data.description, data.imageName, data.imagePath, data.isActive);
      });
      return new ProductsResponse(true, 200, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }
}