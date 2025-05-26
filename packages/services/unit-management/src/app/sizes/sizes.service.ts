import { Injectable } from "@nestjs/common"; import { DataSource, In, MoreThanOrEqual } from "typeorm";
import { CommonRequestAttrs, GlobalResponseObject, ShiftCreateRequest, ShiftModel, ShiftResponse, SizeCodeRequest, SizesResponse, SizescreateRequest, sizesModel } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SizesRepository } from "./repository/sizes.repository";
import { SizesEntity } from "./entity/sizes.entity";
import { SizeHelperService } from "./sizes.helper.service";

@Injectable()
export class SizesService {
  constructor(
    private dataSource: DataSource,
    private sizeRepo: SizesRepository,
    private sizesHelperService: SizeHelperService,
  ) {

  }
  async createSize(req: SizescreateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
        await transManager.startTransaction();
        const repo = transManager.getRepository(SizesEntity);

        // Validate that sizeCode, sizeDesc and sizeIndex are not null/undefined
        if (!req.sizeCode || !req.sizeDesc || req.sizeIndex === undefined) {
            throw new ErrorResponse(0, "sizeCode, sizeDesc and sizeIndex are required");
        }

        // Convert single values to arrays (if needed) but ensure no nulls
        const sizeCodes = Array.isArray(req.sizeCode) ? req.sizeCode : [req.sizeCode];
        const sizeDescs = Array.isArray(req.sizeDesc) ? req.sizeDesc : [req.sizeDesc];
        const sizeIndexes = Array.isArray(req.sizeIndex) ? req.sizeIndex : [req.sizeIndex];

        if (sizeCodes.some(code => code == null) ||
            sizeDescs.some(desc => desc == null) ||
            sizeIndexes.some((idx) => idx == null)) {
            throw new ErrorResponse(0, "sizeCode, sizeDesc and sizeIndex cannot contain null/undefined values");
        }

        if (req.id) {
            // Single update operation (ID provided)
            if (sizeCodes.length !== 1 || sizeDescs.length !== 1 || sizeIndexes.length !== 1) {
                throw new ErrorResponse(0, "For updates, only one sizeCode, sizeDesc and sizeIndex allowed");
            }

            // Delete existing size if updating
            const existingSize = await repo.findOne({ where: { id: req.id } });
            if (existingSize) {
                await repo.remove(existingSize);
            }

            // Adjust indexes for records after the provided index
            await repo.increment(
                { sizeIndex: MoreThanOrEqual(+req.sizeIndex) },
                'sizeIndex', 
                1
            );

            const entitysize = new SizesEntity();
            entitysize.id = req.id;
            entitysize.sizeCode = sizeCodes[0];
            entitysize.sizeDesc = sizeDescs[0];
            entitysize.sizeIndex = +sizeIndexes[0];
            entitysize.companyCode = req.companyCode;
            entitysize.unitCode = req.unitCode;
            entitysize.updatedUser = req.username;
            await repo.save(entitysize, { reload: false });

        } else {
            // Bulk creation (no ID provided)
            if (sizeCodes.length !== sizeDescs.length || sizeCodes.length !== sizeIndexes.length) {
                throw new ErrorResponse(0, "sizeCode, sizeDesc and sizeIndex arrays must have the same length");
            }

            const existingSizes = await repo.find({
                where: {
                    unitCode: req.unitCode,
                    companyCode: req.companyCode,
                    sizeCode: In(sizeCodes),
                }
            });
            console.log('Existing sizes:', existingSizes);
            if (existingSizes.length > 0) {
                const existingCodes = existingSizes.map(s => s.sizeCode).join(', ');
                throw new ErrorResponse(0, `Sizes ${existingCodes} already exist`);
            }

            // Adjust indexes for existing records that need to be shifted
            for (let i = 0; i < sizeIndexes.length; i++) {
                const sizeIndex = sizeIndexes[i];
                await repo.increment(
                    { sizeIndex: MoreThanOrEqual(sizeIndex) },
                    'sizeIndex', 
                    1
                );
            }

            const entities = sizeCodes.map((code, index) => {
                const entity = new SizesEntity();
                entity.sizeCode = code;
                entity.sizeDesc = sizeDescs[index];
                entity.sizeIndex = sizeIndexes[index];
                entity.companyCode = req.companyCode;
                entity.unitCode = req.unitCode;
                entity.createdUser = req.username;
                return entity;
            });

            await repo.save(entities, { reload: false });
        }

        await transManager.completeTransaction();
        return new GlobalResponseObject(
            true,
            85552,
            req.id
                ? "Size Updated Successfully"
                : `${sizeCodes.length} Sizes Created Successfully`
        );
    } catch (error) {
        await transManager.releaseTransaction();
        throw error;
    }
}

  async deleteSize(req: SizescreateRequest): Promise<GlobalResponseObject> {
    console.log(req);
    if (!req.sizeCode) {
      throw new ErrorResponse(0, "Size code must be provided");
    }
    //check if the size is used in oms
    // const sizeExists = await this.sizesHelperService.checkIfSizesAlreadyUsedInExternalModule(req.username, req.unitCode, req.companyCode, req.userId, req.sizeCode[0]);

    // if (sizeExists) {
    //   throw new ErrorResponse(0, 'size cannot be deleted.Size is already mapped to an order');
    // }
    const records = await this.sizeRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, sizeCode:req.sizeCode[0]} });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Operation code is not Found");
    }
    await this.sizeRepo.delete({unitCode: req.unitCode, companyCode: req.companyCode,sizeCode:req.sizeCode[0] });
    return new GlobalResponseObject(true, 85552, 'Size code Deleted Successfully');
  }

  async getAllSizes(req: CommonRequestAttrs): Promise<SizesResponse> {
    const records = await this.sizeRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultModel: sizesModel[] = [];
    if (records.length === 0) {
      return new SizesResponse(true, 85552, 'Sizes Data Retrieved Successfully but no records were found. ', resultModel);
    }
    for (const allSizes of records) {
      const res = new sizesModel(allSizes.id, allSizes.sizeCode, allSizes.sizeDesc, allSizes.sizeIndex);
      resultModel.push(res);
    }
    return new SizesResponse(true, 85552, 'Sizes Data Retrieved Successfully', resultModel);
  }


  async saveSizeIndex(req: SizescreateRequest[]): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const repo = transManager.getRepository(SizesEntity);

      for (const size of req) {
        await repo.update(
          { id: size.id },
          { sizeIndex: +size.sizeIndex, updatedUser: size.username }
        );
      }

      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 85552, "Size indexes updated successfully");
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

}