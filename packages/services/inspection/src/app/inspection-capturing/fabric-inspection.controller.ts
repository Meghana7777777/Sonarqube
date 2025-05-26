import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FabricInspectionService } from "./fabric-inspection.service";
import {  GlobalResponseObject, InsBasicInspectionRequest, InsLabInspectionRequest, InsRelaxationInspectionRequest, InsShadeInspectionRequest, InsShrinkageInspectionRequest } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('Fabric Inspection Capture')
@Controller('fabric-inspection-capture')
export class FabricInspectionController {
    constructor(
        private service: FabricInspectionService,
    ) {

    }

    @Post('/captureInspectionResultsForBasicInspection')
    async captureInspectionResultsForBasicInspection(@Body() reqObj: InsBasicInspectionRequest): Promise<GlobalResponseObject> {
      try {
        return await this.service.captureInspectionResultsForBasicInspection(reqObj);
      } catch (error) {
        return returnException(GlobalResponseObject, error);
      }
    }
  
    @Post('/captureInspectionResultsForLabInspection')
    async captureInspectionResultsForLabInspection(@Body() reqObj: InsLabInspectionRequest): Promise<GlobalResponseObject> {
      try {
        return await this.service.captureInspectionResultsForLabInspection(reqObj);
      } catch (error) {
        return returnException(GlobalResponseObject, error);
      }
    }
  
    @Post('/captureInspectionResultsForLabRelaxation')
    async captureInspectionResultsForLabRelaxation(@Body() reqObj: InsRelaxationInspectionRequest): Promise<GlobalResponseObject> {
      try {
        return await this.service.captureInspectionResultsForLabRelaxation(reqObj);
      } catch (error) {
        return returnException(GlobalResponseObject, error);
      }
    }
  
    @Post('/captureInspectionResultsForLabShade')
    async captureInspectionResultsForLabShade(@Body() reqObj: InsShadeInspectionRequest): Promise<GlobalResponseObject> {
      try {
        return await this.service.captureInspectionResultsForLabShade(reqObj);
      } catch (error) {
        return returnException(GlobalResponseObject, error);
      }
    }
  
    @Post('/captureInspectionResultsForLabShrinkage')
    async captureInspectionResultsForLabShrinkage(@Body() reqObj: InsShrinkageInspectionRequest): Promise<GlobalResponseObject> {
      try {
        return await this.service.captureInspectionResultsForLabShrinkage(reqObj);
      } catch (error) {
        return returnException(GlobalResponseObject, error);
      }
    }

    
}