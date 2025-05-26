import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { returnException } from '@xpparel/backend-utils';
import { ModuleDto } from './dto/module-dto';
import { CommonRequestAttrs, GlobalResponseObject, ModuleCreateRequest, ModuleIdRequest, ModuleResponse, ModuleSectionRequest } from '@xpparel/shared-models';
import { SectionIdRequest } from '@xpparel/shared-models';
import { AllModulesResponseForJobPriority, GetModuleDetailsByModuleCodeResponse, IModuleIdRequest } from '../../../../../../libs/shared-models/src/sps/sewing-job-planning';

@ApiTags('module')
@Controller('module')
export class ModuleController {
    constructor(
        private service: ModuleService,
    ) {

    }

    @Post('createModule')
    @ApiBody({ type:ModuleCreateRequest })
    async createModule(@Body() req: any): Promise<ModuleResponse> {
        try {
            return await this.service.createModule(req);
        } catch (error) {
            return returnException(ModuleResponse, error)
        }
    }

    @Post('deleteModule')
    async deleteModule(@Body() req: ModuleIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteModule(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: ModuleIdRequest })
    @Post('getModule')
    async getModule(@Body() req: ModuleIdRequest): Promise<ModuleResponse> {
        try {
            return await this.service.getModule(req);
        } catch (error) {
            return returnException(ModuleResponse, error);
        }
    }

    // @ApiBody({ type: ModuleDto })
    // @Post('updateModule')
    // async updateModule(@Body() req: ModuleDto): Promise<ModuleResponse> {
    //     try {
    //         return await this.service.updateModule(req);
    //     } catch (error) {
    //         return returnException(ModuleResponse, error);
    //     }
    // }

    @ApiBody({type:SectionIdRequest})
    @Post('getAllModulesDataBySectionCode')
    async getAllModulesDataBySectionCode(@Body() req: any): Promise<ModuleResponse> {
        try {
            return await this.service.getAllModulesDataBySectionCode(req);
        } catch (error) {
            return returnException(ModuleResponse, error);
        }
    }
 
    @ApiBody({type:ModuleIdRequest})
    @Post('activateDeactivateModule')
    async activateDeactivateModule(@Body() req: ModuleIdRequest): Promise<ModuleResponse> {

        try {
            return await this.service.activateDeactivateModule(req);
        }
        catch (error) {
            return returnException(ModuleResponse, error);
        }
    }

    @ApiBody({ type: ModuleSectionRequest })
    @Post('getModulesBySectionCode')
    async getModulesBySectionId(@Body() req: ModuleSectionRequest): Promise<ModuleResponse> {
        try {
            return await this.service.getModulesBySectionCode(req);
        } catch (error) {
            return returnException(ModuleResponse, error);
        }
    }

    
    @ApiBody({type:IModuleIdRequest})
    @Post('getModuleDataByModuleCode')
    async getModuleDataByModuleCode(@Body() req: any) : Promise<GetModuleDetailsByModuleCodeResponse> {
        try {
            return await this.service.getModuleDataByModuleCode(req)
        } catch (error) {
            return returnException 
            ( GetModuleDetailsByModuleCodeResponse , error)
        }
    }

    @ApiBody({type:CommonRequestAttrs})
    @Post('getAllModulesForJobPriority')
    async getAllModulesForJobPriority(@Body() req: any) : Promise<AllModulesResponseForJobPriority> {
        try {
            return await this.service.getAllModulesForJobPriority(req)
        } catch (error) {
            return returnException 
            ( AllModulesResponseForJobPriority , error)
        }
    }
  

    
}
