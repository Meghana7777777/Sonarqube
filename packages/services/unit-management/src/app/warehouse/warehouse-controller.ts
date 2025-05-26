import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { WarehouseDto } from "./DTO/warehouse-dto";
import { WarehouseCreateRequest, WarehouseIdRequest, WarehouseResponse, } from "@xpparel/shared-models";
import { WarehouseService } from "./warehouse-service";

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(
    private service: WarehouseService)
     {}
    
  @Post('createWarehouse')
  @ApiBody({ type: WarehouseCreateRequest })
  async createWarehouse(@Body() req: any): Promise<WarehouseResponse> {
    try {
      return await this.service.createWarehouse(req);
    } catch (error) {
      return returnException(WarehouseResponse, error);
    }
  }

  @Post('deleteWarehouse')
  @ApiBody({ type: WarehouseIdRequest })
  async deleteWarehouse(@Body() req: WarehouseIdRequest): Promise<WarehouseResponse> {
    try {
      return await this.service.deleteWarehouse(req);
    } catch (error) {
      return returnException(WarehouseResponse, error);
    }
  }

  @Post('getWarehouse')
  @ApiBody({ type: WarehouseIdRequest })
  async getWarehouse(@Body() req: WarehouseIdRequest): Promise<WarehouseResponse> {
    try {
      return await this.service.getWarehouse(req);
    } catch (error) {
      return returnException(WarehouseResponse, error);
    }
  }

  // @Post('updateWarehouse')
  // @ApiBody({ type: WarehouseDto })
  // async updateWarehouse(@Body() req: WarehouseDto): Promise<WarehouseResponse> {
  //   try {
  //     return await this.service.updateWarehouse(req);
  //   } catch (error) {
  //     return returnException(WarehouseResponse, error);
  //   }
  // }

  @Post('activateDeactiveWarehouse')
  @ApiBody({ type: WarehouseIdRequest })
  async activateDeactiveWarehouse(@Body() req: WarehouseIdRequest): Promise<WarehouseResponse> {
    try {
      return await this.service.activateDeactiveWarehouse(req);
    } catch (error) {
      return returnException(WarehouseResponse, error);
    }
  }
}