import { Injectable } from '@nestjs/common';
import { DataSource, Not } from 'typeorm';
import { ModuleRepository } from './repo/module-repo';
import { ModuleDto } from './dto/module-dto';
import { AllModulesModelForJobPriority, AllModulesResponseForJobPriority, CommonRequestAttrs, GetModuleDetailsByModuleCodeModel, GetModuleDetailsByModuleCodeResponse, GlobalResponseObject, IModuleIdRequest, ModuleCreateRequest, ModuleIdRequest, ModuleModel, ModuleResponse, ModuleSectionRequest, SewingIJobNoRequest, TrimsIssuedJobModel, TrimsissuedModuleModel } from '@xpparel/shared-models';
import { SectionIdRequest, SectionModulesResponse } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../../database/typeorm-transactions/generic-transaction-manager';
import { ModuleEntity } from './module.entity';
import { ErrorResponse } from '@xpparel/backend-utils';

@Injectable()
export class ModuleService {
  constructor(
    private dataSource: DataSource,
    private moduleRepo: ModuleRepository,

  ) {

  }

  async getModulesBySectionCode(reqModel: ModuleSectionRequest): Promise<ModuleResponse> {
    try {
      const secCode = reqModel.sectionCode;
      const unitCode = reqModel.unitCode;
      const companyCode = reqModel.companyCode

      const records = await this.moduleRepo.find({
        where: {
          secCode: secCode,
          unitCode: unitCode,
          companyCode: companyCode
        },
      });

      if (records.length === 0) {
        throw new ErrorResponse(26008, "No Modules Found for the Given Section Code");
      }

      const resultData: ModuleModel[] = records.map(data => {
        return new ModuleModel(data.id, data.moduleCode, data.moduleName, data.moduleDesc, data.moduleType, data.moduleExtRef, data.moduleCapacity, data.maxInputJobs, data.maxDisplayJobs, data.moduleHeadName, data.moduleHeadCount, data.moduleOrder, data.moduleColor, data.secCode, data.isActive);
      });
      return new ModuleResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      console.error("Error in getModulesBySectionId:", error);
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(968,"Internal Server Error");
    }
  }

  async createModule(reqModel: ModuleCreateRequest): Promise<ModuleResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ModuleEntity[] = [];

      for (const module of reqModel.modules) {
        const records = await this.moduleRepo.find({ where: { moduleCode: module.moduleCode } });
        if (records.length > 0 && !module.id) {
          throw new ErrorResponse(925, "Module Already exists");
        }
        const entity = new ModuleEntity();

        entity.moduleCode = module.moduleCode;
        entity.moduleName = module.moduleName;
        entity.moduleDesc = module.moduleDesc;
        // entity.moduleType = module.moduleType;
        entity.moduleCapacity = module.moduleCapacity;
        entity.maxInputJobs = module.maxInputJobs;
        entity.maxDisplayJobs = module.maxDisplayJobs;
        entity.moduleHeadName = module.moduleHeadName;
        entity.moduleHeadCount = module.moduleHeadCount;
        entity.moduleOrder = module.moduleOrder;
        entity.moduleColor = module.moduleColor;
        entity.secCode = module.secCode;
        entity.companyCode = reqModel.companyCode;
        entity.createdUser = reqModel.username;
        entity.unitCode = reqModel.unitCode;
        entity.moduleExtRef = module.moduleExtRef;
        if (module.id) {
          entity.id = module.id;
          entity.updatedUser = reqModel.username;
        }

        if (records.length === 0) {
          const saveData = await transManager.getRepository(ModuleEntity).save(entity);
        } else if (module.id) {
          const saveData = await transManager.getRepository(ModuleEntity).save(entity);
        } else {
          throw new ErrorResponse(26010, "Data exists w3ith same component");
        }
      }

