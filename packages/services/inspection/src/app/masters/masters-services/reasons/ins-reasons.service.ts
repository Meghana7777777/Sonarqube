import { Injectable } from '@nestjs/common';
import { IReasonRepo } from '../../repositories/i-reason.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ReasonsAdapter } from '../../dto/reasons-create.adapter';
import { IReasonEntity } from '../../entity/i-reason.entity';
import { InsMasterReasonsCreateRequest, InsMasterReasonsResponse, InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreationModel, InsReasonsResponse } from '@xpparel/shared-models';

@Injectable()
export class ReasonsDataService {
  constructor(
    private reasonsrepo: IReasonRepo,
    private reasonsadapter: ReasonsAdapter,
  ) { }

  async insCreateReasons(reqModel: InsMasterReasonsCreateRequest): Promise<InsReasonsResponse> {
    let entity;
    if (reqModel.id) {
      entity = await this.reasonsrepo.findOne({ where: { id: reqModel.id } });
      if (!entity) {
        throw new ErrorResponse(404, `Reason with ID ${reqModel.id} not found`);
      }

      // Check for duplicate name/code for the same insType (excluding self)
      if (reqModel.code) {
        const existingByCode = await this.reasonsrepo.findOne({ where: { code: reqModel.code, insType: reqModel.insType } });
        if (existingByCode && existingByCode.id !== reqModel.id) {
          throw new ErrorResponse(54585, "Reason Code already exists");
        }
      }

      if (reqModel.name) {
        const existingByName = await this.reasonsrepo.findOne({ where: { name: reqModel.name, insType: reqModel.insType } });
        if (existingByName && existingByName.id !== reqModel.id) {
          throw new Error(`Reason with name ${reqModel.name} already exists.`);
        }
      }

      // Update the existing entity
      entity = Object.assign(entity, reqModel);
    }
    // CREATE FLOW
    else {
      if (reqModel.code) {
        const existingByCode = await this.reasonsrepo.findOne({ where: { code: reqModel.code, insType: reqModel.insType } });
        if (existingByCode) {
          throw new ErrorResponse(54585, "Reason Code already exists");
        }
      }
      if (reqModel.name) {
        const existingByName = await this.reasonsrepo.findOne({ where: { name: reqModel.name, insType: reqModel.insType } });
        if (existingByName) {
          throw new Error(`Reason with name ${reqModel.name} already exists.`);
        }
      }
      entity = this.reasonsadapter.convertMasterDtoToEntity(reqModel);
    }

    const saveData = await this.reasonsrepo.save(entity);

    const rec = new InsReasonsCreationModel(reqModel.username,reqModel.unitCode,reqModel.companyCode,reqModel.userId,saveData.id,saveData.name,saveData.code,saveData.extCode,saveData.pointValue,saveData.category);

    return new InsReasonsResponse(true,85552,`Reason ${reqModel.id ? "Updated" : "Created"} Successfully`,[rec]);
  }


  async insActivateDeactivateReasons(reqModel: InsReasonsActivateRequest): Promise<InsReasonsResponse> {
    const getRecord = await this.reasonsrepo.findOne({ where: { id: reqModel.id } });

    const toggle = await this.reasonsrepo.update(
      { id: reqModel.id },
      { isActive: getRecord.isActive == true ? false : true });
    return new InsReasonsResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'Reasons de-activated successfully' : 'Reasons activated successfully');

  }

  async insGetAllReasonsData(req: InsReasonsCategoryRequest): Promise<InsMasterReasonsResponse> {
    let records: IReasonEntity[] = [];
    if (req.category) {
      records = await this.reasonsrepo.find({ where: { unitCode: req.unitCode, category: req.category } });
    } else {
      records = await this.reasonsrepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode, insType: req.insType } });
    }
    const resultData = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Data Not Found")
    }
    records.forEach(data => {
      const eachRow = new InsMasterReasonsCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.extCode, data.pointValue, data.category, data.isActive, data.insType, data.reasonName, data.reasonDesc);
      resultData.push(eachRow);
    });
    return new InsMasterReasonsResponse(true, 967, 'Data Retrieved Successfully', resultData)
  }


  /**
   * 
   * @param req 
   * @returns 
   */
  async insGetReasonsAgainstCategory(req: InsReasonsCategoryRequest): Promise<InsReasonsResponse> {
    try {
      if (!req.category) {
        throw new ErrorResponse(0, 'Reason is not provided');
      }
      const records: IReasonEntity[] = await this.reasonsrepo.find({
        where: {
          unitCode: req.unitCode, companyCode: req.companyCode, category: req.category
        }
      });
      if (records.length === 0) {
        throw new ErrorResponse(55681, "Data Not Found");
      }
      const resultData = records.map(data => {
        return new InsMasterReasonsCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, data.id, data.name, data.code, data.extCode, data.pointValue, data.category, data.isActive, data.insType, data.reasonName, data.reasonDesc);
      });
      return new InsReasonsResponse(true, 85553, 'Data Retrieved Successfully', resultData);
    } catch (error) {
      console.error("Error fetching reasons:", error);
      throw error;
    }
  }
  
}





