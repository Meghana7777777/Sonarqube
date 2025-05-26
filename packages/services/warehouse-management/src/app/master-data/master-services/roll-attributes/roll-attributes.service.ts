import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs, InsReasonsActivateRequest, RollAttributesCreateRequest, RollAttributesResponse, RollAttributesCreationModel } from '@xpparel/shared-models';
import { ErrorResponse } from '@xpparel/backend-utils';
import { RollAttributesRepo } from '../../repositories/roll-attributes.repositry';
import { RollAttributesAdapter } from '../../dtos/rolls-attributes.adapter';



@Injectable()
export class RollAttributesDataService {
  constructor(
    private rollattributesrepo: RollAttributesRepo,
    private rollattributesadapter: RollAttributesAdapter,
    ) {}
    
async createRollAttributes(reqModel: RollAttributesCreateRequest): Promise<RollAttributesResponse> {
  if (reqModel.name) {
    const findRecord= await this.rollattributesrepo.findOne({where :{name:reqModel.name}});
    if (findRecord) {
      if (findRecord.name !== reqModel.name) {
        throw new ErrorResponse(6151, "Someone Already Modified This Record please Refresh And Continue")
      }
    }
  }
  const entity = this.rollattributesadapter.convertDtoToEntity(reqModel);
  const saveData = await this.rollattributesrepo.save(entity);
  const rec = new RollAttributesCreationModel(reqModel.username,reqModel.unitCode,reqModel.companyCode,reqModel.userId,saveData.name,saveData.code);
  return new RollAttributesResponse(true, 6152, `Roll Atrributes ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec])
  
}
async ActivateDeactivateRollAttributes(reqModel: InsReasonsActivateRequest): Promise<RollAttributesResponse> {
const getRecord = await this.rollattributesrepo.findOne({where :{id:reqModel.id}});
    
  const toggle = await this.rollattributesrepo.update(
    { id: reqModel.id },
    { isActive: getRecord.isActive==true ? false:true});
    return new RollAttributesResponse(true, getRecord.isActive ? 0 :6153 , getRecord.isActive ? 'Roll Atrributes de-activated successfully' : 'Roll Atrributes activated successfully');

}

async getAllRRollAttributesData(req:CommonRequestAttrs): Promise<RollAttributesResponse> {

  const records = await this.rollattributesrepo.find({where :{unitCode:req.unitCode}});
  const resultData = [];
  if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
  } else {
      records.forEach(data => {         
          const eachRow = new RollAttributesCreateRequest(req.username,req.unitCode,req.companyCode,req.userId,data.id,data.name,data.code,data.isActive);
          resultData.push(eachRow);
      });
  }
  return new RollAttributesResponse(true, 967, 'Data Retrieved Successfully', resultData)
}


}


