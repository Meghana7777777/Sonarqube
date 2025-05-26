import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonRequestAttrs, SupplierActivateRequest, SupplierCodeReq, SupplierCreateRequest, SupplierCreationModel, SupplierResponse, SuppliersResponseK } from '@xpparel/shared-models';
import { supplierAdapter } from '../../dtos/supplier.adpter';
import { SupplierRepo } from '../../repositories/supplier-repository';



@Injectable()
export class SupplierDataService {
  constructor(
    private supplierRepo: SupplierRepo,
    private supplierAdapter: supplierAdapter,
  ) { }

  async createSupplier(reqModel: SupplierCreateRequest): Promise<SupplierResponse> {
    if (reqModel.supplierCode) {
      const findRecord = await this.supplierRepo.findOne({ where: { supplierCode: reqModel.supplierCode } });
      if (findRecord && findRecord.id !== reqModel.id) {
        throw new ErrorResponse(54585, "Supplier Code already exists.");
      }
    }
    const entity = this.supplierAdapter.convertDtoToEntity(reqModel);
    const saveData = await this.supplierRepo.save(entity);
    const rec = new SupplierCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.id, saveData.supplierName, saveData.supplierCode, saveData.phoneNumber, saveData.supplierAddress);
    return new SupplierResponse(true, 85552, `Suppliers ${reqModel.id ? "Updated" : "Created"} Successfully`, rec);

  }


  async activateDeactivateSuppliers(reqModel: SupplierActivateRequest): Promise<SupplierResponse> {
    const getRecord = await this.supplierRepo.findOne({ where: { id: reqModel.id } });
    await this.supplierRepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new SupplierResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'supplier de-activated successfully' : 'supplier activated successfully');

  }

  async getAllSuppliersData(req: CommonRequestAttrs): Promise<SuppliersResponseK> {

    const records = await this.supplierRepo.find({ where: { unitCode: req.unitCode } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new SupplierCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.supplierName, data.supplierCode, data.phoneNumber, data.supplierAddress, data.isActive);
        resultData.push(eachRow);
      });
    }
    return new SuppliersResponseK(true, 85552, 'Data retrieved Successfully', resultData)
  }


  async getSuppliersDataByCode(req: SupplierCodeReq): Promise<SupplierResponse> {
    const record = await this.supplierRepo.findOne({ where: { unitCode: req.unitCode, supplierCode: req.supplierCode, companyCode: req.companyCode } });
    if (!record) {
      throw new ErrorResponse(55689, "Supplier Details Not Found for the given Supplier Code "+req.supplierCode);
    }
    const supplierData = new SupplierCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, record.id, record.supplierName, record.supplierCode, record.phoneNumber, record.supplierAddress, record.isActive);
    return new SupplierResponse(true, 85552, 'Data Retrieved Successfully', supplierData)
  }


}


