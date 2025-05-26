import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs, PalletsCreateRequest, PalletsResponse, PalletsCreationModel, PalletsActivateRequest, PalletDetailsModel, CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, EmptyPalletLocationResponse, CommonResponse, PalletstatusChangeRequest } from '@xpparel/shared-models';
import { LPalletRepo } from '../../repositories/l-pallet.repository';
import { PalletsAadapter } from '../../dtos/pallets-create.adapter';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from 'packages/services/warehouse-management/src/database/typeorm-transactions';
import { LPalletEntity } from '../../entities/l-pallet.entity';


@Injectable()
export class PalletsDataService {
  constructor(
    private dataSource: DataSource,
    private palletRepo: LPalletRepo,
    private palletAdapter: PalletsAadapter,
    private lPalletRepo: LPalletRepo
  ) {

  }

  async createPallets(reqModel: PalletsCreateRequest): Promise<PalletsResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (reqModel.code && !reqModel.id) {
        const findRecord = await this.palletRepo.findOne({ where: { palletCode: reqModel.code } });
        if (findRecord) {
          throw new ErrorResponse(6138, "Pallet Code already available please check")
        }
      }
      if (reqModel.name && !reqModel.id) {
        const findRecordByName = await this.palletRepo.findOne({ where: { palletName: reqModel.name } });
        if (findRecordByName) {
          throw new Error(`Pallet with name ${reqModel.name} already exists.`);
        }
      }
      const entity = this.palletAdapter.convertDtoToEntity(reqModel);

      await transManager.startTransaction();
      const saveData = await transManager.getRepository(LPalletEntity).save(entity);
      const insertedId = saveData.id.toString().padStart(4, '0');
      const barcodeIds = "PL-".concat(insertedId);
      const updateBarcode = await transManager.getRepository(LPalletEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      const rec = new PalletsCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.palletName, saveData.palletCode, saveData.fabricCapacity, saveData.fabricUom, saveData.weightCapacity, saveData.weightUom, saveData.currentBinId, saveData.currentPalletState, saveData.currentPalletLocation, saveData.palletBeahvior, saveData.freezeStatus, saveData.maxItems, barcodeIds);
      await transManager.completeTransaction();
      return new PalletsResponse(true, 6139, `Pallets ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }

  }

  async ActivateDeactivatePallets(reqModel: PalletsActivateRequest): Promise<PalletsResponse> {
    const getRecord = await this.palletRepo.findOne({ where: { id: reqModel.id } });

    const toggle = await this.palletRepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new PalletsResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'Pallets de-activated successfully' : 'Pallets activated successfully');
  }

  async getAllPalletsData(req: CommonRequestAttrs): Promise<PalletsResponse> {
    const records = await this.palletRepo.find({ where: { unitCode: req.unitCode } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new PalletsCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.palletName, data.palletCode, data.fabricCapacity, data.fabricUom, data.weightCapacity, data.weightUom, data.currentBinId, data.currentPalletState, data.currentPalletLocation, data.palletBeahvior, data.freezeStatus, data.isActive, data.maxItems, data.barcodeId);
        resultData.push(eachRow);
      });
    }
    return new PalletsResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

  // HELPER
  // NEVER USE THIS FUNCITON DIRECTLY FOR DETAIL INFO END POINTS
  async getAllPalletsBasicInfo(companyCode: string, unitCode: string): Promise<PalletDetailsModel[]> {
    const pallets = await this.palletRepo.find({ where: { companyCode: companyCode, unitCode: unitCode } });
    const palletDetails: PalletDetailsModel[] = [];
    pallets.forEach(p => {
      const palletInfo = new PalletDetailsModel(p.createdUser, unitCode, companyCode, 0, p.barcodeId, p.id, p.palletCode, p.fabricCapacity, p.fabricUom, p.maxItems, null, p.currentPalletLocation, p.currentPalletState, 0, 0, 0, 0, null, null);
      palletDetails.push(palletInfo);
    });
    return palletDetails;
  }

  // HELPER
  // OVERRIDE status in the HELPER of the calleee
  // NEVER USE THIS FUNCITON DIRECTLY FOR DETAIL INFO END POINTS
  async getPalletsBasicInfo(companyCode: string, unitCode: string, palletIds: number[]): Promise<PalletDetailsModel[]> {
    const pallets = await this.palletRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(palletIds) } });
    const palletDetails: PalletDetailsModel[] = [];
    if (pallets.length == 0) {
      throw new ErrorResponse(6142, 'No pallet info found');
    }
    pallets.forEach(p => {
      // The status null here is updated in the helper
      const palletInfo = new PalletDetailsModel(p.createdUser, unitCode, companyCode, 0, p.barcodeId, p.id, p.palletCode, p.fabricCapacity, p.fabricUom, p.maxItems, null, p.currentPalletLocation, p.currentPalletState, 0, 0, 0, 0, null, null);
      palletDetails.push(palletInfo);
    });
    return palletDetails;
  }

  async updatePalletLocationState(companyCode: string, unitCode: string, palletIds: number[], locationState: CurrentPalletLocationEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    if (transManager) {
      await transManager.getRepository(LPalletEntity).update({ companyCode: companyCode, unitCode: unitCode, id: In(palletIds) }, { currentPalletLocation: locationState, updatedUser: username });
    } else {
      await this.palletRepo.update({ companyCode: companyCode, unitCode: unitCode, id: In(palletIds) }, { currentPalletLocation: locationState, updatedUser: username });
    }
    return true;
  }

  async updatePalletLocWorkBehState(companyCode: string, unitCode: string, palletIds: number[], locationState: CurrentPalletLocationEnum, behaviourStatus: PalletBehaviourEnum, workStatus: CurrentPalletStateEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    if (transManager) {
      await transManager.getRepository(LPalletEntity).update({ companyCode: companyCode, unitCode: unitCode, id: In(palletIds) }, { currentPalletLocation: locationState, currentPalletState: workStatus, palletBeahvior: behaviourStatus, updatedUser: username });
    } else {
      await this.palletRepo.update({ companyCode: companyCode, unitCode: unitCode, id: In(palletIds) }, { currentPalletLocation: locationState, currentPalletState: workStatus, palletBeahvior: behaviourStatus, updatedUser: username });
    }
    return true;
  }

  // async getEmptyPalletDetails(): Promise<EmptyPalletLocationResponse> {
  //   const result = await this.lPalletRepo.getEmptyPalletDetails();
  //   return new EmptyPalletLocationResponse(true, 967, 'Data retrieved successfully', result);
  // }d

  async updatePalletLocationStatus(reqModel: PalletstatusChangeRequest, externalManager?: GenericTransactionManager): Promise<boolean> {
    const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
    if (transManager) {
      await transManager.getRepository(LPalletEntity).update({ companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.palletId }, { currentPalletLocation: reqModel.currentPalletLocation, currentPalletState: reqModel.currentPalletState, palletBeahvior: reqModel.palletBehavior, updatedUser: reqModel.username });
    } else {
      await this.palletRepo.update({ companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.palletId }, { currentPalletLocation: reqModel.currentPalletLocation, currentPalletState: reqModel.currentPalletState, palletBeahvior: reqModel.palletBehavior, updatedUser: reqModel.username });
    }
    return true;
  }
}


