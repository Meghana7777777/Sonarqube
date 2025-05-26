import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { ShiftService } from './shift.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { ShiftInfoService } from './shift-info.service';


@ApiTags('Shift')
@Controller('shift')
export class ShiftController {
    constructor(
        private service: ShiftService,
        private infoService: ShiftInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    // @ApiBody({type: })
    @Post('/createShift')
    async createShift(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

}