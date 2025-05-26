import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CommonRequestAttrs, CutTableCreateRequest, CutTableIdRequest, CutTableResponse, GlobalResponseObject } from '@xpparel/shared-models';
import { CutTableService } from './cut-table.service';


@ApiTags('CutTable')
@Controller('cut-table')
export class CutTableController {
    constructor(
        private service: CutTableService,
    ) {

    }
    
    @Post('createCutTable')
    async createCutTable(@Body() req: CutTableCreateRequest): Promise<CutTableResponse> {
        try {
            // cut table name must be unique
            // no spaces are allowed before or after the table name
            // Table1 and TABLE1 both means the same
            
            return await this.service.createCutTable(req);
        } catch (error) {
            return returnException(CutTableResponse, error)
        }
    }

    @Post('deleteCutTable')
    async deleteCutTable(@Body() req: CutTableIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteCutTable(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
    
    @Post('getAllCutTables')
    async getAllCutTables(@Body() req: CommonRequestAttrs): Promise<CutTableResponse> {
        try {
            return await this.service.getAllCutTables(req);
        } catch (error) {
            return returnException(CutTableResponse, error)
        }
    }
 
    @Post('getCutTablebyId')
    async getCutTablebyId(@Body() req: CutTableIdRequest): Promise<CutTableResponse> {
        try {
            return await this.service.getCutTablebyId(req);
        } catch (error) {
            return returnException(CutTableResponse, error) 
        }
    }
    
}