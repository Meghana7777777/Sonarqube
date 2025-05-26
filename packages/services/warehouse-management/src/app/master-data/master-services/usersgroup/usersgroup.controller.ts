import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, UsersActivateRequest, UsersCreateRequest, UsersResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { UsersGroupDataService } from './usersgroup.service';



@ApiTags('Users Group Module')
@Controller('usersgroup')
export class UsersGroupDataController {
  constructor(private readonly usersDataService: UsersGroupDataService) {}

  @Post('/createUsersGroup')
  async createUsersGroup(@Body() reqModel: UsersCreateRequest): Promise<UsersResponse> {
    try {
      return await this.usersDataService.createUsersGroup(reqModel);
    } catch (error) {
      return returnException(UsersResponse,error)
    }
  }
  @Post('/ActivateDeactivateUserGroups')
  async ActivateDeactivateUserGroups(@Body() reqModel: UsersActivateRequest): Promise<UsersResponse> {
    try {
      return await this.usersDataService.ActivateDeactivateUserGroups(reqModel);
    } catch (error) {
      return returnException(UsersResponse,error)
    }
  }

  @Post('/getAllUserGroupsData')
  async getAllUserGroupsData(@Body() reqModel:CommonRequestAttrs): Promise<UsersResponse>{
      try{
          return await this.usersDataService.getAllUserGroupsData(reqModel);
      }catch(error){
          return returnException(UsersResponse, error)
      }
  }
  
}
