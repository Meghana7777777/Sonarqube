import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BinDetailsModel, BinModel, BinsActivateRequest, BinsCreateRequest, BinsCreationModel, BinsResponse, CommonRequestAttrs, RackAndBInResponse, RackIdRequest, RackOccupiedRequest, RackOccupiedResponse, RackOccupiedResponseModel, GetAllBinsByRackIdDto, GetAllBinsByRackIdRes, GetBinsByRackIdReq, RackIdsAndLevelsRequest, TotalRackResponse, RackAndBinModel, BinIdRequest, RackBinPalletsResponse } from '@xpparel/shared-models';
import { LBinRepo } from '../../repositories/l-bin.repository';
import { BinsAdapter } from '../../dtos/bins-create.adapter';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GenericTransactionManager } from 'packages/services/warehouse-management/src/database/typeorm-transactions';
import { DataSource } from 'typeorm';
import { LBinEntity } from '../../entities/l-bin.entity';
import { In } from 'typeorm';
import { LRackRepo } from '../../repositories/l-rack.repository';
import { RacksDataService } from '../racks/racks.service';
import { LRackEntity } from '../../entities/l-rack.entity';
import { TrolleyBinInfoService } from '../../../tray-trolly/trolley-bin-info.service';
import { PalletBinMappingService } from '../../../location-allocation/pallet-bin-mapping.service';
import { BinInfoService } from '../../../location-allocation/bin-info.service';
import { BinRelatedDataQryResp } from '../../../location-allocation/repositories/query-response.ts/bin-related-data.response';



@Injectable()
export class BinsDataService {
  constructor(
    private dataSource: DataSource,
    private binrepo: LBinRepo,
    private binAdapter: BinsAdapter,
    private rackrepo: LRackRepo,
    private rackService: RacksDataService,
    @Inject(forwardRef(() => TrolleyBinInfoService)) private trolleyBinMapService: TrolleyBinInfoService,
    @Inject(forwardRef(() => BinInfoService)) private palletBinMapService: BinInfoService,
  ) { }

  async createBins(reqModel: BinsCreateRequest): Promise<BinsResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (reqModel.code) {
        const findRecord = await this.binrepo.findOne({ where: { code: reqModel.code } });
        if (findRecord && findRecord.id !== reqModel.id) {
          throw new ErrorResponse(6124, "Bin Code already available please check")
        }
      }
      if (reqModel.name) {
        const findRecordByName = await this.binrepo.findOne({ where: { name: reqModel.name } });
        if (findRecordByName && findRecordByName.id !== reqModel.id) {
          throw new Error(`Bin with name ${reqModel.name} already exists.`);
        }
      }
      const entity = this.binAdapter.convertDtoToEntity(reqModel);
      await transManager.startTransaction();
      const saveData = await transManager.getRepository(LBinEntity).save(entity);
      
