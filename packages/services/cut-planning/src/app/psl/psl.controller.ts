import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, PoSerialRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { PslService } from './psl.service';
import { PslBundleService } from './psl-bundle.service';



@ApiTags('PSL config')
@Controller('psl')
export class PslController {
    constructor(
        private readonly pslService: PslService,
        private pslBundleService: PslBundleService
    ) {

    }

    // Need to be turned to a bull job
    @ApiBody({type: PoSerialRequest})
    @Post('/createPslBundlesInCPS')
    async createPslBundlesInCPS(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.pslBundleService.createPslBundlesInCPS(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: PoSerialRequest})
    @Post('/deletePslBundlesInCPS')
    async deletePslBundlesInCPS(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.pslBundleService.deletePslBundlesInCPS(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // Tested
    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/createOslRefIdsForMo')
    async createOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.pslService.createOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // Tested
    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteOslRefIdsForMo')
    async deleteOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.pslService.deleteOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }
}
