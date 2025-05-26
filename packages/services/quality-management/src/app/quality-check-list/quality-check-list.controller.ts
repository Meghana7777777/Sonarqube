import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from '@xpparel/shared-models';
import { QualityCheckListService } from './quality-check-list.service';
import { QualityCheckListDto } from './dto/quality-check-list.dto';

@ApiTags('/quality-check-list')
@Controller('quality-check-list')

export class QualityChecklistController {
    constructor(
        private service: QualityCheckListService) { }

    @Post('/createQualityCheckListParameter')
    @ApiBody({ type: QualityCheckListDto })
    async createQualityCheckListParameter(@Body() createDto: any): Promise<CommonResponse> {
        try {
            return await this.service.createQualityCheckListParameter(createDto);
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllQualityCheckListParameter')
    async getAllQualityCheckListParameter(@Body() createDto: any): Promise<CommonResponse> {
        try {
            return await this.service.getAllQualityCheckListParameter();
        } catch (error) {
            return (error);
        }
    }

    @Post('/updateQualityCheckListParameter')
    @ApiBody({ type: QualityCheckListDto })
    async updateQualityCheckListParameter(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.updateQualityCheckListParameter(req);
        } catch (error) {
            return (error);
        }
    }

    @Post('/activateDeactivateQualityCheckListParameter')
    async activateDeactivateQualityCheckListParameter(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.activateDeactivateQualityCheckListParameter(req);
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllActiveQualityCheckListParameter')
    async getAllActiveQualityCheckListParameter(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveQualityCheckListParameter();
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllQualityCheckListParamsMapping')
    async getAllQualityCheckListParamsMapping(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.getAllQualityCheckListParamsMapping();
        } catch (error) {
            return (error);
        }
    }

}