import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, MarkerCreateRequest, MarkerIdRequest, MarkerInfoResponse, PoProdutNameRequest, ProductNameItemsRequest } from '@xpparel/shared-models';
import { PoMarkerInfoService } from './po-marker-info.service';
import { PoMarkerService } from './po-marker.service';


@ApiTags('Production order markers')
@Controller('po-marker')
export class PoMarkerController {
    constructor(
        private service: PoMarkerService,
        private infoService: PoMarkerInfoService
    ) {

    }

    /**
     * saves the po marker
     * @returns 
     */
    @ApiBody({type: MarkerCreateRequest})
    @Post('/createPoMarker')
    async createPoMarker(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           // Marker will be created for a PO and the product name under it
           // markerVersion must be unique for poSerial + productName + itemCode
           return await this.service.createPoMarker(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * saves the po marker
     * @returns 
     */
    @ApiBody({type: MarkerCreateRequest})
    @Post('/createGlobalMarker')
    async createGlobalMarker(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           // Marker will be created for a PO and all the fabrics under it
           // markerVersion must be unique for poSerial + productName + itemCode
           return await this.service.createGlobalMarker(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * deletes the PO marker
     * @returns 
     */
    @ApiBody({type: MarkerIdRequest})
    @Post('/deletePoMarker')
    async deletePoMarker(@Body() req: any): Promise<GlobalResponseObject> {
        try {
           return await this.service.deletePoMarker(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * gets all the markers for PO + prod name
     * @returns 
     */
    @ApiBody({type: PoProdutNameRequest})
    @Post('/getPoMarkers')
    async getPoMarkers(@Body() req: any): Promise<MarkerInfoResponse> {
        try {
            // If prod name is provided then we must retrieve only prod name related markers. else proivde all the PO markers
            return await this.infoService.getPoMarkers(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * get the specific po marker
     * @returns 
     */
    @ApiBody({type: MarkerIdRequest})
    @Post('/getPoMarker')
    async getPoMarker(@Body() req: any): Promise<MarkerInfoResponse> {
        try {
            // get only the specific marker for the id
            return await this.infoService.getPoMarker(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * get the specific po marker
     * @returns 
     */
    @ApiBody({type: MarkerIdRequest})
    @Post('/setPoMarkerDefault')
    async setPoMarkerDefault(@Body() req: any): Promise<MarkerInfoResponse> {
        try {
            return await this.service.setPoMarkerDefault(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


    /**
     * get the specific po marker
     * @returns 
     */
    @ApiBody({type: ProductNameItemsRequest})
    @Post('/getPoMarkersByProdNameAndFabComb')
    async getPoMarkersByProdNameAndFabComb(@Body() req: any): Promise<MarkerInfoResponse> {
        try {
            return await this.infoService.getPoMarkersByProdNameAndFabComb(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    
}


