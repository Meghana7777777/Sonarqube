import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");
import { ProductTypeRepository } from "./repository/product-type.repository";
import { CommonRequestAttrs, GlobalResponseObject, ProductTypeCompModel, ProductTypeIdRequest, ProductTypeModel, ProductTypeRequest, ProductTypeResponse } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ProductTypeEntity } from "./entity/product-type.entity";
import { ProductTypeComponentEntity } from "./entity/product-type-component.entity";
import { ProductTypeComponentRepository } from "./repository/product-type-component.repository";
import { ComponentRepository } from "../component/repository/component.repository";
import { ProductTypeHelperService } from "./product-type-helper.service";

@Injectable()
export class ProductTypeService {
  constructor(
    private dataSource: DataSource,
    private productTypeRepo: ProductTypeRepository,
    private productTypeCompRepo: ProductTypeComponentRepository,
    private componentRepo: ComponentRepository,
    private productTypeHelperService: ProductTypeHelperService
  ) {

  }

  async createProductType(reqModel: ProductTypeRequest): Promise<ProductTypeResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ProductTypeEntity[] = [];
      for (const prodType of reqModel.productTypes) {
        let existingRecord = null;
        // if prod type eixst then delete it. This operation will be triggered only during the update operation. Because id will be sent only during update
        if (prodType.id) {
          existingRecord = await this.productTypeRepo.findOne({ where: { id: prodType.id } });
          if (existingRecord) {
            await transManager.getRepository(ProductTypeEntity).delete({ id: prodType.id });
          }
        }
        const entity = new ProductTypeEntity();
        entity.productType = prodType.productType;
        entity.productDesc = prodType.desc;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        entity.createdUser = reqModel.username;
        const savedProdType = await transManager.getRepository(ProductTypeEntity).save(entity);

        // delete all the components mapping for the prod type
        if (existingRecord) {
          await transManager.getRepository(ProductTypeComponentEntity).delete({ productTypeId: existingRecord?.id });
        }
        if (prodType.components) {
          // get the component ids for the components 
          const compsArray = prodType.components.map(comp => comp.compName);
          const compsInfo = await this.componentRepo.find({ where: { componentName: In(compsArray) } });
          const compIdMap = new Map<string, number>();
          compsInfo.forEach(r => compIdMap.set(r.componentName, r.id));
          const prodTypeComps: ProductTypeComponentEntity[] = [];
          for (const comp of prodType.components) {
            const prodTypeCompEnt = new ProductTypeComponentEntity();
            prodTypeCompEnt.componetName = comp.compName;
            prodTypeCompEnt.componetId = compIdMap.get(comp.compName);
            if (!prodTypeCompEnt.componetId) {
              throw new ErrorResponse(1011, 'Selected component does not exist : ' + comp.compName);
            }
            prodTypeCompEnt.productType = prodType.productType;
            prodTypeCompEnt.productTypeId = savedProdType.id;
            prodTypeCompEnt.companyCode = reqModel.companyCode;
            prodTypeCompEnt.unitCode = reqModel.unitCode;
            prodTypeCompEnt.createdUser = reqModel.username;
            prodTypeComps.push(prodTypeCompEnt);
          }
          await transManager.getRepository(ProductTypeComponentEntity).save(prodTypeComps, { reload: false })
        }
      }
      await transManager.completeTransaction();
      return new ProductTypeResponse(true, 1012, `Product Type  "Updated" : "Created" Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteProductType(reqModel: ProductTypeIdRequest): Promise<GlobalResponseObject> {

    if (reqModel.productTypeId) {
      const records = await this.productTypeRepo.find({ where: { id: reqModel.productTypeId } });
      if (records.length === 0) {
        throw new ErrorResponse(965, "Data not Found")
      }
      // const productTypeExists = await this.productTypeHelperService.checkProductTypeAlreadyUsedInExternalModule(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, reqModel.prodTypeCode);
      
      // if (productTypeExists) {
      //   throw new ErrorResponse(1014, "Cannot Delete Product Type already in use")
      // }

      const deleteProduct = await this.productTypeRepo.delete({ id: reqModel.productTypeId });
      const deleteProductTypeComps = await this.productTypeCompRepo.delete({ productTypeId: reqModel.productTypeId });
      return new GlobalResponseObject(true, 1015, 'Product Type Deleted Successfully');

    }
    else {
      throw new ErrorResponse(1016, "Please give Product Type Id")
    }
  }

  async getProductType(reqData: ProductTypeIdRequest): Promise<ProductTypeResponse> {
    const records = await this.productTypeRepo.find({ where: { id: reqData.productTypeId } });
    const resultData: ProductTypeModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ProductTypeModel('', '', '', 1, data.id, data.productType, data.productType, 'refno', data.productDesc, []);
        resultData.push(eachRow);
      })
      return new ProductTypeResponse(true, 967, 'Data Retrieved Successfully', resultData)
    }
  }

  async getAllProductTypess(reqData: CommonRequestAttrs): Promise<ProductTypeResponse> {
    const records = await this.productTypeRepo.find({ where: { unitCode: reqData.unitCode } });
    const resultData: ProductTypeModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ProductTypeModel('', '', '', 1, data.id, data.productType, data.productType, 'refno', data.productDesc, []);
        resultData.push(eachRow);
      });
    }
    return new ProductTypeResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }
  async getAllProductTypes(reqData: CommonRequestAttrs): Promise<ProductTypeResponse> {
    const records = await this.productTypeRepo.find({ where: { unitCode: reqData.unitCode } });
    const resultData: ProductTypeModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      for (const comps of records) {
        const prodComps = await this.productTypeCompRepo.find({ where: { productTypeId: comps.id } });
        const componentmodel: ProductTypeCompModel[] = [];
        prodComps.forEach(p => {
          componentmodel.push(new ProductTypeCompModel(p.componetName));
        })
        const eachRow = new ProductTypeModel(reqData.username, reqData.unitCode, reqData.companyCode, reqData.userId, comps.id, comps.productType, comps.productType, 'refno', comps.productDesc, componentmodel);
        resultData.push(eachRow);
      }
    }
    return new ProductTypeResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

  async mapCompsToProductType(reqModel: ProductTypeRequest): Promise<ProductTypeResponse> {
    console.log('hiiiii', reqModel.productTypes);
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ProductTypeEntity[] = [];
      const resultCompoEntity: ProductTypeComponentEntity[] = [];
      for (const products of reqModel.productTypes) {
        const entity = new ProductTypeEntity();
        entity.productType = products.productType,
          entity.productDesc = products.desc,
          entity.companyCode = reqModel.companyCode,
          entity.unitCode = reqModel.unitCode,
          entity.createdUser = reqModel.username
        const records = await this.productTypeRepo.find({ where: { id: products.id } });
        const productTypeExists = await this.productTypeRepo.find({ where: { productType: products.productType } });
        if (products.id) {
          entity.id = products.id;
          entity.updatedUser = reqModel.username;
        }
        if (records.length) {
          const deleteComponents = await this.productTypeCompRepo.delete({ productTypeId: products.id });
        }
        if (productTypeExists.length === 0 || products.id) {
          const saveData = await transManager.getRepository(ProductTypeEntity).save(entity);
          for (const comp of products.components) {
            const compentity = new ProductTypeComponentEntity();
            compentity.productType = products.productType,
              compentity.productTypeId = saveData.id,
              compentity.companyCode = reqModel.companyCode,
              compentity.createdUser = reqModel.username,
              compentity.unitCode = reqModel.unitCode,
              compentity.componetName = comp.compName;
            const records = await this.componentRepo.findOne({ where: { componentName: comp.compName } });
            compentity.componetId = records.id;
            const saveCompData = await transManager.getRepository(ProductTypeComponentEntity).save(compentity);
          }
        }
        else {
          throw new ErrorResponse(1023, "Data exists with the same product type")
        }
      }
      await transManager.completeTransaction();
      return new ProductTypeResponse(true, 1024, `Product Type  "Updated" : "Created"} Successfully`, []);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
}