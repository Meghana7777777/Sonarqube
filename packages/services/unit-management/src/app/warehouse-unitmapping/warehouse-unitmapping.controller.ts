import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { WarehouseUnitmappingDto } from "./DTO/warehouse-unitmapping-dto";
import { WarehouseUnitmappingIdRequest, WarehouseUnitmappingResponse, GlobalResponseObject, WarehouseUnitmappingCreateRequest } from "@xpparel/shared-models";
import { WarehouseUnitmappingService } from "./warehouse-unitmapping.service";

@ApiTags('warehouse-unitmapping')
@Controller('warehouse-unitmapping')
export class WarehouseUnitmappingController {
  constructor(private readonly service: WarehouseUnitmappingService) {}

  @Post('createWarehouseUnitmapping')
  @ApiBody({ type: WarehouseUnitmappingCreateRequest })
  async createWarehouseUnitmapping(@Body() req: any): Promise<WarehouseUnitmappingResponse> {
    try {
      return await this.service.createWarehouseUnitmapping(req);
    } catch (error) {
      return returnException(WarehouseUnitmappingResponse, error);
    }
  }

  @Post('deleteWarehouseUnitmapping')
  @ApiBody({ type: WarehouseUnitmappingIdRequest })
  async deleteWarehouseUnitmapping(@Body() req: WarehouseUnitmappingIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.deleteWarehouseUnitmapping(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('getWarehouseUnitmapping')
  @ApiBody({ type: WarehouseUnitmappingIdRequest })
  async getWarehouseUnitmapping(@Body() req: WarehouseUnitmappingIdRequest): Promise<WarehouseUnitmappingResponse> {
    try {
      return await this.service.getWarehouseUnitmapping(req);
    } catch (error) {
      return returnException(WarehouseUnitmappingResponse, error);
    }
  }

  // @Post('updateWarehouseUnitmapping')
  // @ApiBody({ type: WarehouseUnitmappingDto })
  // async updateWarehouseUnitmapping(@Body() req: WarehouseUnitmappingDto): Promise<WarehouseUnitmappingResponse> {
  //   try {
  //     return await this.service.updateWarehouseUnitmapping(req);
  //   } catch (error) {
  //     return returnException(WarehouseUnitmappingResponse, error);
  //   }
  // }

  @Post('activeDeactiveWarehouseUnitmapping')
  @ApiBody({ type: WarehouseUnitmappingIdRequest })
  async activeDeactiveWarehouseUnitmapping(@Body() req: WarehouseUnitmappingIdRequest): Promise<WarehouseUnitmappingResponse> {
    try {
      return await this.service.activeDeactiveWarehouseUnitmapping(req);
    } catch (error) {
      return returnException(WarehouseUnitmappingResponse, error);
    }
  }
}