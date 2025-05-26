import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CustomerRepository } from "./repository/customer-repository";
import { CommonResponse, GlobalResponseObject, CustomerCreateRequest, CustomerIdRequest, CustomerModel, CustomerResponse, CommonRequestAttrs, CustomerDropDownModel, CustomerDropDownResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../../database/typeorm-transactions/generic-transaction-manager";
import { CustomerEntity } from "./entity/customer-entity";
import { ErrorResponse } from "@xpparel/backend-utils";


@Injectable()
export class CustomerService {
  constructor(
    private dataSource: DataSource,
    private customerRepo: CustomerRepository,
  ) { }

  async createCustomer(reqModel: CustomerCreateRequest): Promise<CustomerResponse> {
    console.log(reqModel, "reqModel");
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: CustomerEntity[] = [];
      let isUpdate = false;
      for (const customer of reqModel.customer) {
        const existingRecords = await transManager.getRepository(CustomerEntity).find({
          where: [
            { customerCode: customer.customerCode },
          ]

        });
        if (existingRecords.length > 0 && !customer.id) {
          throw new ErrorResponse(55689, "customer code already exists");
        }
        const entity = new CustomerEntity();
        entity.id = customer.id
        entity.customerName = customer.customerName;
        entity.customerCode = customer.customerCode;
        entity.customerDescription = customer.customerDescription;
        entity.customerLocation = customer.customerLocation;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        if (customer.id) {
          entity.updatedUser = reqModel.username;
        } else {
          entity.createdUser = reqModel.username;
        }
        const savedEntity = await transManager.getRepository(CustomerEntity).save(entity);
        resultEntity.push(savedEntity);
      }
      await transManager.completeTransaction();
      const message = isUpdate ? "Updated" : "Created";
      return new CustomerResponse(true, 85552, `Customer ${message} Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteCustomer(reqModel: CustomerIdRequest): Promise<CustomerResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please give process type Id");
    }
    const records = await this.customerRepo.find({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (records.length === 0) {
      throw new ErrorResponse(55689, "No records found");
    }
    await this.customerRepo.delete(reqModel.id);
    return new CustomerResponse(true, 85552, 'Process Type Deleted Successfully');
  }

  async getAllCustomers(reqData: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      const records = await this.customerRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode } });
      const resultData: CustomerModel[] = records.map(data => {
        return new CustomerModel(data.id, data.customerName, data.customerCode, data.customerDescription, data?.customerLocation, data.imageName, data.imagePath, data.isActive);
      });
      return new CustomerResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  async getAllCustomersForDropDown(reqData: CommonRequestAttrs): Promise<CustomerDropDownResponse> {
    try {
      const records = await this.customerRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode } });
      if (records.length === 0) {
        throw new ErrorResponse(59689, "No Data Found");
      }
      const resultData: CustomerDropDownModel[] = records.map(data => {
        return new CustomerDropDownModel(data.customerName, data.customerCode);
      });
      return new CustomerDropDownResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  async activateDeactivateCustomer(reqModel: CustomerIdRequest): Promise<CustomerResponse> {
    const getRecord = await this.customerRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });

    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.customerRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new CustomerResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Customer Activated Successfully" : "Customer Deactivated Successfully"
    );
  }


  async customerUpdateImage(files: any, id: number): Promise<CommonResponse> {
    try {
      const updateData: any = {};
      if (files && files.length > 0) {
        updateData.imageName = files[0].filename;
        updateData.imagePath = files[0].path;
      } else {
        updateData.imageName = null;
        updateData.imagePath = null;
      }
      const filePathUpdate = await this.customerRepo.update(
        { id: id },
        updateData
      );
      if (filePathUpdate.affected > 0) {
        return new CommonResponse(true, 11, 'Image Uploaded successfully', filePathUpdate);
      } else {
        return new CommonResponse(false, 11, 'Image Uploaded failed', filePathUpdate);
      }
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCustomerByCustomerCode(reqData: CustomerIdRequest): Promise<CustomerResponse> {
    try {
      const records = await this.customerRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode, customerCode: reqData.customerCode } });
      if (records.length === 0) {
        throw new ErrorResponse(404, "No Data Found for the given customer Code");
      }
      const resultData: CustomerModel[] = records.map(data => {
        return new CustomerModel(data.id, data.customerName, data.customerCode, data.customerDescription, data?.customerLocation, data.imageName, data.imagePath, data.isActive);
      });
      return new CustomerResponse(true, 200, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }
}