import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, GlobalResponseObject, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeResponse } from '@xpparel/shared-models';
import { MarkerTypService } from './marker-type.service';


@ApiTags('Marker Type')
@Controller('marker-type')
export class MarkerTypeController {
    constructor(
        private service: MarkerTypService,
    ) {

    }
    
    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: MarkerTypeCreateRequest})
    @Post('createMarkerType')
    async createMarkerType(@Body() req: any): Promise<MarkerTypeResponse> {
        try {
            // ensure MarkerType is unique
            return await this.service.createMarkerType(req);
        } catch (error) {
            return returnException(MarkerTypeResponse, error)
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: MarkerTypeIdRequest})
    @Post('deleteMarkerType')
    async deleteMarkerType(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteMarkerType(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: MarkerTypeIdRequest})
    @Post('deActivateMarkerType')
    async deActivateMarkerType(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deActivateMarkerType(req)
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: CommonRequestAttrs})
    @Post('getAllMarkerTypes')
    async getAllMarkerTypes(@Body() req: any): Promise<MarkerTypeResponse> {
        try {
            return await this.service.getAllMarkerTypes(req)
        } catch (error) {
            return returnException(MarkerTypeResponse, error)
            
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: MarkerTypeIdRequest})
    @Post('getMarkerType')
    async getMarkerType(@Body() req: any): Promise<MarkerTypeResponse> {
        try {
            return await this.service.getMarkerType(req)
        } catch (error) {
            return returnException(MarkerTypeResponse, error)
        }
    }
}