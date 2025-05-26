import { Body, Controller, Post } from '@nestjs/common';
import { KnittingJobPlanningService } from '@xpparel/shared-services';
import { KnittingJobsPlanningService } from './knitting-jobs-planning.service';
import { GlobalResponseObject, KJ_KnitJobLocPlanRequest, KJ_locationCodeRequest, KJ_LocationCodesRequest, KJ_LocationCodeWiseQtyResponse, KJ_LocationKnitJobsResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('knitting-jobs-planning')
export class KnittingJobsPlanningController {
    constructor(
        private service: KnittingJobsPlanningService
    ) { }

    @Post('/planKnitJobsToLocation')
    async planKnitJobsToLocation(@Body() reqObj: KJ_KnitJobLocPlanRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.planKnitJobsToLocation(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }



    @Post('/unPlanKnitJobsToLocation')
    async unPlanKnitJobsToLocation(@Body() reqObj: KJ_KnitJobLocPlanRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.unPlanKnitJobsToLocation(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }



    @Post('/getKnitJobsForGivenLocation')
    async getKnitJobsForGivenLocation(@Body() reqObj: KJ_locationCodeRequest): Promise<KJ_LocationKnitJobsResponse> {
        try {
            return await this.service.getKnitJobsForGivenLocation(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getPlannedQtyForGivenLocation')
    async getPlannedQtyForGivenLocation(@Body() reqObj: KJ_LocationCodesRequest): Promise<KJ_LocationCodeWiseQtyResponse> {
        try {
            return await this.service.getPlannedQtyForGivenLocation(reqObj);
        } catch (error) {
            return returnException(KJ_LocationCodeWiseQtyResponse, error);
        }
    }
}