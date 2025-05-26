import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs, MoversCreateRequest, MoversResponse, MoversCreationModel, MoversActivateRequest } from '@xpparel/shared-models';
import { MoversAdapter } from '../../dtos/mover-create.adapter';
import { MoverRepo } from '../../repositories/mover.repository';
import { ErrorResponse } from '@xpparel/backend-utils';



@Injectable()
export class MoversDataService {
  constructor(
    private moversrepo: MoverRepo,
    private moversadapter: MoversAdapter
  ) {

  }

  async createMovers(reqModel: MoversCreateRequest): Promise<MoversResponse> {
    if (reqModel.code) {
      const findRecord = await this.moversrepo.findOne({ where: { code: reqModel.code } });
      if (findRecord) {
        throw new ErrorResponse(6134, "Movers Code already available please check")
      }
    }
    if (reqModel.name) {
      const findRecordByName = await this.moversrepo.findOne({ where: { name: reqModel.name } });
      if (findRecordByName) {
        throw new Error(`Mover with name ${reqModel.name} already exists.`);
      }
    }
    const entity = this.moversadapter.convertDtoToEntity(reqModel);
    const saveData = await this.moversrepo.save(entity);
    const rec = new MoversCreationModel(reqModel.username, reqModel.unitCode, reqModel.companyCode, reqModel.userId, saveData.name, saveData.code, saveData.capacity, saveData.uom);
    return new MoversResponse(true, 6135, `Movers ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec])

  }
  async ActivateDeactivateMovers(reqModel: MoversActivateRequest): Promise<MoversResponse> {
    const getRecord = await this.moversrepo.findOne({ where: { id: reqModel.id } });

    const toggle = await this.moversrepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new MoversResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'Movers de-activated successfully' : 'Movers activated successfully');

  }

  async getAllMoversData(req: CommonRequestAttrs): Promise<MoversResponse> {

    const records = await this.moversrepo.find({ where: { unitCode: req.unitCode } });
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
    } else {
      records.forEach(data => {
        const eachRow = new MoversCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.capacity, data.uom, data.isActive);
        resultData.push(eachRow);
      });
    }
    return new MoversResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }

}


