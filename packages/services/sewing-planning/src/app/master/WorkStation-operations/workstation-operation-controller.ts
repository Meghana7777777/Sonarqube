import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { WorkstationOperationService } from "./workstation-operation-service";
import { WorkStationOpeartionDto } from "./workstation-operation-dto";
import { GlobalResponseObject, WorkstationOperationIdRequest, WorkstationOperationResponse } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('workstationoperation')
@Controller('workstationoperation')
export class WorkstationOperationController {
    constructor(
        private service: WorkstationOperationService,
    ) {

    }

    @Post('createWorkstationOperation')
    @ApiBody({type:WorkStationOpeartionDto})
    async createWorkstationOperation(@Body() req: WorkStationOpeartionDto[]): Promise<WorkstationOperationResponse> {
        try {
            return await this.service.createWorkstationOperation(req);
        } catch (error) {
            return returnException(WorkstationOperationResponse, error)
        }
    }

    @Post('deleteWorkstationOperation')
    async deleteWorkstationOperation(@Body() req: WorkstationOperationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteWorkstationOperation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @Post('getWorkstationOperation')
    async getWorkstationOperation(): Promise<WorkstationOperationResponse> {
        try {
            return await this.service.getWorkstationOperation();
        } catch (error) {
            return returnException(WorkstationOperationResponse, error);
        }
    }
    // @ApiBody({type:WorkStationOpeartionDto})
    // @Post('updateWorkstationOperation')
    // async updateWorkstationOperation(@Body() req: WorkStationOpeartionDto): Promise<WorkstationOperationResponse> {
    //     try {
    //   
        //  return await this.service.updateWorkstationOperation(req);
    //     } catch (error) {
    //         return returnException(WorkstationOperationResponse, error);
    //     }
    // }
 
    @ApiBody({type:WorkStationOpeartionDto})
    @Post('activateDeactivateWorkStationOperation')
    async activateDeactivateWorkStationOperation(@Body() req:WorkStationOpeartionDto ):Promise<WorkstationOperationResponse> {
        
    try {
        return await this.service.activateDeactivateWorkStationOperation(req);
    }
    catch(error) {
        return returnException(WorkstationOperationResponse,error);
    }
}


}