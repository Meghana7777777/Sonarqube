import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReportingConfigurationCreateDto } from "./dto/reporting-configuration-create-dto";
import { CommonRequestAttrs, CommonResponse, PkmsReportingConfigurationRequestModel, PkmsReportingConfigurationResponse } from "@xpparel/shared-models";
import { handleResponse } from "@xpparel/backend-utils";
import { ReportingConfigurationToggleDto } from "./dto/reporting-configuration-toggle-dto";
import { PkmsReportingConfigurationService } from "./pkms-reporting-configuration-service";



@ApiTags('PkmsReportingConfiguration')
@Controller('pkms-reporting-configuration')
export class PkmsReportingConfigurationController {

  constructor(private readonly rcService: PkmsReportingConfigurationService) { }

  @Post('/createReportingConfiguration')
  async createReportingConfiguration(@Body() dto: ReportingConfigurationCreateDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.rcService.createReportingConfiguration(dto),
      CommonResponse
    );
  }

  @Post('/getAllReportingConfigurations')
  async getAllReportingConfigurations(@Body() dto: PkmsReportingConfigurationRequestModel): Promise<PkmsReportingConfigurationResponse> {
    return handleResponse(
      async () => this.rcService.getAllReportingConfigurations(dto),
      PkmsReportingConfigurationResponse
    );
  }
  @Post('/toggleReportingConfigurations')
  async toggleReportingConfigurations(@Body() dto: ReportingConfigurationToggleDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.rcService.toggleReportingConfigurations(dto),
      CommonResponse
    );
  }


}
