import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CompanyRepository } from "./REPO/company-repo";
import { CompanyDto } from "./DTO/company-dto";
import { CompanyCreateRequest, CompanyIdRequest, CompanyModel, CompanyResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions/generic-transaction-manager";
import { CompanyEntity } from "./company-entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class CompanyService {
  constructor(
    private dataSource: DataSource,
    private companyRepo: CompanyRepository,

  ) {
        
  }

  async createCompany(reqModel: CompanyCreateRequest): Promise<CompanyResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
      try {

        await transManager.startTransaction();
        const resultEntity: CompanyEntity[] = [];


      for (const company of reqModel.companys) {
				const records = await this.companyRepo.find({ where: { code: company.code} });
				if (records.length > 0 && !company.id) {
					throw new ErrorResponse(925, "Already exists");
				}

          const entity = new CompanyEntity();
            entity.companyName = company.companyName,
            entity.code = company.code,
            entity.location = company.location,
            entity.address = company.address;
            entity.companyCode = reqModel.companyCode,
            entity.unitCode = reqModel.unitCode;
            entity.createdUser = reqModel.username;
            entity.latitude = company.latitude;
            entity.longitude = company.longitude;
            if (company.id) {
               entity.id = company.id;
               entity.updatedUser = reqModel.username
          }

          if (records.length === 0) {
            const saveData = await transManager.getRepository(CompanyEntity).save(entity);
          } else if (company.id) {
            const saveData = await transManager.getRepository(CompanyEntity).save(entity);
          } else {
            throw new ErrorResponse(55689, "Data exists with same component");
          }
        }
    
        await transManager.completeTransaction();
        return new CompanyResponse(true, 85552, `Company "Updated" : "Created" Successfully`,resultEntity);
      } catch (error) {
        await transManager.releaseTransaction();
        throw error;
      }
    }
  

  async deleteCompany(reqModel: CompanyIdRequest): Promise<GlobalResponseObject> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please give company Id")
    }
    if (reqModel.id) {
      const records = await this.companyRepo.find({ where: { id: reqModel.id } });
      if (records.length === 0) {
        throw new ErrorResponse(55689, "No records found")
      }
      const deleteCompany = await this.companyRepo.delete(reqModel.id);
      return new GlobalResponseObject(true, 85552, 'Company Deleted Successfully');   
    }
    
  }  


  async getCompany(reqData: CompanyIdRequest): Promise<CompanyResponse> {
    try {
      
      const records = await this.companyRepo.find();
  

      // if (records.length === 0) {
      //   throw new ErrorResponse(924, "No Data Found");
      // }
      const resultData: CompanyModel[] = records.map(data => {
        return new CompanyModel(data.id,data.companyName,data.code,data.location,data.address,data.isActive,data.latitude,data.longitude);
      });  
      return new CompanyResponse(true, 967, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(968, "Internal Server Error");
    }
  }


  // async updateCompany(req: CompanyDto): Promise<CompanyResponse>
  //  {
  //     const company = await this.companyRepo.findOne({ where: { id: req.id } });

  //     if (!company) { 
  //         return new CompanyResponse(false, 924,"No Data Found", req.id);
  //     }
  //     const duplicate = await this.companyRepo.findOne({
  //       where: { code: req.code,companyName:req.companyName}
  //     });
  //     if (duplicate) {
  //       return new CompanyResponse(false, 3, 'Already exists');
  //     }
      
  //     await this.companyRepo.update({ id: req.id }, {
  //       companyName: req.companyName,
  //       code: req.code,
  //       location: req.location,
  //       address: req.address,
  //       unitCode: req.unitCode,
  //       companyCode: req.companyCode,
  //       userId: req.userId,
  //       isActive: req.isActive,
  //       latitude: req.latitude,
  //       longitude: req.longitude,
  //     });
  //     return new CompanyResponse(true, 85552, "Updated Successfully", req.id);
  //     }


  async activateDeactiveCompany(reqModel: CompanyIdRequest): Promise<CompanyResponse> {
    const getRecord = await this.companyRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.companyRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new CompanyResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Company Activated Successfully" : "Company Deactivated Successfully"
    );
  }
    
}