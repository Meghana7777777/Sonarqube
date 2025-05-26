import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { EmbRejectionService } from './emb-rejection.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { EmbRejectionInfoService } from './emb-rejection-info.service';


@ApiTags('Emb Rejection')
@Controller('emb-rejection')
export class EmbRejectionController {
    constructor(
        private service: EmbRejectionService,
        private infoService: EmbRejectionInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    // @ApiBody({type: })
    @Post('/createEmbRejection')
    async createEmbRejection(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

}