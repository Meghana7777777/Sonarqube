import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs, GetAllRacksResp, RacksActivateRequest, RacksCreateRequest, RacksCreationModel, RacksResponse } from '@xpparel/shared-models';
import { LRackRepo } from '../../repositories/l-rack.repository';
import { RacksAdapter } from '../../dtos/racks-create.adpter';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from 'packages/services/warehouse-management/src/database/typeorm-transactions';
import { LRackEntity } from '../../entities/l-rack.entity';



@Injectable()
export class RacksDataService {
  constructor(
    private dataSource: DataSource,
    private rackrepo: LRackRepo,
    private rackAdapter: RacksAdapter,

  ) { }
  async createRacks(reqModel: RacksCreateRequest): Promise<RacksResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (reqModel.code) {
        const findRecord = await this.rackrepo.findOne({ where: { code: reqModel.code } });
        if (findRecord && findRecord.id !== reqModel.id) {
          throw new ErrorResponse(6143, "Rack Code already available please check.");
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
      const saveData = await transManager.getRepository(LRackEntity).save(entity);
      const insertedId = saveData.id.toString().padStart(4, '0');
      const barcodeIds = "RCK-".concat(reqModel.code);
      const updateBarcode = await transManager.getRepository(LRackEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      await transManager.completeTransaction();

      const rec = new RacksCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.id, saveData.name, saveData.code, saveData.levels, saveData.wCode, saveData.columns, saveData.prefferedStorageMaterial, saveData.priority, barcodeIds, saveData.capacityInMts);

      return new RacksResponse(true, 6144, `Rack ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec])
    } catch (err) {
      await transManager.releaseTransaction();
      throw err;
    }
  }
  async activateDeactivateRacks(reqModel: RacksActivateRequest): Promise<RacksResponse> {
    const getRecord = await this.rackrepo.findOne({ where: { id: reqModel.id } });
    const toggle = await this.rackrepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new RacksResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'Racks de-activated successfully' : 'Racks activated successfully');

  }

  async getAllRacksData(req: CommonRequestAttrs): Promise<RacksResponse> {
    const records = await this.rackrepo.find({ where: { unitCode: req.unitCode } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {

        const eachRow = new RacksCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.levels, data.wCode, data.columns, data.prefferedStorageMaterial, data.priority, data.isActive, data.barcodeId, data.capacityInMts);
        resultData.push(eachRow);
      });
    }
    return new RacksResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }


  // HELPER
  async getAllRacksBasicInfo(companyCode: string, unitCode: string): Promise<RacksCreationModel[]> {
    const rackModels: RacksCreationModel[] = [];
    const racks = await this.rackrepo.find({ where: { unitCode: unitCode, companyCode: companyCode, isActive: true } });
    racks.forEach(r => {
      const rack = new RacksCreationModel(r.createdUser, unitCode, companyCode, 0, r.id, r.name, r.code, r.levels, r.wCode, r.columns, r.prefferedStorageMaterial, r.priority, r.barcodeId,r.capacityInMts);
      rackModels.push(rack);
    });
    return rackModels;
  }

  // HELPER
  async getRacksBasicInfo(companyCode: string, unitCode: string, rackIds: number[]): Promise<RacksCreationModel[]> {
    const rackModels: RacksCreationModel[] = [];
    const racks = await this.rackrepo.find({ where: { unitCode: unitCode, companyCode: companyCode, id: In(rackIds), isActive: true } });
    racks.forEach(r => {
      const rack = new RacksCreationModel(r.createdUser, unitCode, companyCode, 0, r.id, r.name, r.code, r.levels, r.wCode, r.columns, r.prefferedStorageMaterial, r.priority, r.barcodeId,r.capacityInMts);
      rackModels.push(rack);
    });
    return rackModels;
  }

  async getAllRacksDataa(): Promise<GetAllRacksResp> {
    const racksData: any = await this.rackrepo.getAllRacksDataa()
    return new GetAllRacksResp(true, 6147, "Racks Data Retrived Successfully", racksData)
  }

  async getRackRecordsByRackIds(rackIds: number[], companyCode: string, unitCode: string): Promise<LRackEntity[]> {
    if(rackIds.length > 0) {
      return await this.rackrepo.find({ where: { companyCode: companyCode, unitCode: unitCode }});
    } else {
      return await this.rackrepo.find({ where: { companyCode: companyCode, unitCode: unitCode }});
    }
  }
}

