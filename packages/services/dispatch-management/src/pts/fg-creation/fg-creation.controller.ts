import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, OslRefIdRequest } from '@xpparel/shared-models';



@ApiTags('Fg Creation')
@Controller('fg-creation')
export class FgCreationController {
    constructor(
       
    ) {
        
    }

    // @ApiBody({ type: OslRefIdRequest })
    // @Post('/createFgsForOslRefId')
    // async createFgsForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
    //     try {
    //         return null;
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error);
    //     }
    // }

    // @ApiBody({ type: OslRefIdRequest })
    // @Post('/createFgsForOslRefId')
    // async createFgsForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
    //     try {
    //         return null;
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error);
    //     }
    // }

    @ApiBody({ type: null })
    @Post('/createBundlesForJob')
    async createBundlesForJob(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}