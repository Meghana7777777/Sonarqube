import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { handleResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, MaterialTypesResponse } from "@xpparel/shared-models";
import { MTCreateDto, MTtoggleDto } from "./dtos";
import { MaterialTypeService } from "./material-type.service";

@ApiTags('Material Type')
@Controller('material-type')
export class MaterialTypeController {
  constructor(private readonly mtService: MaterialTypeService) { }

  @Post('/createMaterialType')
  async createMaterialType(@Body() dto: MTCreateDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.mtService.createMaterialType(dto),
      CommonResponse
    );
  }


  @Post('/getAllMaterialTypes')
  async getAllMaterialTypes(@Body() dto:CommonRequestAttrs): Promise<MaterialTypesResponse> {
    return handleResponse(
      async () => this.mtService.getAllMaterialTypes(dto),
      MaterialTypesResponse
    );
  }


  @Post('/toggleMaterialType')
  async toggleMaterialType(@Body() dto: MTtoggleDto): Promise<CommonResponse> {
    return handleResponse(
      async () => this.mtService.toggleMaterialType(dto),
      CommonResponse
    );
  }

  @Post('/getMaterialsToItems')
  async getMaterialsToItems():Promise<MaterialTypesResponse>{
    return handleResponse(
      async() => this.mtService.getMaterialsToItems(),
      MaterialTypesResponse
    );
  }
}