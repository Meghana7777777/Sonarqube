import { Body, Catch, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { WorkstationCreateRequest, WorkstationModuleRequest } from '@xpparel/shared-models';
import { GlobalResponseObject, WorkstationResponse, WorkstationIdRequest, ModuleIdRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { WorkstationService } from './workstation.service';
import { WorkstationDto } from './DTO/workstation.dto';


@ApiTags('workstation')
@Controller('workstation')
export class WorkstationController {
    constructor(
        private service: WorkstationService,
    ) {

    }

    @ApiBody({ type: WorkstationCreateRequest })
    @Post('createWorkstation')
    async createWorkstation(@Body() req: any): Promise<WorkstationResponse> {
        
        try {
            return await this.service.createWorkstation(req);
        } catch (error) {
            return returnException(WorkstationResponse, error)
        }
    }

    @Post('deleteWorkstation')
    async deleteWorkstation(@Body() req: WorkstationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteWorkstation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WorkstationIdRequest })
    @Post('getWorkstation')
    async getWorkstation(@Body() req: WorkstationIdRequest): Promise<WorkstationResponse> {
        try {
            return await this.service.getWorkstation(req);
        } catch (error) {
            return returnException(WorkstationResponse, error);
        }
    }

    // @ApiBody({ type: WorkstationDto })
    // @Post('updateWorkstation')
    // async updateWorkstation(@Body() req: WorkstationDto): Promise<WorkstationResponse> {
    //     try {
    //         return await this.service.updateWorkstation(req);
    //     } catch (error) {
    //         return returnException(WorkstationResponse, error);
    //     }
    // }x

    @ApiBody({ type: ModuleIdRequest })
    @Post('getAllWorkStationsByModuleCode')
    async getAllWorkStationsByModuleCode(@Body() req: any): Promise<WorkstationResponse> {
        try {
            return await this.service.getAllWorkStationsByModuleCode(req);
        } catch (error) {
            return returnException(WorkstationResponse, error);
        }
    }

    @ApiBody({ type: WorkstationDto })
    @Post('activateDeactivateWorkStation')
    async activateDeactivateWorkStation(@Body() req: WorkstationDto): Promise<WorkstationResponse> {

        try {
            return await this.service.activateDeactivateWorkStation(req);
        }
        catch (error) {
            return returnException(WorkstationResponse, error);
        }
    }

    @Post('WorkstationOperationTypeDropDown')
    async WorkstationOperationTypeDropDown(@Body() req: any): Promise<WorkstationResponse> {
        try {
            return this.service.WorkstationOperationTypeDropDown(req);
        } catch (error) {
            return returnException(WorkstationResponse, error)
        }
    }



    @ApiBody({ type: WorkstationModuleRequest })
    @Post('getWorkstationsByModuleCode')
    async getWorkstationsByModuleCode(@Body() req: WorkstationModuleRequest): Promise<WorkstationResponse> {
        try {
            return await this.service.getWorkstationsByModuleCode(req);
        } catch (error) {
            return returnException(WorkstationResponse, error);
        }
    }



}
