import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, INV_C_InvOutAllocIdRequest, JobNumberRequest, OslRefIdRequest, PTS_C_InvIssuanceRefCreateRequest, SewSerialRequest, SewVersionRequest } from '@xpparel/shared-models';
import { InvReceivingService } from './inv-receiving.service';



@ApiTags('Inventory Receiving')
@Controller('inv-receiving')
export class InvReceivingController {
    constructor(
        private readonly invRecService: InvReceivingService,
    ) {

    }

    @ApiBody({ type: PTS_C_InvIssuanceRefCreateRequest })
    @Post('/createInvIssuanceRef')
    async createInvIssuanceRef(@Body() req: PTS_C_InvIssuanceRefCreateRequest): Promise<GlobalResponseObject> {
        try {
            console.log('Request came in');
            console.log(req);
            return await this.invRecService.createInvIssuanceRef(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/updateBundlesReceivedForAnAllocationId')
    async updateBundlesReceivedForAnAllocationId(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invRecService.updateBundlesReceivedForAnAllocationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: INV_C_InvOutAllocIdRequest })
    @Post('/reverseBundlesReceivedForAnAllocationId')
    async reverseBundlesReceivedForAnAllocationId(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.invRecService.reverseBundlesReceivedForAnAllocationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }
}