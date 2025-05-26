import { Body, Controller, Post } from "@nestjs/common";
import { handleResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, PackTypesResponse } from "@xpparel/shared-models";
import { MTtoggleDto } from "../material-type/dtos";
import { PTCreateDto } from "./dtos";
import { PackTypeService } from "./pack-type.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Pack Types')
@Controller('pack-type')
export class PackTypeController {
  constructor(private readonly mtService: PackTypeService) { }

  @Post('/createPackType')
  async createPackType(@Body() dto: PTCreateDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.mtService.createPackType(dto),
      CommonResponse
    );
  }


  @Post('/getAllPackTypes')
  async getAllPackTypes(@Body() dto:CommonRequestAttrs): Promise<PackTypesResponse> {
    return handleResponse(
      async () => this.mtService.getAllPackTypes(dto),
      PackTypesResponse
    );
  }
  @Post('/getAllPackTypesDropDown')
  async getAllPackTypesDropDown(@Body() dto:CommonRequestAttrs): Promise<PackTypesResponse> {
    return handleResponse(
      async () => this.mtService.getAllPackTypesDropDown(dto),
      PackTypesResponse
    );
  }
  
  @Post('/togglePackType')
  async togglePackType(@Body() dto: MTtoggleDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.mtService.togglePackType(dto),
      CommonResponse
    );
  }

  @Post('/getMaterialsToItems')
  async getMaterialsToItems():Promise<PackTypesResponse>{
    return handleResponse(
      async() => this.mtService.getMaterialsToItems(),
      PackTypesResponse
    );
  }
}