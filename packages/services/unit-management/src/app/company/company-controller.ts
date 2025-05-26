import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company-service";
import { CompanyDto } from "./DTO/company-dto";
import { CompanyCreateRequest, CompanyIdRequest, CompanyResponse } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('company')
@Controller('company')
export class CompanyController {
    constructor(
        private service: CompanyService,
    ) {

    }

    @Post('createCompany')
    @ApiBody({ type: CompanyCreateRequest })
    async createCompany(@Body() req: any): Promise<CompanyResponse> {
        try {
            return await this.service.createCompany(req);
        } catch (error) {
            return returnException(CompanyResponse, error)
        }
    }

    @Post('deleteCompany')
    @ApiBody({ type: CompanyDto })
    async deleteCompany(@Body() req: CompanyIdRequest): Promise<CompanyResponse> {
        try {
            return await this.service.deleteCompany(req);
        } catch (error) {
            return returnException(CompanyResponse, error)
        }
    }

    @Post('getCompany')
    @ApiBody({ type: CompanyDto })
    async getCompany(@Body() req: CompanyIdRequest): Promise<CompanyResponse> {
        try {
            return await this.service.getCompany(req);
        } catch (error) {
            return returnException(CompanyResponse, error);
        }
    }

    // @Post('updateCompany')
    // @ApiBody({ type: CompanyDto })
    // async updateCompany(@Body() req: CompanyDto): Promise<CompanyResponse> {    
    //     try {
    //         return await this.service.updateCompany(req);
    //     } catch (error) {
    //         return returnException(CompanyResponse, error);
    //     }
    // }

    @Post('activateDeactiveCompany')
    @ApiBody({ type: CompanyIdRequest })
    async activateDeactiveCompany(@Body() req: CompanyIdRequest): Promise<CompanyResponse> {
        try {
            return await this.service.activateDeactiveCompany(req);
        } catch (error) {
            return returnException(CompanyResponse, error);
        }
    }   
    
































}