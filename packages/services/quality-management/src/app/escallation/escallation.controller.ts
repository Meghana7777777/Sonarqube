import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from '@xpparel/shared-models';
import { EscallationDTO } from './dto/escallation.dto';
import { EscallationService } from './escallation.service';

@ApiTags('/escallation')
@Controller('escallation')
export class EscallationController {
    constructor(
        private readonly service: EscallationService) { }

    @Post('/createEscallation')
    @ApiBody({ type: EscallationDTO })
    async createEscallation(@Body() createDto: any, isUpdate: boolean = false): Promise<CommonResponse> {
        try {
            return await this.service.createEscallation(createDto, false);
        } catch (error) {
            return (error);
        }
    }
    @Post('/getAllEscallation')
    async getAllEscallation(): Promise<CommonResponse> {
        try {
            return await this.service.getAllEscallation();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }

    @Post('/updateEscallation')
    @ApiBody({ type: EscallationDTO })
    async updateEscallation(@Body() createDto: any, isUpdate: boolean = false): Promise<CommonResponse> {
        try {
            return await this.service.createEscallation(createDto, true);
        } catch (error) {
            return (error)
        }
    }

    @Post('/activateOrDeactivateEscallation')
    @ApiBody({ type: EscallationDTO })
    async activateOrDeactivateEscallation(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.activateOrDeactivateEscallation(req);
        } catch (error) {
            console.log(error);
        }
    }

    @Post('/getAllActiveEscallations')
    async getAllActiveEscallations(): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveEscallations();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }
}