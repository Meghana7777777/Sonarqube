import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { CommonRequestAttrs, FabricUOM, FgGetAllRackResp, FgLocationCreateReq, FgRackCreateReq, FgRackCreationModel, FgRackFilterRequest, FgRacksActivateReq, FgRacksRespons } from "@xpparel/shared-models";
import { FgRacksRepository } from "./repository/fg-racks-repository";
import { FgRacksAdapter } from "./dto/racks-create.adpter";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgMRackEntity } from "./entity/fg-m-rack.entity";
import { FgLocationsService } from "../location/fg-location.services";
@Injectable()
export class FgRacksService {
  constructor(
    private dataSource: DataSource,
    private rackrepo: FgRacksRepository,
    private rackAdapter: FgRacksAdapter,
    private locationService: FgLocationsService

  ) { }
  async createRacks(reqModel: FgRackCreateReq): Promise<FgRacksRespons> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (reqModel.code) {
        const findRecord = await this.rackrepo.findOne({ where: { code: reqModel.code } });
        if (findRecord && findRecord.id !== reqModel.id) {
          throw new ErrorResponse(46001, "Rack Code already available please check.");
        }
      }
      if (reqModel.name) {
        const findRecordByName = await this.rackrepo.findOne({ where: { name: reqModel.name } });
        if (findRecordByName && findRecordByName.id !== reqModel.id) {
          throw new Error(`Rack with name ${reqModel.name} already exists.`);
        }
      }
      const entity = this.rackAdapter.convertDtoToEntity(reqModel);
      await transManager.startTransaction();
      const saveData = await transManager.getRepository(FgMRackEntity).save(entity);
      const insertedId = saveData.id.toString().padStart(4, '0');
      const barcodeIds = "RCK-".concat(reqModel.code);
      const updateBarcode = await transManager.getRepository(FgMRackEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      if (reqModel.createLocations) {
        for (let col = 1; col <= reqModel.columns; col++) {
          for (let level = 1; level <= reqModel.levels; level++) {
            const req = new FgLocationCreateReq(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, undefined,
              `${reqModel.code}/${col}/${level}`,
              `${reqModel.code}/${col}/${level}`,
              2,
              level,
              saveData.whId,
              saveData.id,
              col,
              true,
              undefined,
              reqModel.length,
              reqModel.width,
              reqModel.height / level,
              reqModel.latitude,
              reqModel.longitude,
              reqModel.preferredStorageMaterial,
              reqModel.code
            )
            await this.locationService.createLocations(req, transManager, (col === 1 && level === 1));
          }
        }

      }

      await transManager.completeTransaction();

      const rec = new FgRackCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.id, saveData.name, saveData.code, saveData.levels, saveData.weightCapacity, saveData.weightUom, saveData.whId, saveData.columns, saveData.length, saveData.width, saveData.height, saveData.latitude, saveData.longitude, saveData.preferredStorageMaterial, saveData.priority, /*saveData.capacity,*/barcodeIds);

      return new FgRacksRespons(true, reqModel?.id ? 46002 : 46003 , `Rack ${reqModel.id ? "Updated" : "Created"} Successfully`)
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }
  async activateDeactivateRacks(reqModel: FgRacksActivateReq): Promise<FgRacksRespons> {
    const getRecord = await this.rackrepo.findOne({ where: { id: reqModel.id } });
    const toggle = await this.rackrepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new FgRacksRespons(true, getRecord.isActive ? 46004 :46005, getRecord.isActive ? 'Racks de-activated successfully' : 'Racks activated successfully');

  }

  async getAllRacksData(req: FgRackFilterRequest): Promise<FgRacksRespons> {
    const records = await this.rackrepo.getAllRacksData(req);
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        // console.log('data',data)
        const eachRow = new FgRackCreateReq(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.levels, data.weight_capacity, data.weight_uom, data.floor, data?.whId, data?.desc, data.columns, data.preferred_storage_material, data.priority, data.length, data.length_uom, data.width, data.width_uom, data.height, data.height_uom, data.latitude, data.longitude, data.is_active == 1 ?true :false , data.barcode_id);

        resultData.push(eachRow);
      });
    }
    return new FgRacksRespons(true, 967, 'Data Retrieved Successfully', resultData)
  }
    
  async getRacksData(req: FgRackFilterRequest): Promise<FgRacksRespons> {
    const records = await this.rackrepo.getAllRacksData(req);
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        // console.log('data',data)
        const eachRow = new FgRackCreateReq(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.levels, data.weight_capacity, data.weight_uom, data.floor, data?.whId, data?.desc, data.columns, data.preferred_storage_material, data.priority, data.length, data.length_uom, data.width, data.width_uom, data.height, data.height_uom, data.latitude, data.longitude, data.is_active == 1 ?true :false , data.barcode_id);

        resultData.push(eachRow);
      });
    }
    return new FgRacksRespons(true, 967, 'Data Retrieved Successfully', resultData)
  }

  // HELPER
  async getAllRacksBasicInfo(companyCode: string, unitCode: string): Promise<FgRackCreationModel[]> {
    const rackModels: FgRackCreationModel[] = [];
    const racks = await this.rackrepo.find({ where: { unitCode: unitCode, companyCode: companyCode, isActive: true } });
    racks.forEach(r => {
      const rack = new FgRackCreationModel(r.createdUser, unitCode, companyCode, 0, r.id, r.name, r.code, r.levels, r.weightCapacity, r.weightUom, r.whId, r.columns, r.length, r.width, r.height, r.latitude, r.longitude, r.preferredStorageMaterial, r.priority,/*r.capacity,*/ r.barcodeId);
      rackModels.push(rack);
    });
    return rackModels;
  }

  // HELPER
  async getRacksBasicInfo(companyCode: string, unitCode: string, rackIds: number[]): Promise<FgRackCreationModel[]> {
    const rackModels: FgRackCreationModel[] = [];
    const racks = await this.rackrepo.find({ where: { unitCode: unitCode, companyCode: companyCode, id: In(rackIds), isActive: true } });
    racks.forEach(r => {
      const rack = new FgRackCreationModel(r.createdUser, unitCode, companyCode, 0, r.id, r.name, r.code, r.levels, r.weightCapacity, r.weightUom, r.whId, r.columns, r.length, r.width, r.height, r.latitude, r.longitude, r.preferredStorageMaterial, r.priority, /*r.capacity,*/r.barcodeId);
      rackModels.push(rack);
    });
    return rackModels;
  }
async getAllRacksDataDropdown(companyCode: string, unitCode: string, whId: number, rackId?: number[]): Promise<FgGetAllRackResp> {
    let where = {
      companyCode,
      unitCode
    }
    if (whId) {
      where['whId'] = whId
    }
    if (rackId && rackId?.length != 0)
      where['rackId'] = In(rackId)
    const racksData: any = await this.rackrepo.find({ where })
   return new FgGetAllRackResp(true, 967, "Racks Data Retrieved Successfully", racksData)
  }
async getRackRecordsByRackIds(rackIds: number[], companyCode: string, unitCode: string): Promise<FgMRackEntity[]> {
    if (rackIds.length > 0) {
      return await this.rackrepo.find({ where: { companyCode: companyCode, unitCode: unitCode } });
    } else {
      return await this.rackrepo.find({ where: { companyCode: companyCode, unitCode: unitCode } });
    }
  }
}