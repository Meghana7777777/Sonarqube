import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { FgContainerCreateRequest, FgContainerResponse, FgContainersActivateReq, CommonIdReqModal, WeareHouseDropDownResponse } from "@xpparel/shared-models";
import { FgContainerDataService } from "./fg-container-data-service";
 




@ApiTags('Container')
@Controller('container')
export class FgContainerDataController {
  constructor(private readonly containerDataService: FgContainerDataService) { }
  @Post('/createContainers')
  async createContainers(@Body() reqModel: FgContainerCreateRequest): Promise<FgContainerResponse> {
    try {
      return await this.containerDataService.createContainers(reqModel);
    } catch (error) {
      return returnException(FgContainerResponse, error)
    }
  }
  @Post('/ActivateDeactivateContainers')
  async ActivateDeactivateContainers(@Body() reqModel: FgContainersActivateReq): Promise<FgContainerResponse> {
    try {
      return await this.containerDataService.ActivateDeactivateContainers(reqModel);
    } catch (error) {
      return returnException(FgContainerResponse, error)
    }
  }

  @Post('/getAllContainersData')
  async getAllContainersData(@Body() reqModel: CommonIdReqModal): Promise<FgContainerResponse> {
    try {
      return await this.containerDataService.getAllContainersData(reqModel);
    } catch (error) {
      return returnException(FgContainerResponse, error)
    }
  }

  @Post('/getWhereHouseCodeDropdown')
  async getWhereHouseCodeDropdown(): Promise<WeareHouseDropDownResponse> {
    try {
      return await this.containerDataService.getWhereHouseCodeDropdown();
    } catch (error) {
      return returnException(WeareHouseDropDownResponse, error)
    }
  }

  // @Post('/updateContainerLocationStatus')
  // async updateContainerLocationStatus(@Body() reqModel: ContainerstatusChangeRequest): Promise<CommonResponse> {
  //   try {
  //     return await this.containerDataService.updateContainerLocationStatus(reqModel);
  //   } catch (error) {
  //     return returnException(CommonResponse, error)
  //   }
  // }
  // @Post('/getEmptyContainerDetails')
  // async getEmptyContainerDetails(): Promise<EmptyContainerLocationResponse> {
  //   try {
  //     return await this.containerDataService.getEmptyContainerDetails();
  //   } catch (err) {
  //     return returnException(EmptyContainerLocationResponse, err)
  //   }
  // }



}
