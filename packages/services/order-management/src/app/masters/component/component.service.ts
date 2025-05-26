import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");
import { ComponentRepository } from "./repository/component.repository";
import { CommonRequestAttrs, ComponentIdRequest, ComponentModel, ComponentRequest, ComponentResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { ComponentEntity } from "./entity/component.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ProductTypeComponentRepository } from "../product-type/repository/product-type-component.repository";

@Injectable()
export class ComponentService {
  constructor(
    private dataSource: DataSource,
    private componentRepo: ComponentRepository,
    private productComponets: ProductTypeComponentRepository
  ) {

  }
  async createComponent(reqModel: ComponentRequest): Promise<ComponentResponse> {
    console.log(reqModel);
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ComponentEntity[] = [];
      for (const comps of reqModel.components) {
        const records = await this.componentRepo.find({ where: { componentName: comps.compName } });
        const entity = new ComponentEntity();
        entity.componentName = comps.compName,
          entity.componentDesc = comps.compDesc,
          entity.companyCode = reqModel.companyCode,
          entity.createdUser = reqModel.username,
          entity.unitCode = reqModel.unitCode;
        if (comps.id) {
          entity.id = comps.id;
          entity.updatedUser = reqModel.username;
        }
        console.log(records);
        if (records.length === 0) {
          const saveData = await transManager.getRepository(ComponentEntity).save(entity);
        }
        else if (comps.id) {
          const saveData = await transManager.getRepository(ComponentEntity).save(entity);
        }
        else {
          throw new ErrorResponse(1001, "Data exits with same component")
        }

      }

      await transManager.completeTransaction();
      return new ComponentResponse(true, 1002, `${reqModel.components.some(c => c.id) ? "Component Updated" : "Component Created"} Successfully`, []);

    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteComponent(reqModel: ComponentIdRequest): Promise<GlobalResponseObject> {
    console.log(reqModel.id);
    if (reqModel.id) {
      const records = await this.componentRepo.find({ where: { id: reqModel.id } });
      const productTypeComps = await this.productComponets.find({ where: { componetId: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(965, "Data not Found")
      }
      else if (productTypeComps.length === 0) {
        const deleteProduct = await this.componentRepo.delete({ id: reqModel.id });
        return new GlobalResponseObject(true, 1004, 'Component Deleted Successfully');

      }
      else {
        throw new ErrorResponse(1005, "Cannot Delete. Components already mapped to Product")
      }
    }
    else {
      throw new ErrorResponse(1006, "Please give component Id")
    }
  }

  async getComponent(reqData: ComponentIdRequest): Promise<ComponentResponse> {
    const records = await this.componentRepo.find({ where: { id: reqData.id } });
    const resultData: ComponentModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ComponentModel('', '', '', 1, data.id, data.componentName, data.componentDesc);
        resultData.push(eachRow);
      })
      return new ComponentResponse(true, 967, 'Data Retrieved Successfully', resultData)
    }
  }



  async getAllComponents(reqData: CommonRequestAttrs): Promise<ComponentResponse> {
    const records = await this.componentRepo.find({ where: { unitCode: reqData.unitCode, companyCode: reqData.companyCode } });
    const resultData: ComponentModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new ComponentModel('', '', '', 1, data.id, data.componentName, data.componentDesc);
        resultData.push(eachRow);
      });
    }
    return new ComponentResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }
}