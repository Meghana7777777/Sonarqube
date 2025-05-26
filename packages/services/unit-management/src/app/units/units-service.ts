import { Injectable } from "@nestjs/common";
import { UnitsRepository } from "./REPO/units-repo";
import { DataSource } from "typeorm";
import { UnitsDto } from "./DTO/units-dto";
import { GlobalResponseObject, UnitsCreateRequest, UnitsIdRequest, UnitsModel, UnitsResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions/generic-transaction-manager";
import { UnitsEntity } from "./units-entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class UnitsService {
  constructor(
    private dataSource: DataSource,
    private unitsRepo: UnitsRepository,

  ) { 

  }
    

  async createUnits(reqModel: UnitsCreateRequest): Promise<UnitsResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
      try{
        await transManager.startTransaction();
        const resultEntity: UnitsEntity[] = [];

       
      for (const unit of reqModel.units) {
				const records = await this.unitsRepo.find({ where: { code: unit.code} });
				if (records.length > 0 && !unit.id) {
					throw new ErrorResponse(925, "Already exists");
				}

        const entity = new UnitsEntity();
          entity.unitName = unit.unitName,
          entity.code = unit.code,
          entity.companysCode = unit.companysCode,
          entity.location = unit.location,
          entity.address = unit.address;
          entity.companyCode = reqModel.companyCode,
          entity.unitCode = reqModel.unitCode;
          entity.createdUser = reqModel.username;
          entity.latitude = unit.latitude;
          entity.longitude = unit.longitude;
        if (unit.id) {
            entity.id = unit.id;
            entity.updatedUser = reqModel.username;
        }
              
        if (records.length === 0) {
          const saveData = await transManager.getRepository(UnitsEntity).save(entity);
        } else if (unit.id) {
          const saveData = await transManager.getRepository(UnitsEntity).save(entity);
        } else {
          throw new ErrorResponse(55689, "Data exists with same component");
        }
      }
  
      await transManager.completeTransaction();
      return new UnitsResponse(true, 85552, `unit "Updated" : "Created" Successfully`,resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }


    
  async deleteUnits(reqModel: UnitsIdRequest): Promise<GlobalResponseObject> {
  if (!reqModel.id) {
    throw new ErrorResponse(55689, "Please give units Id")
  }
  if (reqModel.id) {
    const records = await this.unitsRepo.find({where: { id: reqModel.id } });

    
    if (records.length === 0) {
       throw new ErrorResponse(55689, "No records found")
    }
    const deleteUnits = await this.unitsRepo.delete(reqModel.id);
    return new GlobalResponseObject(true, 85552, 'Units Deleted Successfully');
  }
    
}

  async getUnits(reqData: UnitsIdRequest): Promise<UnitsResponse> {
    try {
      
      const records = await this.unitsRepo.find();
  

      if (records.length === 0) {
        throw new ErrorResponse(924, "No Data Found");
      }
      const resultData: UnitsModel[] = records.map(data => {
        return new UnitsModel(data.id,data.unitName,data.code,data.companysCode,data.location,data.address,data.isActive,data.latitude,data.longitude
        );
      });  
      return new UnitsResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(968, "Internal Server Error");
    } 
}
  
  // async updateUnits(req: UnitsDto): Promise<UnitsResponse>
  //   {
  //     const units = await this.unitsRepo.findOne({ where: { id: req.id } });
      
  //     if (!units) {
  //        return new UnitsResponse(false, 924,"No Data Found", req.id);
  //   }
  //   const duplicate = await this.unitsRepo.findOne({
  //     where: { code: req.code,companysCode: req.companysCode }
  //   });
  //   if (duplicate) {
  //     return new UnitsResponse(false, 925, 'Already exists');
  //   }
  //   await this.unitsRepo.update({ id: req.id }, {
  //     unitName: req.unitName,
  //     code: req.code,
  //     companysCode: req.companysCode,
  //     location: req.location,
  //     address: req.address,
  //     unitCode: req.unitCode,
  //     companyCode: req.companyCode,
  //     userId: req.userId,
  //     isActive: req.isActive,
  //     latitude: req.latitude,
  //     longitude: req.longitude
  //   });
  //   return new UnitsResponse(true, 85552, "Updated Successfully", req.id);
  //   }


  async activeDeactiveUnits(reqModel: UnitsIdRequest): Promise<UnitsResponse> {
    const getRecord = await this.unitsRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.unitsRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new UnitsResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Units Activated Successfully" : "Units Deactivated Successfully"
    );
  }

}