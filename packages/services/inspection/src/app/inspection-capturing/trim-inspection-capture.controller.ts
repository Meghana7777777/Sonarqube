import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse } from "@xpparel/shared-models";
import path from "path";
import { TrimInspectionService } from "./trim-inspection-capture.service";
const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')

@ApiTags('Trim Inspection Capture')
@Controller('trim-inspection-capture')
export class TrimInspectionController {
    constructor(
        private service: TrimInspectionService,
    ) {

    }

    @Post('/captureInspectionResultsForTrim')
    @UseInterceptors(AnyFilesInterceptor())
    async captureInspectionResultsForTrim(@Body() req:any): Promise<CommonResponse> {
        try {
            console.log('Raw Request Body:', req);
            req = JSON.parse(req.formValues);
            console.log('reqqq',req);
            // console.log('Parsed Data:', formValues);

            return await this.service.captureInspectionResultsForTrim(req);
        } catch (error) {
            return returnException(CommonResponse, error);
        }
    }
}
