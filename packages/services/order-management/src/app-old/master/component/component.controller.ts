import { Body, Catch, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, ComponentIdRequest, ComponentModel, ComponentRequest, ComponentResponse, GlobalResponseObject, ItemCodeInfoResponse, OpenPoDetailsResponse, PoNumberRequest, ManufacturingOrderResp, MoDumpModal, SupplierCodeReq, SupplierInfoResponse } from '@xpparel/shared-models';
import { ComponentService } from './component.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';


@ApiTags('Component')
@Controller('component')
export class ComponentController {
    constructor(
        private service: ComponentService,
    ) {

    }
    
    @Post('createComponent')
    async createComponent(@Body() req: ComponentRequest): Promise<ComponentResponse> {
        try {
            return await this.service.createComponent(req);
        } catch (error) {
            return returnException(ComponentResponse, error)
        }
    }

    @Post('deleteComponent')
    async deleteComponent(@Body() req: ComponentIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteComponent(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
    @Post('getAllComponents')
    async getAllComponents(@Body() req: CommonRequestAttrs): Promise<ComponentResponse> {
        try {
            return await this.service.getAllComponents(req);
        } catch (error) {
            return returnException(ComponentResponse, error)
        }
    }
 
    @Post('getComponent')
    async getComponent(@Body() req: ComponentIdRequest): Promise<ComponentResponse> {
        try {
            return await this.service.getComponent(req);
        } catch (error) {
            return returnException(ComponentResponse, error) 
        }
    }
    
}