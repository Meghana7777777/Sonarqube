import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { UOMConversionService } from "./uom.conversion.service";
import { returnException } from "@xpparel/backend-utils";
import { UOMConversionRequest, UOMConversionResponse } from "@xpparel/shared-models";

@ApiTags('UOM Conversion')
@Controller('UOMConversion')
export class UOMConversionController {
  constructor(
    private readonly uomConversionService: UOMConversionService
  ) {

  }

  @ApiBody({ type: UOMConversionRequest })
  @Post('/getAllUOMConversion')
  async getAllUOMConversion(@Body() reqModel: UOMConversionRequest): Promise<UOMConversionResponse> {
    try {
      return await this.uomConversionService.getAllUOMConversion(reqModel);
    } catch (error) {
      return returnException(UOMConversionResponse, error)
    }
  }

  @ApiBody({ type: UOMConversionRequest })
  @Post('/getPlantDefaultUOMForGivenItem')
  async getPlantDefaultUOMForGivenItem(req: UOMConversionRequest): Promise<any> {
    try {
      return await this.uomConversionService.getPlantDefaultUOMForGivenItem(req);
    } catch (error) {
      return returnException(UOMConversionResponse, error)
    }
  }
}