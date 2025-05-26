import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject } from '@xpparel/shared-models';



@ApiTags('Fg Bank')
@Controller('fg-bank')
export class FgBankController {
    constructor(
       
    ) {
        
    }

    @ApiBody({ type: null })
    @Post('/createFgsForJob')
    async createFgsForJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}