import { Injectable } from "@nestjs/common"; import { DataSource, In, Not } from "typeorm";
import { GlobalResponseObject, WorkstationCreateRequest, WorkstationIdRequest, WorkstationModel, WorkstationModuleRequest, WorkstationResponse } from "@xpparel/shared-models";
import { ModuleIdRequest,  } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { WorkstationRepository } from "./workstation.repository";
import { GenericTransactionManager } from "../../../database/typeorm-transactions/generic-transaction-manager";
import { WorkstationEntity } from "./workstation.entity";
import { WorkstationDto } from "./DTO/workstation.dto";

@Injectable()
export class WorkstationService {
  constructor(
    private dataSource: DataSource,
    private WorkstationRepo: WorkstationRepository,

  ) {

  }

  async createWorkstation (reqModel: WorkstationCreateRequest): Promise<WorkstationResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
        await transManager.startTransaction();
        const resultEntity: WorkstationEntity[] = [];
        
        for (const workstations of reqModel.workstations) {

             const records = await this.WorkstationRepo.find({where: { wsCode: workstations.wsCode}});
             if (records.length > 0 && !workstations.id) {
              throw new ErrorResponse(26146, "WorkStation Already exists");
          }
            const entity = new WorkstationEntity();
            
            entity.wsCode = workstations.wsCode;
            entity.wsName = workstations.wsName;
            entity.wsDesc = workstations.wsDesc;
            entity.moduleCode = workstations.moduleCode;
        
            entity.companyCode = reqModel.companyCode;
            entity.createdUser = reqModel.username;
            entity.unitCode = reqModel.unitCode;
            if (workstations.id) {
                entity.id = workstations.id;
                entity.updatedUser = reqModel.username;
            }

            if (records.length === 0) {
              const saveData = await transManager.getRepository(WorkstationEntity).save(entity);
            } else if (workstations.id) {
              const saveData = await transManager.getRepository(WorkstationEntity).save(entity);
            } else {
              throw new ErrorResponse(26110, "Data exists with same component");
            }
          }
      
          await transManager.completeTransaction();
          return new WorkstationResponse(true, 26111, `Workstation "Updated" : "Created" Successfully`, resultEntity);
        } catch (error) {
          await transManager.releaseTransaction();
          throw error;
        }
      }

  
  async deleteWorkstation(reqModel: WorkstationIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(26112, "Please give workstation Id")
    }
    if (reqModel.id) {
      const records = await this.WorkstationRepo.find({ where: { id: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(26113, "workstation Data not Found")
      }
      const deleteWorkstation = await this.WorkstationRepo.delete({ id: reqModel.id });
      return new GlobalResponseObject(true, 26114, 'workstation Deleted Successfully');
    }

  }

  async getWorkstation(reqData: WorkstationIdRequest): Promise<WorkstationResponse> {
    try {
      
      const records = await this.WorkstationRepo.find();
  
  
      // if (records.length === 0) {
      //   throw new ErrorResponse(924, "No Data Found");
      // }
      const resultData: WorkstationModel[] = records.map(data => {
        return new WorkstationModel(data.id,data.wsCode,data.wsName, data.wsDesc, data.moduleCode, data.isActive );
      });
      return new WorkstationResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error; 
      }
      throw new ErrorResponse(968, "Internal Server Error");
    }
  }

 

//     async updateWorkstation(req: WorkstationDto): Promise<WorkstationResponse> {
//         const workstation = await this.WorkstationRepo.findOne({ where: { id: req.id } });
//       if (!workstation) {
//         return new WorkstationResponse(false, 924, "No Data Found", req.id);
//       }
//       const duplicate = await this.WorkstationRepo.findOne({
//          where: { wsCode: req.wsCode, id: Not(req.id) }
//       });
//       if (duplicate) {
//         return new WorkstationResponse(false, 6542, "Workstation code already exists", req.id);
//       }
//        await this.WorkstationRepo.update({ id: req.id }, { ...req, id: req.id });
//        return new WorkstationResponse(true, 65152, "Updated Successfully", req.id);
// }

  
  async getAllWorkStationsByModuleCode(req: ModuleIdRequest): Promise<WorkstationResponse> {
    try {
      const modules = await this.WorkstationRepo.getWorkStationsByModuleCode(req.moduleCode, req.unitCode, req.companyCode);
      if (modules.length === 0) {
        return new WorkstationResponse( false, 26115, `No Work stations found for section code: ${req.moduleCode}`, [] );
      }

      return new WorkstationResponse( true, 26116, "Work Stations fetched successfully", modules );
    } catch (error) {
      return new WorkstationResponse( false, 26117, `Failed to fetch Work Stations: ${error.message}`, [] );
    }
  }
  

  async activateDeactivateWorkStation(reqModel: WorkstationDto): Promise<WorkstationResponse> {
    const getRecord = await this.WorkstationRepo.findOne({ where: { id: reqModel.id } });
    const toggle = await this.WorkstationRepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new WorkstationResponse(true, getRecord.isActive ? 26134 : 26118, getRecord.isActive ? 'workstation de-activated successfully' : 'workstation activated successfully');

  }
  
  async WorkstationOperationTypeDropDown(req: any): Promise<WorkstationResponse> {
    const getRecord = await this.WorkstationRepo.findOne({ where: { id: req.id } });

    const data = await this.WorkstationRepo.find({ select: ['id', 'wsCode', 'wsName'], });
    if (data.length) {
      return new WorkstationResponse(true, 967, "Data Retrieved Successfully", data)
    } else {
      return new WorkstationResponse(false, 965, 'Data Not Found')
    }
  }


  async getWorkstationsByModuleCode(reqModel: WorkstationModuleRequest): Promise<WorkstationResponse> {
    try {
      const { moduleCode,unitCode,companyCode } = reqModel;
  
      const records = await this.WorkstationRepo.find({
        where: { moduleCode: moduleCode,unitCode:unitCode,companyCode:companyCode }, 
      });
  
      if (records.length === 0) {
        return new WorkstationResponse(false, 26119, 'No Workstations found for the provided Module Code');
      }
  
      const resultData: WorkstationModel[] = records.map(data => {
        return new WorkstationModel(
          data.id,
          data.wsCode,
          data.wsName,
          data.wsDesc,
          data.moduleCode,
          data.isActive
        );
      });
  
      return new WorkstationResponse(true, 967, 'Data Retrieved Successfully', resultData);
    } catch (error) {
      console.error("Error in getWorkstationsModuleCode:", error);
      return new WorkstationResponse(false, 968, 'Internal Server Error');
    }
  }
  
}