import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, SewVersionResponse, PoProdutNameRequest, SewSerialRequest, SewVerIdRequest, SewVersionRequest, SewVersionCloneRequest, SewRawMaterialResponse, RawMaterialIdRequest, JobGroupVersionInfoResp, PoSerialRequest, PoProdNameResponse, OpsWorkFlowResponse, ManufacturingOrderProductName } from '@xpparel/shared-models';
import { SewVersionInfoService } from './sew-mapping-info.service';
import { SewVersionService } from './sew-mapping.service';


@ApiTags('Sewing mapping')
@Controller('sew-mapping')
export class SewMappingController {
    constructor(
        private service: SewVersionService,
        private infoService: SewVersionInfoService
    ) {

    }

    /**
     * creates the po op seq
     * @returns 
     */
    // @ApiBody({ type: SewVersionRequest })
    // @Post('/createSewVersionForProduct')
    // async createSewVersionForProduct(@Body() req: any): Promise<GlobalResponseObject> {
    //     try {
    //         return await this.service.createSewVersionForProduct(req);
    //     } catch (err) {
    //         return returnException(GlobalResponseObject, err);
    //     }
    // }

    /**
     * deletes the op version
     * @returns 
     */
    @ApiBody({ type: SewVerIdRequest })
    @Post('/deleteSewVersion')
    async deleteSewVersion(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteSewVersion(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the the op versions for the PO and the product name
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/getSewVersionForPoProductName')
    async getSewVersionForPoProductName(@Body() req: any): Promise<SewVersionResponse> {
        try {
            return await this.infoService.getSewVersionForPoProductName(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets the the op versions for the PO
     * @returns 
     */
    @ApiBody({ type: SewSerialRequest })
    @Post('/getSewVersionForPo')
    async getSewVersionForPo(@Body() req: any): Promise<SewVersionResponse> {
        try {
            return await this.infoService.getSewVersionForPoSerial(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * Service to Clone Parent Operation Version to child product names
     * @param req 
     * @returns 
    */
    // @ApiBody({ type: SewVersionCloneRequest })
    // @Post('/copySewingVersionToGivenProductNames')
    // async copySewingVersionToGivenProductNames(@Body() req: any) {
    //     try {
    //         return await this.service.copySewingVersionToGivenProductNames(req.parentOpsVersionId, req.productNames, req.poSerial, req.companyCode, req.unitCode, req.username, req.userId);
    //     } catch (err) {
    //         return returnException(GlobalResponseObject, err);
    //     }
    // }

    @ApiBody({ type: RawMaterialIdRequest })
    @Post('/getSewDataOpCode')
    async getSewDataOpCode(@Body() req: any): Promise<SewRawMaterialResponse> {
        try {
            return await this.service.getSewDataOpCode(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: SewSerialRequest })
    @Post('/getJobGroupVersionInfo')
    async getJobGroupVersionInfo(@Body() req: any): Promise<JobGroupVersionInfoResp> {
        try {
            console.log(req);
            return await this.infoService.getJobGroupVersionInfo(req);
        } catch (err) {
            return returnException(JobGroupVersionInfoResp, err);
        }
    }

    
    @ApiBody({ type: ManufacturingOrderProductName })
    @Post('/getGlobalOpsVersionForSoAndProduct')
    async getGlobalOpsVersionForSoAndProduct(@Body() req: any): Promise<OpsWorkFlowResponse> {
        try {
            console.log(req);
            return await this.infoService.getGlobalOpsVersionForSoAndProduct(req);
        } catch (err) {
            return returnException(OpsWorkFlowResponse, err);
        }
    }

    // @ApiBody({ type: SewSerialRequest })
    // @Post('/getPoProductNamesAndVersionInfo')
    // async getPoProductNamesAndVersionInfo(@Body() req: SewSerialRequest): Promise<PoProdNameResponse> {
    //     try {
    //         console.log(req);
    //         return await this.service.getPoProductNamesAndVersionInfo(req);
    //     } catch (err) {
    //         return returnException(PoProdNameResponse, err);
    //     }
    // }
}


