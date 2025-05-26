import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { FgInsCreateExtRefRequest, FileMetadataDTO, GlobalResponseObject, PackJobIdsRequest, PKMSInsStatusReqDto, PKMSIrActivityChangeRequest } from "@xpparel/shared-models";
import { FgInspectionCreationService } from "./fg-inspection-creation.service";
// import { FgInsCreateExtRefRequest, FgInspectionCreationService } from "./fg-inspection-creation.service";



@ApiTags('Fg Inspection Creation')
@Controller('fg-inspection-creation')
export class FgInspectionCreationController {
    constructor(
        private fgInspectionCreationService: FgInspectionCreationService,
    ) {

    }

    @Post('/createFgInspectionRequest')
    async createFgInspectionRequest(@Body() reqModel: FgInsCreateExtRefRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgInspectionCreationService.createFgInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteFgInspectionRequest')
    async deleteFgInspectionRequest(@Body() reqModel: PackJobIdsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgInspectionCreationService.deleteFgInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/updatePMSInspectionActivityStatus')
    async updatePMSInspectionActivityStatus(@Body() reqModel: PKMSIrActivityChangeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgInspectionCreationService.updatePMSInspectionActivityStatus(reqModel);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }

    @Post('/getInspectionStatus')
    async getInspectionStatus(@Body() reqModel: PKMSInsStatusReqDto): Promise<GlobalResponseObject> {
        try {
            return await this.fgInspectionCreationService.getInspectionStatus(reqModel);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }
}