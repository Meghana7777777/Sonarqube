import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, ShiftCreateRequest, ShiftModel, ShiftResponse, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
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
    @ApiBody({type: ShiftCreateRequest})
    @Post('/createShift')
    async createShift(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createShift(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: ShiftCreateRequest})
    @Post('/deleteShift')
    async deleteShift(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteShift(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({type: CommonRequestAttrs})
    @Post('/getAllShifts')
    async getAllShifts(@Body() req: any): Promise<ShiftResponse> {
        try {
            return await this.service.getAllShifts(req);
        } catch (error) {
            return returnException(ShiftResponse, error);
        }
    }

}