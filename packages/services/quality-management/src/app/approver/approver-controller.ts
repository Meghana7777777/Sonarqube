import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from '@xpparel/shared-models';
import { ApproverService } from './approver-services';
import { ApproverDTO } from './dto/approver.dto';

@ApiTags('approver')
@Controller('approver')
export class ApproverController {
    constructor(
        private readonly service: ApproverService
    ) { }

    @Post('/createApprover')
    @ApiBody({ type: ApproverDTO })
    async createApprover(@Body() createDto: any, isUpdate: boolean): Promise<CommonResponse> {
        try {
            return await this.service.createApprover(createDto, false);
        } catch (error) {
            return (error);
        }
    }
    @Post('/getAllApprovers')
    async getAllApprovers(): Promise<CommonResponse> {
        try {
            return await this.service.getAllApprovers();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }

    @Post('/updateApprover')
    @ApiBody({ type: ApproverDTO })
    async updateApprover(@Body() createDto: any, isUpdate: boolean): Promise<CommonResponse> {
        try {
            return await this.service.createApprover(createDto, true);
        } catch (error) {
            return (error)
        }
    }

    @Post('/activateOrDeactivateApprover')
    @ApiBody({ type: ApproverDTO })
    async activateOrDeactivateApprover(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.activateOrDeactivateApprover(req);
        } catch (error) {
            console.log(error);
        }
    }

    @Post('/getAllActiveApprovers')
    async getAllActiveApprovers(): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveApprovers();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }
}