      const rackInfo = await this.rackrepo.findOne({ select: ['code', 'barcodeId'], where: { id: reqModel.rackId, isActive: true } });
      const insertedId = saveData.id.toString().padStart(3, '0');
      const barcodeIds = `R${rackInfo.code}-BN-${insertedId}`;
      const updateBarcode = await transManager.getRepository(LBinEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      await transManager.completeTransaction();
      const rec = new BinsCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.name, saveData.code, saveData.supportedPalletsCount, saveData.level, saveData.lRackId, saveData.column, barcodeIds);
      return new BinsResponse(true,reqModel.id ? 6340:6341, `Bins ${reqModel.id ? "Updated" : "Created"} Successfully`, [])
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }

  async ActivateDeactivateBins(reqModel: BinsActivateRequest): Promise<BinsResponse> {
    if(!reqModel.id) {
      throw new ErrorResponse(6125, 'Please provide the bin id');
    }
    const binRec = await this.binrepo.findOne({ where: { id: reqModel.id } });
    if(!binRec) {
      throw new ErrorResponse(6126, 'Bin does not exist');
    }
    // check if pallets  put in the bin 
    const palletsInBin = await this.palletBinMapService.getPalletIdsInBin(binRec.id, binRec.companyCode, binRec.unitCode);
    if(palletsInBin.length > 0) {
      throw new ErrorResponse(6127, `${palletsInBin.length} pallets are present in the bin. Cannot be de-activated`);
    }
    // check if trolleys are put in the bin
    const trolleysInBin = await this.trolleyBinMapService.getTrolleyIdsForBin(binRec.id, binRec.companyCode, binRec.unitCode);
    if(trolleysInBin.length > 0) {
      throw new ErrorResponse(6128, `${trolleysInBin.length} trolleys are present in the bin. Cannot be de-activated`);
    }

    const toggle = await this.binrepo.update(
      { id: reqModel.id },
      { isActive: binRec.isActive == true ? false : true });
    return new BinsResponse(true, binRec.isActive ? 0 : 6129, binRec.isActive ? 'Bins de-activated successfully' : 'Bins activated successfully');
  }

  async getAllBinData(req: CommonRequestAttrs): Promise<BinsResponse> {
    const records = await this.binrepo.find({ where: { unitCode: req.unitCode } });
    const resultData:BinsCreateRequest[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      const rackData = await this.rackService.getAllRacksBasicInfo(req.companyCode, req.unitCode);

      records.forEach(data => {
        const rackCodeObj = rackData.find(rackObj => rackObj.id == data.lRackId);
        const rackCode = rackCodeObj?.code;
        const eachRow = new BinsCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.supportedPalletsCount, data.level, data.lRackId, data.column, data.isActive, data.barcodeId, rackCode);
        resultData.push(eachRow);
      });
    }
    return new BinsResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

  async incrementOccupiedBinCnts(reqModel: BinsActivateRequest): Promise<BinsResponse> {
    //const transManager = new GenericTransactionManager(this.dataSource); 
    // await transManager.startTransaction();
    const getRecord = await this.binrepo.findOne({ where: { id: reqModel.id } });
    // const toggle = await transManager.getRepository(LBinEntity).update(
    //let incre=getRecord.levels;
    // ++incre;
    const toggle = await this.binrepo.update(
      { id: reqModel.id },
      { level: getRecord.level = (getRecord.level + 1) });

    return new BinsResponse(true, 917, `Bins ${toggle.affected} Updated Successfully`)

  }

  async incrementOccupiedBinCnt(binid: number, updateduser: string, transManager: GenericTransactionManager): Promise<BinsResponse> {
    const getRecord = await this.binrepo.findOne({ where: { id: binid } });
    if (transManager) {
      const opcount = await transManager.getRepository(LBinEntity).update(
        { id: binid },
        { level: getRecord.level = (getRecord.level + 1) });
      return new BinsResponse(true, 917, `Bins ${opcount.affected} Updated Successfully`)
    }
    else {
      const opcount = await this.binrepo.update(
        { id: binid },
        { level: getRecord.level = (getRecord.level + 1) });
      return new BinsResponse(true, 917, `Bins ${opcount.affected} Updated Successfully`)
    }
  }

  async decrementOccupiedBinCnt(binid: number, updateduser: string, transManager: GenericTransactionManager): Promise<BinsResponse> {
    const getRecord = await this.binrepo.findOne({ where: { id: binid } });
    if (transManager) {
      const opcount = await transManager.getRepository(LBinEntity).update(
        { id: binid },
        { level: getRecord.level = (getRecord.level - 1) });
      return new BinsResponse(true, 917, `Bins ${opcount.affected} Updated Successfully`)
    }
    else {
      const opcount = await this.binrepo.update(
        { id: binid },
        { level: getRecord.level = (getRecord.level - 1) });
      return new BinsResponse(true, 917, `Bins ${opcount.affected} Updated Successfully`)
    }
  }

  // HELPER
  async getAllBinsBasicInfo(companyCode: string, unitCode: string): Promise<BinDetailsModel[]> {
    const binDetailsModels: BinDetailsModel[] = [];
    const rackIdInfoMap = new Map<number, LRackEntity>();
    const bins = await this.binrepo.find({ where: { companyCode: companyCode, unitCode: unitCode } });
    for (const r of bins) {
      // get the rack info also
      if (!rackIdInfoMap.has(r.lRackId)) {
        const rackInfo = await this.rackrepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.lRackId, isActive: true } });
        rackIdInfoMap.set(r.lRackId, rackInfo);
      }
      const rackInfo = rackIdInfoMap.get(r.lRackId);
      const binInfo = new BinDetailsModel(r.id, r.code, r.code, r.supportedPalletsCount, r.level, 0, r.lRackId, rackInfo.code);
      binDetailsModels.push(binInfo);
    }
    return binDetailsModels;
  }

  // HELPER
  async getBinsBasicInfo(companyCode: string, unitCode: string, binIds: number[], iNeedTrolleyIds?: boolean): Promise<BinDetailsModel[]> {
    const binDetailsModels: BinDetailsModel[] = [];
    const rackIdInfoMap = new Map<number, LRackEntity>();
    const bins = await this.binrepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(binIds) } });
    for (const r of bins) {
      // get the rack info also
      if (!rackIdInfoMap.has(r.lRackId)) {
        const rackInfo = await this.rackrepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.lRackId, isActive: true } });
        rackIdInfoMap.set(r.lRackId, rackInfo);
      }
      let trolleyIds: string[] = [];
      if(iNeedTrolleyIds) {
        trolleyIds = await this.trolleyBinMapService.getTrolleyIdsForBin(r.id, companyCode, unitCode);
      }
      const rackInfo = rackIdInfoMap.get(r.lRackId);
      const binInfo = new BinDetailsModel(r.id, r.code, r.code, r.supportedPalletsCount, r.level, 0, r.lRackId, rackInfo.code, trolleyIds);
      binDetailsModels.push(binInfo);
    }
    return binDetailsModels;

  }

  async getAllBinsDataByRackId(req: GetBinsByRackIdReq): Promise<GetAllBinsByRackIdRes> {
    const binsData: any = await this.binrepo.getAllBinsDataByRackId(req.lRackId);
    return new GetAllBinsByRackIdRes(true, 6131, "Bins Data Retrieved Successfully", binsData);
  }

  async getMappedRackLevelColumn(reqModel: RackOccupiedRequest): Promise<RackOccupiedResponse> {
    const rackInfo = await this.rackrepo.findOne({ select: ['levels', 'columns'], where: { id: reqModel.rackId, isActive: true } });
    let resultInfoDataTotals: RackOccupiedResponseModel[] = [];
    let columnsLimit = rackInfo.columns;
    for (let i = 1; i <= rackInfo.levels; i++) {
      const resultData = [];
      let levelStatus = '';
      let colCount = 1;
      const records = await this.binrepo.find({ where: { lRackId: reqModel.rackId, level: i, isActive: true } });
      if (records.length > 0) {
        records.forEach(data => {
          resultData.push(data.column);
          colCount++;
        });
        if (colCount = columnsLimit) {
          let levelStatus = 'Full';
        } else {
          let levelStatus = 'NotFull';
        }
        const resultInfoDataTotal = new RackOccupiedResponseModel(i, columnsLimit, levelStatus, resultData);
        resultInfoDataTotals.push(resultInfoDataTotal);
      } else {
        levelStatus = 'NotFull';
        const resultInfoDataTotal = new RackOccupiedResponseModel(i, columnsLimit, levelStatus, resultData);
        resultInfoDataTotals.push(resultInfoDataTotal);
      }
    }
    return new RackOccupiedResponse(true, 967, 'Data Retrieved Successfully', resultInfoDataTotals)
  }

  async getBinsInRack(reqModel: RackIdRequest): Promise<RackAndBInResponse> {
    let LevelsLimit = reqModel.rackLevel;
    const rackAndBindResponseModel: BinModel[] = [];
    for (let i = 1; i <= LevelsLimit; i++) {
      const records = await this.binrepo.find({ where: { lRackId: reqModel.rackId, level: i, isActive: true } });
      if (records.length > 0) {
        records.forEach(binData => {
          const resultInfoDataTotal = new BinModel(binData.id, binData.barcodeId, binData.code, binData.name, binData.level, binData.column, binData.supportedPalletsCount);
          rackAndBindResponseModel.push(resultInfoDataTotal);
        });
      }
    }
    return new RackAndBInResponse(true, 967, 'Data Retrieved Successfully', rackAndBindResponseModel)
  }

  async getBinsForRackLevelAndColumn(reqModel: RackIdRequest): Promise<RackAndBInResponse> {
    const rackAndBindResponseModel: BinModel[] = [];
    const records = await this.binrepo.find({ where: { lRackId: reqModel.rackId, level: reqModel.rackLevel, column: reqModel.rackColumn, isActive: true } });
    if (records.length > 0) {
      records.forEach(binData => {
        const resultInfoDataTotal = new BinModel(binData.id, binData.barcodeId, binData.code, binData.name, binData.level, binData.column, binData.supportedPalletsCount);
        rackAndBindResponseModel.push(resultInfoDataTotal);
      });

    }
    return new RackAndBInResponse(true, 967, 'Data Retrieved Successfully', rackAndBindResponseModel)
  }

  // HELPER
  async getBinsByIds(binIds: number[], companyCode: string, unitCode: string): Promise<BinDetailsModel[]> {
    if(binIds.length == 0) {
      return [];
    }
    const binDetailsModels: BinDetailsModel[] = [];
    const bins = await this.binrepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(binIds) } });
    for(const r of bins) {
      const rackInfo = await this.rackrepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.lRackId, isActive: true, companyCode: companyCode, unitCode: unitCode } });
      const binInfo = new BinDetailsModel(r.id, r.code, r.code, r.supportedPalletsCount, r.level, 0, r.lRackId, rackInfo.code);
      binDetailsModels.push(binInfo);
    }
    return binDetailsModels;
  }

  async getBinRecordById(binId: number, companyCode: string, unitCode: string): Promise<LBinEntity> {
    return await this.binrepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: binId} });
  }

  /**
   * this service will return the Bins of the mentioned racks and mentioned levels.
   * 1.If rack ids provided and no levels provided, then we will retrieve all the bins of all levels
   * 2. If only levels are provided, then we will retrieve all the bins of all levels of all the racks
   * 3. If both levels and rack ids are provided, then we will retrieve bins of rack + level combinations
   * @returns 
   */
  async getSpecificLevelBinsOfAllRacks(req: RackIdsAndLevelsRequest): Promise<TotalRackResponse> {
    // take ref of getBinsInRack
    const rackIds = req.rackIds ?? [];
    const levels = req.levels ?? [];
    // get the racks based on the request
    const racksRecs = await this.rackService.getRackRecordsByRackIds(rackIds, req.companyCode, req.unitCode);
    if (racksRecs.length == 0) {
      throw new ErrorResponse(6132, 'Racks does not exist');
    }
    const rackBinModels: RackAndBinModel[] = [];
    // for each rack get the bins based on the levels
    for(const rack of racksRecs) {
      let binRecs: LBinEntity[] = [];
      let binModels: BinModel[] = [];
      if(levels.length > 0) {
        binRecs = await this.binrepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, lRackId: rack.id, level: In(levels)} });
      } else {
        binRecs = await this.binrepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, lRackId: rack.id } });
      }
      binRecs.forEach(binData => {
        const binModel = new BinModel(binData.id, binData.barcodeId, binData.code, binData.name, binData.level, binData.column, binData.supportedPalletsCount);
        binModels.push(binModel);
      });
      const rackBinModel = new RackAndBinModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, binModels);
      rackBinModels.push(rackBinModel);
    }
    return new TotalRackResponse(true, 6133, 'Rack and binds info retrieved', rackBinModels);
  }

  async getPalletIdsInBin(binId: number, companyCode: string, unitCode: string): Promise<number[]> {
    return await this.palletBinMapService.getPalletIdsInBin(binId, companyCode, unitCode)
  }

  async getEmptyPalletsInBin(binId: number, companyCode: string, unitCode: string): Promise<number[]> {
    return await this.palletBinMapService.getEmptyPalletsInBin(companyCode, unitCode, binId);
  }

  async getBinPalletsWithoutRolls(req: BinIdRequest): Promise<RackBinPalletsResponse> {
    return this.palletBinMapService.getBinPalletsWithoutRolls(req);
  }

  async getPalletsCountByBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
    return await this.palletBinMapService.getPalletsCountByBinIds(binIds, companyCode,unitCode);
  }

  async getTotalAndEmptyPalletCountForBinIds(binIds: number[], companyCode: string, unitCode: string): Promise<BinRelatedDataQryResp[]> {
    return await this.palletBinMapService.getTotalAndEmptyPalletCountForBinIds(binIds, companyCode, unitCode);
  } 

}