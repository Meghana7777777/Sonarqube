import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBatchNosRequest, InsFabInsCreateExtRefRequest, InsIrActivityChangeRequest } from "@xpparel/shared-models";
import { FabricInspectionCreationService } from "./fabric-inspection-creation.service";

@ApiTags('Fabric Inspection Creation')
@Controller('fabric-inspection-creation')
export class FabricInspectionCreationController {
  constructor(
    private fabricInspectionCreationService: FabricInspectionCreationService,
  ) {

  }

  @Post('/createFabricInspectionRequest')
  async createFabricInspectionRequest(@Body() reqModel: InsFabInsCreateExtRefRequest): Promise<GlobalResponseObject> {
    try {
      return await this.fabricInspectionCreationService.createFabricInspectionRequest(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/deleteFabricInspectionRequest')
  async deleteFabricInspectionRequest(@Body() reqModel: InsBatchNosRequest): Promise<GlobalResponseObject> {
    try {
      return await this.fabricInspectionCreationService.deleteFabricInspectionRequest(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/updateInspectionActivityStatus')
  async updateInspectionActivityStatus(@Body() reqModel: InsIrActivityChangeRequest): Promise<GlobalResponseObject> {
    try {
      return await this.fabricInspectionCreationService.updateInspectionActivityStatus(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  
}
