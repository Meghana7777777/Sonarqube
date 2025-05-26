import { Body, Controller, Post } from '@nestjs/common';
import { CommonResponse } from '@xpparel/shared-models';
import { QualityTypeService } from './quality-type-service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { QualityTypeDTO } from './dto/quality-type-dto';

@ApiTags('/quality-type')
@Controller('quality-type')
export class QualityTypeController {
    constructor(
        private readonly service: QualityTypeService
    ) { }

    @Post('/createQualityType')
    @ApiBody({type:QualityTypeDTO})
    async createQualityType(@Body() createDto: any, isUpdate: boolean): Promise<CommonResponse> {
        try {
            return await this.service.createQualityType(createDto, false);
        } catch (error) {
            return (error);
        }
    }
    @Post('/getAllQualityType')
    async getAllQualityType(): Promise<CommonResponse> {
        try {
            return await this.service.getAllQualityType();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }

    @Post('/updateQualityType')
    @ApiBody({type:QualityTypeDTO})
    async updateQualityType(@Body() createDto: any, isUpdate: boolean): Promise<CommonResponse> {
        try {
            return await this.service.createQualityType(createDto, true);
        } catch (error) {
            return (error)
        }
    }

    @Post('/activateOrDeactivateQualityType')
    async activateOrDeactivateQualityType(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.activateOrDeactivateQualityType(req);
        } catch (error) {
            console.log(error);
        }
    }

    @Post('/getAllActiveQualityType')
    async getAllActiveQualityType(): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveQualityType();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }
}