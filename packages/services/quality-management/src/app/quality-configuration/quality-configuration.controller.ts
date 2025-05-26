import { Body, Controller, Post } from '@nestjs/common';
import { QualityConfigurationService } from './quality-configuration.service';
import { ApiBody } from '@nestjs/swagger';
import { EscallationLogDto } from './dto/escalation-log.dto';
import { GlobalResponseObject, QualityConfigurationCreationReq, QualityConfigurationInfoRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('quality-configuration')
export class QualityConfigurationController {
    constructor(
        private readonly qualityConfigurationService: QualityConfigurationService,
    ) { }

    @Post('/createQualityConfiguration')
    @ApiBody({ type: QualityConfigurationCreationReq })
    async createQualityConfiguration(@Body() createDto: any): Promise<GlobalResponseObject> {
        try {
            return await this.qualityConfigurationService.createQualityConfiguration(createDto);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
    @Post('/getAllEsclations')
    @ApiBody({ type: EscallationLogDto })
    async getAllEsclations(@Body() createDto: any): Promise<GlobalResponseObject> {
        try {
            return await this.qualityConfigurationService.getAllEsclations(createDto);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getQualityConfigurationInfo')
    @ApiBody({ type: QualityConfigurationInfoRequest })
    async getQualityConfigurationInfo(@Body() createDto: any): Promise<GlobalResponseObject> {
        try {
            return await this.qualityConfigurationService.getQualityConfigurationInfo(createDto);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

}
