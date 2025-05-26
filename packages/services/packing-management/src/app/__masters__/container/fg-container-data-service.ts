import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonIdReqModal, FgContainerBehaviorEnum, FgContainerCreateRequest, FgContainerCreationModel, FgContainerResponse, FgContainersActivateReq, FgContainersDetailsModel, FgContainerStatusChangeRequest, FgContainerTypePrefixes, FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum, WeareHouseDropDownModel, WeareHouseDropDownResponse } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { GenericTransactionManager } from '../../../database/typeorm-transactions';
import { SequenceHandlingService } from '../../__common__/sequence-handling/sequence-handling.service';
import { FgMLocationEntity } from '../location/entities/fgm-location.entity';
import { FgContainerAdapter } from './dto/fg-container-adapter';
import { FgMContainerEntity } from './entities/fgm-container.entity';
import { FgMContainerRepo } from './repositories/fgm-container-Repo';

@Injectable()
export class FgContainerDataService {
  constructor(
    private dataSource: DataSource,
    private containerRepo: FgMContainerRepo,
    private containerAdapter: FgContainerAdapter,
    public sequenceHandlingService: SequenceHandlingService,
  ) {

  }
  async createContainers(reqModel: FgContainerCreateRequest): Promise<FgContainerResponse> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      if (reqModel.code) {
        const findRecord = await this.containerRepo.findOne({ select: ['id'], where: { containerCode: reqModel.code } });
        if (findRecord && findRecord.id !== reqModel.id) {
          throw new ErrorResponse(46086, "Container Code already exists.");
        }
      }
      if (reqModel.name) {
        const findRecordByName = await this.containerRepo.findOne({ where: { containerName: reqModel.name } });
        if (findRecordByName && findRecordByName.id !== reqModel.id) {
          throw new ErrorResponse(805, "Container Name already exists.");
        }
      }
      const entity = this.containerAdapter.convertDtoToEntity(reqModel);
      await transManager.startTransaction();
      if (reqModel.currentLocationId) {
        const location = await transManager.getRepository(FgMLocationEntity).findOne({ where: { id: reqModel.currentLocationId } });
        entity.rackId = location.rackId;
      }

