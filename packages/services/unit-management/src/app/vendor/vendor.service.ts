import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { VendorHelperService } from "./vendor-helper.service";
import { VendorInfoService } from "./vendor-info.service";
import { VendorRepository } from "./repository/vendor.repository";
import { VendorCategoryRepository } from "./repository/vendor-category.repository";
import { CommonRequestAttrs, GlobalResponseObject, VendorCategoryEnum, VendorCategoryRequest, VendorCreateRequest, VendorIdRequest, VendorModel, VendorResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { VendorEntity } from "./entity/vendor.entity";
import { ErrorResponse } from "@xpparel/backend-utils";
import { VendorCategoryEntity } from "./entity/vendor-category.entity";

@Injectable()
export class VendorService {
  constructor(
    private dataSource: DataSource,
    private infoService: VendorInfoService,
    private helperService: VendorHelperService,
    private vendorRepo: VendorRepository,
    private vendorCatRepo: VendorCategoryRepository
  ) {

  }

  // ENDPOINT
  async createVendor(req: VendorCreateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const entityVendor = new VendorEntity();
      const vCatEntity = new VendorCategoryEntity();
      entityVendor.vName = req.vName;
      entityVendor.vCode = req.vCode;
      entityVendor.vDescription = req.vDesc;
      entityVendor.vPlace = req.vPlace;
      entityVendor.vCountry = req.vCountry;
      entityVendor.vAdddress = req.vAddress;
      entityVendor.companyCode = req.companyCode;
      entityVendor.createdUser = req.username;
      entityVendor.unitCode = req.unitCode;
      entityVendor.vContact = req.vContact;
      if (req.id) {
        // An update vendor
        entityVendor.id = req.id;
        entityVendor.updatedUser = req.username;
      } else {
        const vendorExists = await this.vendorRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, vCode: req.vCode } });
        if (vendorExists) {
          throw new ErrorResponse(0, `Vendor code ${req.vCode} already exist`);
        }
      }
      // const vEntityResult=await transManager.getRepository(VendorEntity).save(entityVendor, {reload: false});
      const vEntityResult = await transManager.getRepository(VendorEntity).save(entityVendor);

      console.log(req);

      for (const category of req.vCategory) {
        const vCatEntity = new VendorCategoryEntity();
        console.log('category', VendorCategoryEnum[category]);
        vCatEntity.vCategory = VendorCategoryEnum[category];
        vCatEntity.vendorId = vEntityResult.id;
        const vendorCatExists = await this.vendorCatRepo.findOne({ where: { vendorId: req.id, vCategory: VendorCategoryEnum[category] } });
        if (!vendorCatExists) {
          await transManager.getRepository(VendorCategoryEntity).save(vCatEntity);
        }
        if (!req.id) {
          await transManager.getRepository(VendorCategoryEntity).save(vCatEntity);
        }

      }
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 85552, `Vendor ${req.id ? "Updated" : "Created"} Successfully`);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // ENDPOINT
  async deleteVendor(req: VendorCreateRequest): Promise<GlobalResponseObject> {
    if (!req.vCode) {
      throw new ErrorResponse(0, "Vendor Code must be provided");
    }
    const records = await this.vendorRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, vCode: req.vCode } });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Vendor code is not Found");
    }
    // check if this op is utilized in the oes
    await this.vendorRepo.delete({ unitCode: req.unitCode, companyCode: req.companyCode, vCode: req.vCode });
    await this.vendorCatRepo.delete({ vendorId: req.id });
    return new GlobalResponseObject(true, 85552, 'Vendor Deleted Successfully');
  }

  // ENDPOINT
  async getAllVendors(req: CommonRequestAttrs): Promise<VendorResponse> {
    const records = await this.vendorRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultModel: VendorModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Vendors not Found")
    }
    for (const allVendors of records) {
      const vCatRecords = await this.vendorCatRepo.find({ where: { vendorId: allVendors.id } });
      for (const vendorsCat of vCatRecords) {
        const res = new VendorModel(allVendors.id,
          allVendors.vName,
          allVendors.vCode,
          allVendors.vDescription,
          allVendors.vCountry,
          allVendors.vPlace,
          allVendors.vAdddress,
          vendorsCat.vCategory,
          allVendors.vContact)
        resultModel.push(res);
      }
    }
    console.log(resultModel,"+++++++++++")
    return new VendorResponse(true, 85552, 'Vendors Retrived Successfuly', resultModel);
  }

  // ENDPOINT
  async getAllVendorsByVendorCategory(req: VendorCategoryRequest): Promise<VendorResponse> {
    const vCatRecords = await this.vendorCatRepo.find({ where: { vCategory: req.vendorCategory } });

    const resultModel: VendorModel[] = [];
    if (!vCatRecords) {
      throw new ErrorResponse(55689, "Vendor Category not Found")
    }
    for (const allVendorByVCat of vCatRecords) {
      const vendorRecords = await this.vendorRepo.findOne({ where: { id: allVendorByVCat.vendorId } });
      const res = new VendorModel(vendorRecords.id, vendorRecords.vName, vendorRecords.vCode, vendorRecords.vDescription, vendorRecords.vCountry, vendorRecords.vPlace, vendorRecords.vAdddress, req.vendorCategory, vendorRecords.vContact);
      resultModel.push(res);
    }
    return new VendorResponse(true, 85552, 'Vendors Retrived Successfuly', resultModel);
  }

  // ENDPOINT
  async getVendorInfoById(req: VendorIdRequest): Promise<VendorResponse> {
    const vCatRecords = await this.vendorCatRepo.find({ where: { id: req.vendorId } });
    const resultModel: VendorModel[] = [];
    if (!vCatRecords) {
      throw new ErrorResponse(55689, "Vendor Category not Found")
    }
    for (const allVendorByVCat of vCatRecords) {
      const vendorRecords = await this.vendorRepo.findOne({ where: { id: allVendorByVCat.vendorId } });
      const res = new VendorModel(vendorRecords.id, vendorRecords.vName, vendorRecords.vCode, vendorRecords.vDescription, vendorRecords.vCountry, vendorRecords.vPlace, vendorRecords.vAdddress, allVendorByVCat.vCategory, vendorRecords.vContact);
      resultModel.push(res);
    }
    return new VendorResponse(true, 85552, 'Vendors Retrieved Successfully', resultModel);
  }

}   