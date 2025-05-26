import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { handleResponse } from '@xpparel/backend-utils';
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, PackTableCreateRequest, PackTableIdRequest, PackTableResponse, PackTablesResponse } from '@xpparel/shared-models';
import { PackTableService } from './pack-table.service';
import { PTtoggleDto } from './dto/pack-type-dto';


@ApiTags('Pack Table')
@Controller('pack-table')
export class PackTableController {
    constructor(
        private service: PackTableService,
    ) {

    }

    @Post('createPackTable')
    async createPackTable(@Body() req: PackTableCreateRequest): Promise<PackTableResponse> {
        return handleResponse(
            async () => this.service.createPackTable(req),
            PackTableResponse
        );
    }

    @Post('deletePackTable')
    async deletePackTable(@Body() req: PackTableIdRequest): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.service.deletePackTable(req),
            GlobalResponseObject
        );
    }

    @Post('getAllPackTables')
    async getAllPackTables(@Body() req: CommonRequestAttrs): Promise<PackTablesResponse> {
        return handleResponse(
            async () => this.service.getAllPackTables(req),
            PackTablesResponse
        );
    }

    @Post('getPackTableById')
    async getPackTableById(@Body() req: PackTableIdRequest): Promise<PackTableResponse> {
        return handleResponse(
            async () => this.service.getPackTableById(req),
            PackTableResponse
        );
    }

    
      @Post('/togglePackType')
      async togglePackType(@Body() dto: PTtoggleDto): Promise<CommonResponse> {
        return handleResponse(
          async () => this.service.togglePackType(dto),
          CommonResponse
        );
      }

}