import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { CommonResponse, ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";
import { FgMRackEntity } from "../racks/entity/fg-m-rack.entity";

import { FgLocationsCreateAdapter } from "./dto/fg-locations-create.adapter";
import { FgMLocationEntity } from "./entities/fgm-location.entity";
import { FgLocationCreateReq, FgLocationsResponse, LocationDetailsModel, FgGetLocationByRackIdReq, FgGetAllLocationByRackIdRes, FgRackOccupiedReq, FgRackOccupiedRes, FgRackOccupiedResModel, FgRackIdReq, FgRackIdsAndLevelsReq, FgTotalRackRes, FgRackAndLocationRes, FgRacksAndLocationModel, FgLocationModel, FgGetAllLocationByRackIdDto, FgLocationActiveReq, FgLocationCreationModel, FgLocationFilterReq, WarehouseIdRequest, WareHouseLocationsResponseDto } from "@xpparel/shared-models";
import { FgMLocationsRepo } from "./repo/fg-locations.repository";
import { FgRacksRepository } from "../racks/repository/fg-racks-repository";
import { FgRacksService } from "../racks/fg-racks.service";
import { LocationInfoService } from "../../location-allocation/location-info.service";
import { LocationRelatedDataQryResp } from "../../location-allocation/repositories/query-response.ts/location-related-data.response";
import { WareHouseModule } from "../warehouse-masters/warehouse.module";




@Injectable()
export class FgLocationsService {
  constructor(
    private dataSource: DataSource,
    private locationsRepo: FgMLocationsRepo,
    private locationsAdapter: FgLocationsCreateAdapter,
    private rackRepo: FgRacksRepository,
    @Inject(forwardRef(() => FgRacksService)) private rackService: FgRacksService,
    @Inject(forwardRef(() => LocationInfoService)) private containerLocationMapService: LocationInfoService,
  ) { }

  async createLocations(reqModel: FgLocationCreateReq, transactionManager?: GenericTransactionManager, deletePreLocations?: boolean): Promise<FgLocationsResponse> {
    const transManager = transactionManager ? transactionManager : new GenericTransactionManager(this.dataSource);
    try {
      if (transactionManager && deletePreLocations) {
        await transManager.getRepository(FgMLocationEntity).delete({ rackId: reqModel.rackId })
      }
      if (reqModel.code) {
        const findRecord = await transManager.getRepository(FgMLocationEntity).findOne({ where: { code: reqModel.code } });
        if (findRecord && findRecord.id !== reqModel.id) {
          throw new ErrorResponse(46006, "Location Code already available please check")
        }
      }
      if (reqModel.name) {
        const findRecordByName = await transManager.getRepository(FgMLocationEntity).findOne({ where: { name: reqModel.name } });
        if (findRecordByName && findRecordByName.id !== reqModel.id) {
          throw new Error(`Location with name ${reqModel.name} already exists.`);
        }
      }
      const entity = this.locationsAdapter.convertDtoToEntity(reqModel);

      if (!transactionManager)
        await transManager.startTransaction();
      const saveData = await transManager.getRepository(FgMLocationEntity).save(entity);
      const insertedId = saveData.id.toString().padStart(3, '0');
      let rackCode = ''
      if (!transactionManager) {
        let rackInfo = await this.rackRepo.findOne({ select: ['code', 'barcodeId'], where: { id: reqModel.rackId, isActive: true } });
        rackCode = rackInfo.code
      } else {
        rackCode = reqModel.rackCode;
      }

      const barcodeIds = `R${rackCode}-${reqModel.level}-${reqModel.column}`;
      const updateBarcode = await transManager.getRepository(FgMLocationEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      if (!transactionManager)
        await transManager.completeTransaction();
      const rec = new FgLocationCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.name, saveData.code, saveData.supportedPalletsCount, saveData.level, saveData.rackId, saveData.column, barcodeIds, saveData.length, saveData.width, saveData.height, saveData.latitude, saveData.longitude);
      return new FgLocationsResponse(true, reqModel?.id ? 46007 : 46008, `Locations ${reqModel.id ? "Updated" : "Created"} Successfully`, [])
    } catch (err) {
      if (!transactionManager)
        await transManager.releaseTransaction();
      throw err;
    }
  }

  async ActivateDeactivateLocations(reqModel: FgLocationActiveReq): Promise<FgLocationsResponse> {
    if (!reqModel.id) {
      throw new ErrorResponse(46009, 'Please provide the location id');
    }
    const locationRec = await this.locationsRepo.findOne({ where: { id: reqModel.id } });
    if (!locationRec) {
      throw new ErrorResponse(46010, 'Location does not exist');
    }
    // check if pallets  put in the location
    // to do 
    const palletsInLocation = []
    // await this.palletLocationMapService.getPalletIdsInLocation(locationRec.id, locationRec.companyCode, locationRec.unitCode);
    if (palletsInLocation.length > 0) {
      throw new ErrorResponse(46011, `${palletsInLocation.length} pallets are present in the location. Cannot be de-activated`);
    }
    // check if trolleys are put in the location
    // to do 
    const trolleysInLocation = []
    // await this.trolleyLocationMapService.getTrolleyIdsForLocation(locationRec.id, locationRec.companyCode, locationRec.unitCode);
    if (trolleysInLocation.length > 0) {
      throw new ErrorResponse(46012, `${trolleysInLocation.length} trolleys are present in the location. Cannot be de-activated`);
    }

    const toggle = await this.locationsRepo.update(
      { id: reqModel.id },
      { isActive: locationRec.isActive == true ? false : true });
    return new FgLocationsResponse(true, locationRec.isActive ? 46013 : 46014, locationRec.isActive ? 'Locations de-activated successfully' : 'Locations activated successfully');
  }

  async getAllLocationData(req: FgLocationFilterReq): Promise<FgLocationsResponse> {
    const records = await this.locationsRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, whId: req.whId }, order: { name: 'ASC', createdAt: 'DESC' } });
    const resultData: FgLocationCreateReq[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      const rackData = await this.rackService.getAllRacksBasicInfo(req.companyCode, req.unitCode);
      const rackObjectMap = new Map<number, string>();
      rackData.forEach((rec) => {
        rackObjectMap.set(rec.id, rec.code);
      });
      records.forEach(data => {
        const eachRow = new FgLocationCreateReq(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.supportedPalletsCount, data.level, data.whId, data.rackId, data.column, data.isActive, data.barcodeId, data.length, data.width, data.height, data.latitude, data.longitude, data.preferredStorageMaterial, rackObjectMap.get(data.rackId));
        resultData.push(eachRow);
      });
    }
    return new FgLocationsResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

  async incrementOccupiedLocationCnts(reqModel: FgLocationActiveReq): Promise<FgLocationsResponse> {
    //const transManager = new GenericTransactionManager(this.dataSource); 
    // await transManager.startTransaction();
    const getRecord = await this.locationsRepo.findOne({ where: { id: reqModel.id } });
    // const toggle = await transManager.getRepository(LLocationEntity).update(
    //let incre=getRecord.levels;
    // ++incre;
    const toggle = await this.locationsRepo.update(
      { id: reqModel.id },
      { level: getRecord.level = (getRecord.level + 1) });

    return new FgLocationsResponse(true, 46015, `Locations ${toggle.affected} Updated Successfully`)

  }

  async incrementOccupiedLocationCnt(locationId: number, updatedUser: string, transManager: GenericTransactionManager): Promise<FgLocationsResponse> {
    const getRecord = await this.locationsRepo.findOne({ where: { id: locationId } });
    if (transManager) {
      const opCount = await transManager.getRepository(FgMLocationEntity).update(
        { id: locationId },
        { level: getRecord.level = (getRecord.level + 1) });
      return new FgLocationsResponse(true, 46085, `Locations ${opCount.affected} Updated Successfully`)
    }
    else {
      const opCount = await this.locationsRepo.update(
        { id: locationId },
        { level: getRecord.level = (getRecord.level + 1) });
      return new FgLocationsResponse(true, 46085, `Locations ${opCount.affected} Updated Successfully`)
    }
  }

  async decrementOccupiedLocationCnt(locationId: number, updateduser: string, transManager: GenericTransactionManager): Promise<FgLocationsResponse> {
    const getRecord = await this.locationsRepo.findOne({ where: { id: locationId } });
    if (transManager) {
      const opCount = await transManager.getRepository(FgMLocationEntity).update(
        { id: locationId },
        { level: getRecord.level = (getRecord.level - 1) });
      return new FgLocationsResponse(true, 46085, `Locations ${opCount.affected} Updated Successfully`)
    }
    else {
      const opCount = await this.locationsRepo.update(
        { id: locationId },
        { level: getRecord.level = (getRecord.level - 1) });
      return new FgLocationsResponse(true, 46085, `Locations ${opCount.affected} Updated Successfully`)
    }
  }

  // HELPER
  async getAllLocationsBasicInfo(companyCode: string, unitCode: string, whId: number, rackId?: number[]): Promise<LocationDetailsModel[]> {
    const locationDetailsModels: LocationDetailsModel[] = [];
    const rackIdInfoMap = new Map<number, FgMRackEntity>();
    let where = {
      whId,
      companyCode,
      unitCode
    }
    if (rackId && rackId?.length != 0)
      where['rackId'] = In(rackId)
    const locations = await this.locationsRepo.find({ where });
    for (const r of locations) {
      // get the rack info also
      if (!rackIdInfoMap.has(r.rackId)) {
        const rackInfo = await this.rackRepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.rackId, isActive: true } });
        rackIdInfoMap.set(r.rackId, rackInfo);
      }
      const rackInfo = rackIdInfoMap.get(r.rackId);
      const locationInfo = new LocationDetailsModel(r.id, r.code, r.barcodeId, r.code, r.supportedPalletsCount, 0, 0, r.rackId, rackInfo.code, r.level, r.column);
      locationDetailsModels.push(locationInfo);
    }
    return locationDetailsModels;
  }

  // HELPER
  async getLocationsBasicInfo(companyCode: string, unitCode: string, locationIds: number[], iNeedTrolleyIds?: boolean): Promise<LocationDetailsModel[]> {
    const locationDetailsModels: LocationDetailsModel[] = [];
    const rackIdInfoMap = new Map<number, FgMRackEntity>();
    const locations = await this.locationsRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(locationIds) } });
    for (const r of locations) {
      // get the rack info also
      if (!rackIdInfoMap.has(r.rackId)) {
        const rackInfo = await this.rackRepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.rackId, isActive: true } });
        rackIdInfoMap.set(r.rackId, rackInfo);
      }
      let trolleyIds: string[] = [];
      if (iNeedTrolleyIds) {
        // to do
        trolleyIds = []
        //  await this.trolleyLocationMapService.getTrolleyIdsForLocation(r.id, companyCode, unitCode);
      }
      const rackInfo = rackIdInfoMap.get(r.rackId);
      const locationInfo = new LocationDetailsModel(r.id, r.code, r.barcodeId, r.code, r.supportedPalletsCount, 0, 0, r.rackId, rackInfo.code, r.level, r.column, trolleyIds);
      locationDetailsModels.push(locationInfo);
    }
    return locationDetailsModels;

  }

  async getAllLocationsDataByRackId(req: FgGetLocationByRackIdReq): Promise<FgGetAllLocationByRackIdRes> {
    const locationsData = await this.locationsRepo.getAllLocationsDataByRackId(req.rackId);
    return new FgGetAllLocationByRackIdRes(true, 46016, "Locations Data Retrieved Successfully",
      locationsData.map(r => new FgGetAllLocationByRackIdDto(r.id, r.rack_code, r.id, r.location_code)));
  }


  async getMappedRackLevelColumn(reqModel: FgRackOccupiedReq): Promise<FgRackOccupiedRes> {
    const rackInfo = await this.rackRepo.findOne({ select: ['levels', 'columns'], where: { id: reqModel.rackId, isActive: true } });
    let resultInfoDataTotals: FgRackOccupiedResModel[] = [];
    let columnsLimit = rackInfo.columns;
    for (let i = 1; i <= rackInfo.levels; i++) {
      const resultData = [];
      let levelStatus = '';
      let colCount = 1;
      const records = await this.locationsRepo.find({ where: { rackId: reqModel.rackId, level: i, isActive: true } });
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
        const resultInfoDataTotal = new FgRackOccupiedResModel(i, columnsLimit, levelStatus, resultData);
        resultInfoDataTotals.push(resultInfoDataTotal);
      } else {
        levelStatus = 'NotFull';
        const resultInfoDataTotal = new FgRackOccupiedResModel(i, columnsLimit, levelStatus, resultData);
        resultInfoDataTotals.push(resultInfoDataTotal);
      }
    }
    return new FgRackOccupiedRes(true, 967, 'Data Retrieved Successfully', resultInfoDataTotals)
  }

  async getLocationsInRack(reqModel: FgRackIdReq): Promise<FgRackAndLocationRes> {
    let LevelsLimit = reqModel.rackLevel;
    const rackAndLocationResponseModel: FgLocationModel[] = [];
    for (let i = 1; i <= LevelsLimit; i++) {
      const records = await this.locationsRepo.find({ where: { rackId: reqModel.rackId, level: i, isActive: true } });
      if (records.length > 0) {
        records.forEach(locationData => {
          const resultInfoDataTotal = new FgLocationModel(locationData.id, locationData.barcodeId, locationData.code, locationData.name, locationData.level, locationData.column, locationData.supportedPalletsCount);
          rackAndLocationResponseModel.push(resultInfoDataTotal);
        });
      }
    }
    return new FgRackAndLocationRes(true, 967, 'Data Retrieved Successfully', rackAndLocationResponseModel)
  }

  async getLocationsForRackLevelAndColumn(reqModel: FgRackIdReq): Promise<FgRackAndLocationRes> {
    const rackAndLocationResponseModel: FgLocationModel[] = [];
    const records = await this.locationsRepo.find({ where: { rackId: reqModel.rackId, level: reqModel.rackLevel, column: reqModel.rackColumn, isActive: true } });
    if (records.length > 0) {
      records.forEach(locationData => {
        const resultInfoDataTotal = new FgLocationModel(locationData.id, locationData.barcodeId, locationData.code, locationData.name, locationData.level, locationData.column, locationData.supportedPalletsCount);
        rackAndLocationResponseModel.push(resultInfoDataTotal);
      });

    }
    return new FgRackAndLocationRes(true, 967, 'Data Retrieved Successfully', rackAndLocationResponseModel)
  }

  // HELPER
  async getLocationsByIds(locationIds: number[], companyCode: string, unitCode: string): Promise<LocationDetailsModel[]> {
    if (locationIds.length == 0) {
      return [];
    }
    const locationDetailsModels: LocationDetailsModel[] = [];
    const locations = await this.locationsRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(locationIds) } });
    for (const r of locations) {
      const rackInfo = await this.rackRepo.findOne({ select: ['code', 'barcodeId'], where: { id: r.rackId, isActive: true, companyCode: companyCode, unitCode: unitCode } });
      const locationInfo = new LocationDetailsModel(r.id, r.code, r.barcodeId, r.code, r.supportedPalletsCount, 0, 0, r.rackId, rackInfo.code, r.level, r.column);
      locationDetailsModels.push(locationInfo);
    }
    return locationDetailsModels;
  }

  async getLocationRecordById(locationId: number, companyCode: string, unitCode: string): Promise<FgMLocationEntity> {
    return await this.locationsRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: locationId } });
  }

  /**
   * this service will return the Locations of the mentioned racks and mentioned levels.
   * 1.If rack ids provided and no levels provided, then we will retrieve all the locations of all levels
   * 2. If only levels are provided, then we will retrieve all the locations of all levels of all the racks
   * 3. If both levels and rack ids are provided, then we will retrieve locations of rack + level comlocationations
   * @returns 
   */
  async getSpecificLevelLocationsOfAllRacks(req: FgRackIdsAndLevelsReq): Promise<FgTotalRackRes> {
    // take ref of getLocationsInRack
    const rackIds = req.rackIds ?? [];
    const levels = req.levels ?? [];
    // get the racks based on the request
    const racksRecs = await this.rackService.getRackRecordsByRackIds(rackIds, req.companyCode, req.unitCode);
    if (racksRecs.length == 0) {
      throw new ErrorResponse(46017, 'Racks does not exist');
    }
    const rackLocationModels: FgRacksAndLocationModel[] = [];
    // for each rack get the locations based on the levels
    for (const rack of racksRecs) {
      let locationRecs: FgMLocationEntity[] = [];
      let locationModels: FgLocationModel[] = [];
      if (levels.length > 0) {
        locationRecs = await this.locationsRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, rackId: rack.id, level: In(levels) } });
      } else {
        locationRecs = await this.locationsRepo.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode, rackId: rack.id } });
      }
      locationRecs.forEach(locationData => {
        const locationModel = new FgLocationModel(locationData.id, locationData.barcodeId, locationData.code, locationData.name, locationData.level, locationData.column, locationData.supportedPalletsCount);
        locationModels.push(locationModel);
      });
      const rackLocationModel = new FgRacksAndLocationModel(rack.id, rack.barcodeId, rack.code, rack.name, rack.levels, rack.columns, locationModels);
      rackLocationModels.push(rackLocationModel);
    }
    return new FgTotalRackRes(true, 46018, 'Rack and locations info retrieved', rackLocationModels);
  }


  async getTotalAndEmptyContainerCountForLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<LocationRelatedDataQryResp[]> {
    return await this.containerLocationMapService.getTotalAndEmptyContainerCountForLocationIds(locationIds, companyCode, unitCode);
  }
}