      const saveData = await transManager.getRepository(FgMContainerEntity).save(entity);
      const prefix = `${FgContainerTypePrefixes[reqModel.type]}-`;
      // const requestNo = await this.sequenceHandlingService.getSequenceNumber(prefix, transManager)
      const insertedId = saveData.id.toString().padStart(4, '0');
      const barcodeIds = prefix.concat(insertedId);
      await transManager.getRepository(FgMContainerEntity).update({ id: saveData.id }, { barcodeId: barcodeIds });
      const rec = new FgContainerCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.id, saveData.isActive, saveData.containerName, saveData.containerCode, saveData.weightCapacity, saveData.weightUom, saveData.currentLocationId, saveData.currentContainerState, saveData.currentContainerLocation, saveData.containerBehavior, saveData.freezeStatus, saveData.maxItems, barcodeIds);
      await transManager.completeTransaction();
      return new FgContainerResponse(true, reqModel?.id ? 46019 : 46020, `Containers ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec]);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }

  }

  async ActivateDeactivateContainers(reqModel: FgContainersActivateReq): Promise<FgContainerResponse> {
    const getRecord = await this.containerRepo.findOne({ where: { id: reqModel.id } });

    const toggle = await this.containerRepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new FgContainerResponse(true, getRecord.isActive ? 46021 : 46022, getRecord.isActive ? 'Containers de-activated successfully' : 'Containers activated successfully');
  }

  async getAllContainersData(req: CommonIdReqModal): Promise<FgContainerResponse> {
    const records = await this.containerRepo.find({ where: { unitCode: req.unitCode, whId: req.id }, order: { createdAt: 'DESC' } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new FgContainerCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.containerName, data.containerCode, data.weightCapacity, data.weightUom, data.currentLocationId, data.currentContainerState, data.currentContainerLocation, data.containerBehavior, data.freezeStatus, data.isActive, data.maxItems, data.barcodeId, data.containerType, data.length, data.lengthUom, data.width, data.widthUom, data.height, data.heightUom, data.whId, data.rackId);
        resultData.push(eachRow);
      });
    }
    return new FgContainerResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

  async getWhereHouseCodeDropdown(): Promise<WeareHouseDropDownResponse> {
    const records = await this.containerRepo.getWarehouseCodeDropdown();
    const resultData = []

    if (records.length === 0) {
      throw new ErrorResponse(965, 'data not found')
    } else {
      records.forEach(data => {
        const eachRow = new WeareHouseDropDownModel(data.whId, data.code);
        resultData.push(eachRow)
      });
    }
    return new WeareHouseDropDownResponse(true, 967, 'Data Retrieved  SuccessFully', resultData)

  }

  // HELPER
  // NEVER USE THIS FUNCITON DIRECTLY FOR DETAIL INFO END POINTS
  async getAllContainersBasicInfo(companyCode: string, unitCode: string, whId: number, rackId?: number[], locationId?: number[]): Promise<FgContainersDetailsModel[]> {
    let where = {
      companyCode,
      unitCode
    }
    if (whId) {
      where['whId'] = whId
    }
    if (rackId && rackId?.length != 0)
      where['rackId'] = In(rackId)
    if (locationId && locationId?.length != 0)
      where['currentLocationId'] = In(locationId);
    const containers = await this.containerRepo.find({ where });
    console.log(containers)
    const containerDetails: FgContainersDetailsModel[] = [];
    containers.forEach(p => {
      const containerInfo = new FgContainersDetailsModel(p.createdUser, unitCode, companyCode, 0, p.barcodeId, p.id, p.containerCode, p.weightCapacity, p.weightUom, p.maxItems, null, p.currentContainerLocation, p.currentContainerState, 0, 0, 0, 0, null, null);
      containerDetails.push(containerInfo);
    });
    return containerDetails;
  }

  // HELPER
  // OVERRIDE status in the HELPER of the calleee
  // NEVER USE THIS FUNCITON DIRECTLY FOR DETAIL INFO END POINTS
  async getContainersBasicInfo(companyCode: string, unitCode: string, containerIds: number[]): Promise<FgContainersDetailsModel[]> {
    const containers = await this.containerRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, id: In(containerIds) } });
    const containerDetails: FgContainersDetailsModel[] = [];
    if (containers.length == 0) {
      throw new ErrorResponse(46023, 'No container info found');
    }
    containers.forEach(p => {
      // The status null here is updated in the helper
      const containerInfo = new FgContainersDetailsModel(p.createdUser, unitCode, companyCode, 0, p.barcodeId, p.id, p.containerCode, p.weightCapacity, p.weightUom, p.maxItems, null, p.currentContainerLocation, p.currentContainerState, 0, 0, 0, 0, null, null);
      containerDetails.push(containerInfo);
    });
    return containerDetails;
  }

  async updateContainerLocationState(companyCode: string, unitCode: string, containerIds: number[], locationState: FgCurrentContainerLocationEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    if (transManager) {
      await transManager.getRepository(FgMContainerEntity).update({ companyCode: companyCode, unitCode: unitCode, id: In(containerIds) }, { currentContainerLocation: locationState, updatedUser: username });
    } else {
      await this.containerRepo.update({ companyCode: companyCode, unitCode: unitCode, id: In(containerIds) }, { currentContainerLocation: locationState, updatedUser: username });
    }
    return true;
  }

  async updateContainerLocWorkBehState(companyCode: string, unitCode: string, containerIds: number[], locationState: FgCurrentContainerLocationEnum, behaviourStatus: FgContainerBehaviorEnum, workStatus: FgCurrentContainerStateEnum, username: string, transManager: GenericTransactionManager): Promise<boolean> {
    if (transManager) {
      await transManager.getRepository(FgMContainerEntity).update({ companyCode: companyCode, unitCode: unitCode, id: In(containerIds) }, { currentContainerLocation: locationState, currentContainerState: workStatus, containerBehavior: behaviourStatus, updatedUser: username });
    } else {
      await this.containerRepo.update({ companyCode: companyCode, unitCode: unitCode, id: In(containerIds) }, { currentContainerLocation: locationState, currentContainerState: workStatus, containerBehavior: behaviourStatus, updatedUser: username });
    }
    return true;
  }

  // async getEmptyContainerDetails(): Promise<EmptyContainerLocationResponse> {
  //   const result = await this.lContainerRepo.getEmptyContainerDetails();
  //   return new EmptyContainerLocationResponse(true, retrieved, 'Data retrieved successfully', result);
  // }d

  async updateContainerLocationStatus(reqModel: FgContainerStatusChangeRequest, externalManager?: GenericTransactionManager): Promise<boolean> {
    const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
    if (transManager) {
      await transManager.getRepository(FgMContainerEntity).update({ companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.containerId }, { currentContainerLocation: reqModel.currentContainerLocation, currentContainerState: reqModel.currentContainerState, containerBehavior: reqModel.containerBehavior, updatedUser: reqModel.username });
    } else {
      await this.containerRepo.update({ companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.containerId }, { currentContainerLocation: reqModel.currentContainerLocation, currentContainerState: reqModel.currentContainerState, containerBehavior: reqModel.containerBehavior, updatedUser: reqModel.username });
    }
    return true;
  }
}


