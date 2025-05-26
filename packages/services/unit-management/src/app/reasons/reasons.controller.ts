import { Body, Catch, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs,CutTableCreateRequest, CutTableIdRequest, CutTableResponse, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, PoNumberRequest, ReasonCreateRequest, ReasonIdRequest, ReasonResponse, ReasonCategoryRequest, ManufacturingOrderResp, MoDumpModal, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { ReasonService } from './reasons.service';


@ApiTags('reasons')
@Controller('reasons')
export class ReasonController {
    constructor(
        private service: ReasonService,
    ) {

    }
    
    @Post('createReason')
    async createReason(@Body() req: ReasonCreateRequest): Promise<ReasonResponse> {
        try {
            return await this.service.createReason(req);
        } catch (error) {
            return returnException(ReasonResponse, error)
        }
    }

    @Post('deleteReason')
    async deleteReason(@Body() req: ReasonIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteReason(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
    
    @Post('getAllReasons')
    async getAllReasons(@Body() req: CommonRequestAttrs): Promise<ReasonResponse> {
        try {
            return await this.service.getAllReasons(req);
        } catch (error) {
            return returnException(ReasonResponse, error);
        }
    }
 
    @Post('getReasonbyId')
    async getReasonbyId(@Body() req: ReasonIdRequest): Promise<ReasonResponse> {
        try {
            return await this.service.getReasonbyId(req);
        } catch (error) {
            return returnException(ReasonResponse, error);
        }
    }

    @Post('getReasonsByCategory')
    async getReasonsByCategory(@Body() req: ReasonCategoryRequest): Promise<ReasonResponse> {
        try {
            return await this.service.getReasonsByCategory(req);
        } catch (error) {
            return returnException(ReasonResponse, error);
        }
    }

    @Post('getAllActiveReasons')
    async getAllActiveReasons(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveReasons();
        } catch (error) {
            return returnException(ReasonResponse, error);
        }
    }
    
}