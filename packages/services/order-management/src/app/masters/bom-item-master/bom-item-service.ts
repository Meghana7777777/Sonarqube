import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { ItemCodesRequest, ItemCreateRequest, ItemIdRequest, ItemModel, ItemResponse } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { ItemEntity } from "./bom-item-entity";
import { ItemRepository } from "./repo/bom-item-repo";


@Injectable()
export class ItemService {
  constructor(
    private dataSource: DataSource,
    private itemRepo: ItemRepository,
  ) { }

  async createItem(reqModel: ItemCreateRequest): Promise<ItemResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ItemEntity[] = [];
      let isUpdate = false;
      for (const item of reqModel.item) {
        const existingRecords = await transManager.getRepository(ItemEntity).find({
          where: [
            { itemCode: item.itemCode },
          ]
        });

        if (existingRecords.length > 0 && !item.id) {
          throw new ErrorResponse(55689, "bomitem code already exists");
        }
        const entity = new ItemEntity();
        entity.id = item.id;
        entity.itemName = item.itemName;
        entity.itemCode = item.itemCode;
        entity.itemDescription = item.itemDescription;
        entity.itemSku = item.itemSku;
        entity.rmItemType = item.rmItemType;
        entity.bomItemType = item.bomItemType;
        entity.itemColor = item.itemColor;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        if (item.id) {
          entity.updatedUser = reqModel.username;
          isUpdate = true;
        } else {
          entity.createdUser = reqModel.username;
        }

        const savedEntity = await transManager.getRepository(ItemEntity).save(entity);
        resultEntity.push(savedEntity);
      }

      await transManager.completeTransaction();
      const message = isUpdate ? "Updated" : "Created";
      return new ItemResponse(true, 85552, `Item ${message} Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async deleteItem(reqModel: ItemIdRequest): Promise<ItemResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(55689, "Please provide item ID");
    }
    const records = await this.itemRepo.find({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    if (records.length === 0) {
      throw new ErrorResponse(55689, "No records found");
    }
    await this.itemRepo.delete(reqModel.id);
    return new ItemResponse(true, 85552, "Item Deleted Successfully");
  }

  async getAllItem(reqData: ItemIdRequest): Promise<ItemResponse> {
    try {
      const records = await this.itemRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode } });
      const resultData: ItemModel[] = records.map(data => {
        return new ItemModel(data.id, data.itemName, data.itemCode, data.itemDescription, data.itemSku, data.isActive, data.rmItemType, data.bomItemType, data.itemColor);
      });

      return new ItemResponse(true, 85552, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  async activateDeactivateItem(reqModel: ItemIdRequest): Promise<ItemResponse> {
    const getRecord = await this.itemRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
    console.log("getRecord", getRecord);
    if (!getRecord) {
      throw new ErrorResponse(404, "Record not found");
    }
    const newStatus = !getRecord.isActive;
    await this.itemRepo.update({ id: reqModel.id }, { isActive: newStatus });
    return new ItemResponse(
      true,
      newStatus ? 1 : 0,
      newStatus ? "Item Activated Successfully" : "Item Deactivated Successfully"
    );
  }

  async getBomItemByItemCode(reqData: ItemIdRequest): Promise<ItemResponse> {
    try {
      const records = await this.itemRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode, itemCode: reqData.itemCode } });
      if (records.length === 0) {
        throw new ErrorResponse(404, "No Data Found for the given Item Code");
      }
      const resultData: ItemModel[] = records.map(data => {
        return new ItemModel(data.id, data.itemName, data.itemCode, data.itemDescription, data.itemSku, data.isActive, data.rmItemType, data.bomItemType, data.itemColor);
      });
      return new ItemResponse(true, 200, "Data Retrieved Successfully", resultData);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  }

  async checkAndSaveItems(reqModel: ItemCreateRequest): Promise<ItemResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const resultEntity: ItemEntity[] = [];
      for (const item of reqModel.item) {
        const existingRecord = await transManager.getRepository(ItemEntity).findOne({ where: { itemCode: item.itemCode } });
        if (existingRecord) {
          continue;
        }
        const entity = new ItemEntity();
        entity.id = item.id;
        entity.itemName = item.itemName;
        entity.itemCode = item.itemCode;
        entity.itemDescription = item.itemDescription;
        entity.itemSku = item.itemSku;
        entity.rmItemType = item.rmItemType;
        entity.bomItemType = item.bomItemType;
        entity.itemColor = item.itemColor;
        entity.companyCode = reqModel.companyCode;
        entity.unitCode = reqModel.unitCode;
        entity.createdUser = reqModel.username;

        const savedEntity = await transManager.getRepository(ItemEntity).save(entity);
        resultEntity.push(savedEntity);
      }

      await transManager.completeTransaction();
      return new ItemResponse(true, 85552, `Items Created Successfully`, resultEntity);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  async getItemNamesOfItemCodes(reqData: ItemCodesRequest): Promise<ItemResponse> {
    const records = await this.itemRepo.find({ where: { companyCode: reqData.companyCode, unitCode: reqData.unitCode, itemCode: In(reqData.itemCodes) } });
    if (records.length === 0) {
      throw new ErrorResponse(404, "No Data Found for the given Item Code");
    }
    const resultData: ItemModel[] = records.map(data => {
      return new ItemModel(data.id, data.itemName, data.itemCode, data.itemDescription, data.itemSku, data.isActive, data.rmItemType, data.bomItemType, data.itemColor);
    });
    return new ItemResponse(true, 200, "Data Retrieved Successfully", resultData);
  }
}