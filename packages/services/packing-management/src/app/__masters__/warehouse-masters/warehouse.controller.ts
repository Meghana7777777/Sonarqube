import { Body, Controller, Post } from "@nestjs/common";
import { handleResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, MaterialTypesResponse, WareHouseResponse } from "@xpparel/shared-models";
import { ApiTags } from "@nestjs/swagger";
import { WHCreateDto, WHtoggleDto } from "./dto";
import { WareHouseService } from "./warehouse.service";

@ApiTags('WareHouse')
@Controller('warehouse')
export class WareHouseController {
  constructor(private readonly whService: WareHouseService) { }

  @Post('/createWareHouse')
  async createWareHouse(@Body() dto: WHCreateDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.whService.createWareHouse(dto),
      CommonResponse
    );
  }
@Post('/getAllWareHouse')
  async getAllWareHouse(@Body() dto:CommonRequestAttrs): Promise<WareHouseResponse> {
    return handleResponse(
      async () => this.whService.getAllWareHouse(dto),
      WareHouseResponse
    );
  }
@Post('/getWareHouseDropDown')
  async getWareHouseDropDown(@Body() dto:CommonRequestAttrs): Promise<WareHouseResponse> {
    return handleResponse(
      async () => this.whService.getWareHouseDropDown(dto),
      WareHouseResponse
    );
  }


  @Post('/toggleWareHouse')
  async toggleWareHouse(@Body() dto: WHtoggleDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.whService.toggleWareHouse(dto),
      CommonResponse
    );
  }

  @Post('/getWareHouseToRacks')
  async getWareHouseToRacks(@Body() req: CommonRequestAttrs):Promise<WareHouseResponse>{
    return handleResponse(
     async() => this.whService.getWareHouseToRacks(req),
     WareHouseResponse
    );
  }

  @Post('/getWareHouseDropDownToRacks')
  async getWareHouseDropDownToRacks(@Body() req: CommonRequestAttrs):Promise<WareHouseResponse>{
    return handleResponse(
     async() => this.whService.getWareHouseDropDownToRacks(req),
     WareHouseResponse
    );
  }
}