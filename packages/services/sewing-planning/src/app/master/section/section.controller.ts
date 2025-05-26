
import { Body, Catch, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {  GlobalResponseObject,  SectionResponse, SectionIdRequest, CommonRequestAttrs, SectionCodeRequest, GetSectionDetailsBySectionCodeResponse, SectionCreateRequest } from '@xpparel/shared-models';
import {  CommonResponse, SectionsModulesResponse } from '@xpparel/shared-models';
import {  returnException } from '@xpparel/backend-utils';
import { SectionService } from './section.service';
import { SectionDto } from './dto/section-dto';


@ApiTags('section')
@Controller('section')
export class SectionController {
    constructor(
        private service: SectionService,
    ) {

    }
    
    @ApiBody({type:SectionCreateRequest})
    @Post('/createSection')
    async createSection(@Body() req: any): Promise<SectionResponse> {
        try {
            return await this.service.createSection(req);
        } catch (error) {
            return returnException(SectionResponse, error)
        }
    }

    @Post('/deleteSection')
    async deleteSection(@Body() req: SectionIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteSection(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
    
    @ApiBody({type:SectionIdRequest})
    @Post('/getSection')
    async getSection(@Body() req: SectionIdRequest): Promise<SectionResponse> {
        try {
            return await this.service.getSection(req);
        } catch (error) {
            return returnException(SectionResponse, error);
        }
    }
    // @ApiBody({type:SectionDto})
    // @Post('updateSection')
    // async updateSection(@Body() req: SectionCreateRequest): Promise<SectionResponse> {
    //     try {
    //         return await this.service.updateSection(req);
    //     } catch (error) {
    //         return returnException(SectionResponse, error);
    //     }
    // }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('getAllSectionsData')
    async getAllSectionsData(@Body() req: any): Promise<SectionsModulesResponse> {
        try {
            return await this.service.getAllSectionsData(req);
        } catch (error) {
            return returnException(CommonResponse, error);
        }
    }

    
    @Post('/activeDeactiveSection')
    @ApiBody({type:SectionIdRequest})
    async activateDeactivateSection(@Body() req:SectionIdRequest): Promise<SectionResponse> {
        try {
            return await this.service.activateDeactivateSection(req);
        }
        catch(error) {
            return returnException(SectionResponse,error);
        }
    }
    
    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getAllSections')
    async getAllSections(@Body() req: CommonRequestAttrs): Promise<SectionResponse> {
        try {
            return await this.service.getAllSections(req);
        } catch (error) {
            return returnException(SectionResponse, error);
        }
    }

    @ApiBody({type:SectionCodeRequest})
        @Post('getSectionDataBySectionCode')
        async getSectionDataBySectionCode(@Body() req: SectionCodeRequest) : Promise<GetSectionDetailsBySectionCodeResponse> {
            try {
                return await this.service.getSectionDataBySectionCode(req)
            } catch (error) {
                return returnException 
                ( GetSectionDetailsBySectionCodeResponse , error)
            }
        }

    

}