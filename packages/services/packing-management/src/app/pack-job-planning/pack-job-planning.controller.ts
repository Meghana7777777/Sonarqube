import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { handleResponse } from "@xpparel/backend-utils";
import { CartonPrintReqDto, CommonIdReqModal, CommonRequestAttrs, CommonResponse, PackJobPlanningRequest, PackJobsResponse, PlanPackJobModel, PoIdRequest, PoPackJobResponse, unPlanRequest } from "@xpparel/shared-models";
import { PackJobService } from "./pack-job-planning.service";

@ApiTags('job-planning')
@Controller('job-planning')
export class PackJobController {
    constructor(

        private service: PackJobService,
    ) {

    }
    @Post('unPlanPackJobRequestsFromPackTable')
    async unPlanPackJobRequestsFromPackTable(@Body() reqData: unPlanRequest): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.unPlanPackJobRequestsFromPackTable(reqData),
            CommonResponse
        );
    }

    @Post('getPlannedPackJobRequestsOfPackTable')
    async getPlannedPackJobRequestsOfPackTable(@Body() req: PackJobPlanningRequest): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getPlannedPackJobRequestsOfPackTable(req),
            CommonResponse
        );
    }

    @Post('getYetToPlanPackJobs')
    async getYetToPlanPackJobs(@Body() req: CommonIdReqModal): Promise<PackJobsResponse> {
        return handleResponse(
            async () => this.service.getYetToPlanPackJobs(req),
            PackJobsResponse
        );
    }
    @Post('planPackJobToPackTable')
    async planPackJobToPackTable(@Body() req: PlanPackJobModel): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.planPackJobToPackTable(req),
            CommonResponse
        );
    }

    @Post('getPackJobsForPo')
    async getPackJobsForPo(@Body() req: PoIdRequest): Promise<PoPackJobResponse> {
        return handleResponse(
            async () => this.service.getPackJobsForPo(req),
            PoPackJobResponse
        );
    }

    @Post('getCartonPrintData')
    async getCartonPrintData(@Body() req: CartonPrintReqDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getCartonPrintData(req),
            CommonResponse
        );
    }

}