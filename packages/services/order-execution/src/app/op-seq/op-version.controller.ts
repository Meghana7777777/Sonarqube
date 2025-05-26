import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, OpVerIdRequest, OpVersionRequest, OpVersionResponse, OpsVersionCloneRequest, PoProductFgColorRequest, PoProdutNameRequest, PoSerialRequest } from '@xpparel/shared-models';
import { OpVersionInfoService } from './op-version-info.service';
import { OpVersionService } from './op-version.service';


@ApiTags('Operation version')
@Controller('op-version')
export class OpVersionController {
    constructor(
        private service: OpVersionService,
        private infoService: OpVersionInfoService
    ) {

    }

    /**
     * creates the po op seq
     * @returns 
     */
    @ApiBody({ type: OpVersionRequest })
    @Post('/createOpVersionForProduct')
    async createOpVersionForProduct(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createOpVersionForProduct(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * deletes the op version
     * @returns 
     */
    @ApiBody({ type: OpVerIdRequest })
    @Post('/deleteOpVersion')
    async deleteOpVersion(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteOpVersion(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the the op versions for the PO and the product name
     * @returns 
     */
    @ApiBody({ type: PoProductFgColorRequest })
    @Post('/getOpVersionForPoProductName')
    async getOpVersionForPoProductName(@Body() req: any): Promise<OpVersionResponse> {
        try {
            return await this.infoService.getOpVersionForPoProductName(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the the op versions for the PO
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getOpVersionsForPo')
    async getOpVersionsForPo(@Body() req: any): Promise<OpVersionResponse> {
        try {
            return await this.infoService.getOpVersionForPoSerial(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * Service to Clone Parent Operation Version to child product names
     * @param req 
     * @returns 
    */
    @ApiBody({ type: OpsVersionCloneRequest })
    @Post('/copyOperationVersionToGivenProductNames')
    async copyOperationVersionToGivenProductNames(@Body() req: OpsVersionCloneRequest) {
        try {
            return await this.service.copyOperationVersionToGivenProductNames(req.parentOpsVersionId, req.productNames,req.poSerial, req.companyCode, req.unitCode, req.username, req.userId);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }



}


