import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject } from '@xpparel/shared-models';



@ApiTags('Fg Retrieving')
@Controller('fg-retrieving')
export class FgRetrievingController {
    constructor(
       
    ) {
        
    }

    @ApiBody({ type: null })
    @Post('/reportOperationForJob')
    async reportOperationForJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}