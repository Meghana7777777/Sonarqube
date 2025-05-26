import { Body, Controller, Post } from '@nestjs/common';
import { SewingJobGenerationService } from './sewing-job-generation.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { SewingOrderReq, SewingJobSummaryForSewOrderResp, SewingJobFeatureGroupReq, SewOrderDetailForFeatureGroupResponse, SewJobGenReqForActualAndFeatureGroup, SewJobPreviewForFeatureGroupResp, SewingJobConfirmedReqInfoForActualGenFeatureGroup, GlobalResponseObject, JobSewSerialReq, DocBundleInfoForFgsResp, MinEligibleCompPanelsResp, CutEligibilityInfoResp, SewSerialRequest, SewingJobBatchInfoResp, SewingJobBarcodeInfoResp, SewSerialBundleGroupReq, SewJobSummaryForFeatureGroupResp, SewJobGenReqForBgMOAndFeatureGroup, SewingJobPreviewModelResp, DeleteSewingJobsRequest, SewingJobPropsResp, PanelReqForJobInfoResp, PtsBankRequestCreateRequest, PanelRequestCreationModel, SewingIJobNoRequest, IPlannningJobModelResponse, SewingJobSizeWiseSummaryResponse, SewingJobOperationWiseSummaryResponse, SewSerialProcessTypeReq, JobOpUpdateRequest, OslIdFgsSpsResponse } from '@xpparel/shared-models';
import { SewingJobGenerationServiceForMO } from './sewing-job-generation-for-mo.service';
@ApiTags('Sewing Jobs Generation For MO')
@Controller('sewing-job-generation-for-mo')
export class SewingJobGenerationForMOController {
    constructor(
        private service: SewingJobGenerationServiceForMO
    ) {

    }


    @ApiBody({ type: SewSerialBundleGroupReq })
    @Post('/getSewingJobSummaryForSewingOrderAndBundleGroup')
    async getSewingJobSummaryForSewingOrderAndBundleGroup(@Body() req: any): Promise<SewingJobSummaryForSewOrderResp> {
        try {
            return null;
        } catch (error) {
            return returnException(SewingJobSummaryForSewOrderResp, error);
        }
    }

    @ApiBody({ type: SewingJobFeatureGroupReq })
    @Post('/getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures')
    async getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures(@Body() req: any): Promise<SewJobSummaryForFeatureGroupResp> {
        try {
            return null;
        } catch (error) {
            return returnException(SewJobSummaryForFeatureGroupResp, error);
        }
    }

    @ApiBody({ type: SewJobGenReqForBgMOAndFeatureGroup })
    @Post('/getSewingJobsPreviewForBGAndFeatureGroup')
    async getSewingJobsPreviewForBGAndFeatureGroup(@Body() req: any): Promise<SewingJobPreviewModelResp> {
        try {
            return null;
        } catch (error) {
            return returnException(SewingJobPreviewModelResp, error);
        }
    }

    @ApiBody({ type: SewJobGenReqForBgMOAndFeatureGroup })
    @Post('/generateSewingJobsForBGAndFeatureGroup')
    async generateSewingJobsForBGAndFeatureGroup(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: DeleteSewingJobsRequest })
    @Post('/deleteSewingJobs')
    async deleteSewingJobs(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: JobSewSerialReq })
    @Post('/getSewingJobQtyAndPropsInfoByJobNumber')
    async getSewingJobQtyAndPropsInfoByJobNumber(@Body() req: any): Promise<SewingJobPropsResp> {
        try {
            return null;
        } catch (error) {
            return returnException(SewingJobPropsResp, error);
        }
    }

    @ApiBody({ type: JobSewSerialReq })
    @Post('/getComponentBundlesForSewingJob')
    async getComponentBundlesForSewingJob(@Body() req: any): Promise<PanelReqForJobInfoResp> {
        try {
            return null;
        } catch (error) {
            return returnException(PanelReqForJobInfoResp, error);
        }
    }


    @ApiBody({ type: PanelRequestCreationModel })
    @Post('/createPanelFormRequestForSewingJob')
    async createPanelFormRequestForSewingJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return null;
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SewingIJobNoRequest })
    @Post('/getJobDetailsForInputDashboard')
    async getJobDetailsForInputDashboard(@Body() req: any): Promise<IPlannningJobModelResponse> {
        try {
            return null;
        } catch (err) {
            return returnException(IPlannningJobModelResponse, err);
        }
    }

    @ApiBody({ type: SewSerialRequest })
    @Post('/getSewingJobSizeWiseSummaryData')
    async getSewingJobSizeWiseSummaryData(@Body() req: any): Promise<SewingJobSizeWiseSummaryResponse> {
        try {
            return null;
        } catch (err) {
            return returnException(SewingJobSizeWiseSummaryResponse, err);
        }
    }

    @ApiBody({ type: SewSerialRequest })
    @Post('/getSewingJobOperationWiseSummaryData')
    async getSewingJobOperationWiseSummaryData(@Body() req: any): Promise<SewingJobOperationWiseSummaryResponse> {
        try {
            return null;
        } catch (err) {
            return returnException(SewingJobOperationWiseSummaryResponse, err);
        }
    }


    @ApiBody({ type: SewSerialProcessTypeReq })
    @Post('/getAvailableComponentBundlesForProcessType')
    async getAvailableComponentBundlesForProcessType(@Body() req: any): Promise<PanelReqForJobInfoResp> {
        try {
            return null;
        } catch (err) {
            return returnException(PanelReqForJobInfoResp, err);
        }
    }
    
    @ApiBody({ type: JobOpUpdateRequest })
    @Post('/updateReportedQtyOfJobAndOp')
    async updateReportedQtyOfJobAndOp(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateReportedQtyOfJobAndOp(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


}
