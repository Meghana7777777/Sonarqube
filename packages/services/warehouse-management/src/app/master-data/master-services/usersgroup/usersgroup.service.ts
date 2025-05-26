import { Injectable } from '@nestjs/common';
import { CommonRequestAttrs,UsersResponse, UsersCreateRequest, UsersCreationModel, UsersActivateRequest} from '@xpparel/shared-models';
import { UserGroupEntityRepo } from '../../repositories/user-group.repository';
import { UsersGroupAdapter } from '../../dtos/usersgroup-create-adapter';
import { ErrorResponse } from '@xpparel/backend-utils';



@Injectable()
export class UsersGroupDataService {
  constructor(
    private usersrepo: UserGroupEntityRepo,
    private usersadapter: UsersGroupAdapter
    ) {

  }
async createUsersGroup(reqModel: UsersCreateRequest): Promise<UsersResponse> {
  if (reqModel.groupName) {
    const findRecord= await this.usersrepo.findOne({where :{groupName:reqModel.groupName}});
    if (findRecord) {
      if (findRecord.groupName !== reqModel.groupName) {
        throw new ErrorResponse(6191, "Someone Already Modified This Record please Refresh And Continue")
      }
    }
  }
  const entity = this.usersadapter.convertDtoToEntity(reqModel);
  const saveData = await this.usersrepo.save(entity);
  const rec = new UsersCreationModel(reqModel.username,reqModel.unitCode,reqModel.companyCode,reqModel.userId,saveData.groupName,saveData.userId);
  return new UsersResponse(true, 6192, `UserGroups ${reqModel.id ? "Updated" : "Created"} Successfully`, [rec])
  
}
async ActivateDeactivateUserGroups(reqModel: UsersActivateRequest): Promise<UsersResponse> {
const getRecord = await this.usersrepo.findOne({where :{id:reqModel.id}});
    
  const toggle = await this.usersrepo.update(
    { id: reqModel.id },
    { isActive: getRecord.isActive==true ? false:true});
    return new UsersResponse(true, getRecord.isActive ? 0 : 1, getRecord.isActive ? 'UserGroups de-activated successfully' : 'UserGroups activated successfully');

}

async getAllUserGroupsData(req:CommonRequestAttrs): Promise<UsersResponse> {

  const records = await this.usersrepo.find({where :{unitCode:req.unitCode}});
  const resultData = [];
  if (records.length === 0) {
      throw new ErrorResponse(965, "Data Not Found")
  } else {
      records.forEach(data => {
          const eachRow = new UsersCreateRequest(req.username,req.unitCode,req.companyCode,req.userId,data.id,data.groupName,data.userId,data.isActive);
          resultData.push(eachRow);
      });
  }
  return new UsersResponse(true, 967, 'Data Retrieved Successfully', resultData)
}
}


