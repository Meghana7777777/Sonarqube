import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, PoFabricRatioResponse, PoItemCodeRequest, PoProdutNameRequest, PoRatioCreateRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoRatioMarkerIdResponse, PoRatioResponse, PoRatioSizeRequest, PoSerialRequest, RatioDocGenStatusRequest } from '@xpparel/shared-models';
import { PoRatioInfoService } from './po-ratio-info.service';
import { PoRatioService } from './po-ratio.service';


@ApiTags('Production order ratios')
@Controller('po-ratio')
export class PoRatioController {
    constructor(
        private service: PoRatioService,
        private infoService: PoRatioInfoService
    ) {

    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: [PoRatioCreateRequest]})
    @Post('/createPoRatio')
    async createPoRatio(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createPoRatio(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoRatioIdRequest})
    @Post('/deletePoRatio')
    async deletePoRatio(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteRatio(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * will get all the ratios under a PO with all the detailed objects
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest})
    @Post('/getAllRatiosForPo')
    async getAllRatiosForPo(@Body() req: any): Promise<PoRatioResponse> {
        try {
            return await this.infoService.getAllRatiosForPo(req);
        } catch (err) {
            return returnException(PoRatioResponse, err);
        }
    }

    /**
     * will get all the ratios under a PO with all the detailed objects
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoRatioIdRequest})
    @Post('/getRatioDetailedInfoForRatioId')
    async getRatioDetailedInfoForRatioId(@Body() req: any): Promise<PoRatioResponse> {
        try {
            return await this.infoService.getRatioDetailedInfoForRatioId(req);
        } catch (err) {
            console.log(err);
            return returnException(PoRatioResponse, err);
        }
    }

    /**
     * will get all the ratios under a PO + fabric with all the detailed objects
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoItemCodeRequest})
    @Post('/getAllRatiosForPoFabric')
    async getAllRatiosForPoFabric(@Body() req: any): Promise<PoFabricRatioResponse> {
        try {
            return await this.infoService.getAllRatiosForPoFabric(req);
        } catch (err) {
            return returnException(PoFabricRatioResponse, err);
        }
    }

    /**
     * Only gets the size level cumulative qtys of OQ, RATIO Q for the given PO
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest})
    @Post('/getCumRatioQtyFabricWiseForPo')
    async getCumRatioQtyFabricWiseForPo(@Body() req: any): Promise<PoFabricRatioResponse> {
        try {
            return await this.infoService.getCumRatioQtyFabricWiseForPo(req);
        } catch (err) {
            return returnException(PoFabricRatioResponse, err);
        }
    }

    @ApiBody({ type: RatioDocGenStatusRequest})
    @Post('/updateDocGenStatusByRatioId')
    async updateDocGenStatusByRatioId(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateDocGenStatusByRatioId(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: PoRatioIdMarkerIdRequest})
    @Post('/setMarkerVersionForRatio')
    async setMarkerVersionForRatio(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.setMarkerVersionForRatio(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: PoRatioIdRequest})
    @Post('/getMarkerVersionIdForRatio')
    async getMarkerVersionIdForRatio(@Body() req: any): Promise<PoRatioMarkerIdResponse> {
        try {
            return await this.infoService.getMarkerVersionIdForRatio(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: PoRatioSizeRequest})
    @Post('/updateRatioSizes')
    async updateRatioSizes(@Body() req: any[]): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateRatioSizes(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    

}