      await transManager.completeTransaction();
      return new ModuleResponse(true, 85552, `Section "Updated" : "Created" Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


  async deleteModule(reqModel: ModuleIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(26012, "Please give Module Id")
    }
    if (reqModel.id) {
      const records = await this.moduleRepo.find({ where: { id: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(26013, "Module Data not Found")
      }
      const deleteProduct = await this.moduleRepo.delete({ id: reqModel.id });
      return new GlobalResponseObject(true, 26014, ' Module Deleted Successfully');
    }

  }

  async getModule(reqData: ModuleIdRequest): Promise<ModuleResponse> {
    try {

      const records = await this.moduleRepo.find();

      // if (records.length === 0) {
      //   throw new ErrorResponse(924, "No Data Found");
      // }
      const resultData: ModuleModel[] = records.map(data => {
        return new ModuleModel(data.id, data.moduleCode, data.moduleName, data.moduleDesc, data.moduleType,
          data.moduleExtRef, data.moduleCapacity, data.maxInputJobs, data.maxDisplayJobs, data.moduleHeadName, data.moduleHeadCount,
          data.moduleOrder, data.moduleColor, data.secCode, data.isActive);
      });
      return new ModuleResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      console.error("Error in getSelection:", error);
      if (error instanceof ErrorResponse) {
        throw error; // Custom error
      }
      throw new ErrorResponse(968,"Internal Server Error");
    }
  }



  //   async updateModule(req: ModuleDto): Promise<ModuleResponse> {
  //     const module = await this.moduleRepo.findOne({ where: { id: req.id } });

  //     if (!module) {
  //         return new ModuleResponse(false, 924, "No Data Found", req.id);
  //     }

  //     const duplicate = await this.moduleRepo.findOne({
  //         where: { moduleCode: req.moduleCode, id: Not(req.id) }
  //     });

  //     if (duplicate) {
  //         return new ModuleResponse(false, 6542, "Module code already exists", req.id);
  //     }

  //     await this.moduleRepo.update(req.id, req);
  //     return new ModuleResponse(true, 65152, "Updated Successfully", req.id);
  // }

  async activateDeactivateModule(reqModel: ModuleIdRequest): Promise<ModuleResponse> {
    const getRecord = await this.moduleRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.moduleRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new ModuleResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Module Activated Successfully" : "Module Deactivated Successfully"
    );
  }

  async getAllModulesDataBySectionCode(req: SectionIdRequest): Promise<SectionModulesResponse> {
    try {
      const modules = await this.moduleRepo.getModulesBySectionCode(req.secCode, req.companyCode, req.unitCode);
      if (modules.length === 0) {
        return new SectionModulesResponse(false, 26017, `No modules found for section code: ${req.secCode}`, []);
      }

      return new SectionModulesResponse(true, 26018, "Modules fetched successfully", modules);
    } catch (error) {
      return new SectionModulesResponse(false, 26019, `Failed to fetch modules: ${error.message}`, []);
    }

  }

  async getModuleDataByModuleCode(req: IModuleIdRequest): Promise<GetModuleDetailsByModuleCodeResponse> {
    const { moduleCode } = req;

    // Validate the input
    if (!moduleCode) {
      return new GetModuleDetailsByModuleCodeResponse(false, 26020, 'Module Code is required', null);
    }

    try {
      const moduleData = await this.moduleRepo.getAllModuleDataByModuleCode(moduleCode);

      if (!moduleData) {
        return new GetModuleDetailsByModuleCodeResponse(false, 26021, 'No data found for the provided module code', null);
      }

      const data = new GetModuleDetailsByModuleCodeModel(
        moduleCode,
        moduleData.moduleName,
        moduleData.moduleHeadName,
        moduleData.secCode
      );

      return new GetModuleDetailsByModuleCodeResponse(true, 969, 'Data fetched successfully', data);
    } catch (error) {
      console.error('Error fetching module data:', error.message);
      return new GetModuleDetailsByModuleCodeResponse(false, 968, 'Internal server error', null);
    }
  }

  async getAllModulesForJobPriority( req: CommonRequestAttrs ): Promise<AllModulesResponseForJobPriority> {
    try {
      const moduleData = await this.moduleRepo.getAllModulesForJobPriority( req.unitCode, req.companyCode );

      if (!moduleData || moduleData.length === 0) {
        return new AllModulesResponseForJobPriority( false, 404, 'No data found for the provided module code', [] );
      }

      const data: AllModulesModelForJobPriority[] = moduleData.map(
        (module) => new AllModulesModelForJobPriority(module.moduleCode, module.moduleName),
      );

      return new AllModulesResponseForJobPriority( true, 200, 'Data fetched successfully', data );
    } catch (error) {
      console.error('Error fetching modules:', error);
      return new AllModulesResponseForJobPriority( false, 500, 'Internal server error', [] );
    }
  }


}


