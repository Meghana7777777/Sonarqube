import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ThreadInspectionCaptureService } from "./thread-inspection-capture.service";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@ApiTags('Thread Inspection Capture')
@Controller('thread-inspection-capture')
export class ThreadInspectionCaptureController {
    constructor(
        private service: ThreadInspectionCaptureService,
    ) {

    }

    // @Post('/captureInspectionResultsForThread')
    // async captureInspectionResultsForThread(@Body() reqObj: any): Promise<GlobalResponseObject> {
    //     try {
    //         reqObj = JSON.parse(reqObj.formValues)
    //         return await this.service.captureInspectionResultsForThread(reqObj);
    //     } catch (error) {

    //         return returnException(GlobalResponseObject, error);
    //     }
    // } 

    // }))
        @Post('/captureInspectionResultsForThread')
        @UseInterceptors(AnyFilesInterceptor())
        async captureInspectionResultsForThread(@Body() req:any): Promise<CommonResponse> {
            try {
                console.log('Raw Request Body:', req);
                req = JSON.parse(req.formValues);
                console.log('reqqq',req);
                // console.log('Parsed Data:', formValues);
    
                return await this.service.captureInspectionResultsForThread(req);
            } catch (error) {
                return returnException(CommonResponse, error);
            }
        }
}