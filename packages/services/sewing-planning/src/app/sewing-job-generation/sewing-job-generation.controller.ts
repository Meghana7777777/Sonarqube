import { Body, Controller, Post } from '@nestjs/common';
import { SewingJobGenerationService } from './sewing-job-generation.service';
import { ApiBody } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { SewingOrderReq, SewingJobSummaryForSewOrderResp, SewingJobFeatureGroupReq, SewOrderDetailForFeatureGroupResponse, SewJobGenReqForActualAndFeatureGroup, SewJobPreviewForFeatureGroupResp, SewingJobConfirmedReqInfoForActualGenFeatureGroup, GlobalResponseObject, JobSewSerialReq, DocBundleInfoForFgsResp, MinEligibleCompPanelsResp, CutEligibilityInfoResp, SewSerialRequest, SewingJobBatchInfoResp, SewingJobBarcodeInfoResp, JobBundleFgInfoResponse, JobNumberRequest, OslIdFgsSpsResponse, OslRefIdRequest, SewingIJobNoRequest, IPlannningJobModelResponse, SewSerialProcessTypeReq, PTS_C_TranLogIdRequest } from '@xpparel/shared-models';
import { SewingJobInfoServiceForMO } from './sewing-job-info.service';

@Controller('sewing-job-generation')
export class SewingJobGenerationController {
    constructor(
        private service: SewingJobGenerationService,
        private infoService: SewingJobInfoServiceForMO
    ) {

    }


    // @ApiBody({ type: SewingOrderReq })
    // @Post('/getSewingJobSummaryForSewingOrder')
    // async getSewingJobSummaryForSewingOrder(@Body() req: any): Promise<SewingJobSummaryForSewOrderResp> {
    //     try {
    //         return await this.service.getSewingJobSummaryForSewingOrder(req);
    //     } catch (error) {
    //         return returnException(SewingJobSummaryForSewOrderResp, error);
    //     }
    // }


    // @ApiBody({ type: SewingJobFeatureGroupReq })
    // @Post('/getSewingOrderDetailsForFeatureGroup')
    // async getSewingOrderDetailsForFeatureGroup(@Body() req: any): Promise<SewOrderDetailForFeatureGroupResponse> {
    //     try {
    //         return await this.service.getSewingOrderDetailsForFeatureGroup(req);
    //     } catch (error) {
    //         return returnException(SewOrderDetailForFeatureGroupResponse, error);
    //     }
    // }



    // @ApiBody({ type: SewJobGenReqForActualAndFeatureGroup })
    // @Post('/getSewingJobPreviewForActualGenFeatureGroup')
    // async getSewingJobPreviewForActualGenFeatureGroup(@Body() req: any): Promise<SewJobPreviewForFeatureGroupResp> {
    //     try {
    //         return await this.service.getSewingJobPreviewForActualGenFeatureGroup(req);
    //     } catch (err) {
    //         return returnException(SewJobPreviewForFeatureGroupResp, err);
    //     }
    // }

    @ApiBody({ type: SewingJobConfirmedReqInfoForActualGenFeatureGroup })
    @Post('/confirmAndSubmitSewingJob')
    async confirmAndSubmitSewingJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            console.log(req);
            return await this.service.confirmAndSubmitSewingJob(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    // @ApiBody({ type: JobSewSerialReq })
    // @Post('/getCutPanelsInfoForJobNumber')
    // async getCutPanelsInfoForJobNumber(@Body() req: any): Promise<CutEligibilityInfoResp> {
    //     try {
    //         console.log(req,'0909090909')
    //         return await this.service.getCutPanelsInfoForJobNumber(req.jobNumber, req.unitCode, req.companyCode, req.isBundleWiseInfoNeed, req.sewSerial);
    //     } catch (err) {
    //         return returnException(CutEligibilityInfoResp, err);
    //     }
    // }

    @ApiBody({ type: SewSerialRequest })
    @Post('/getSewingJobBInfoBySewSerial')
    async getSewingJobBInfoBySewSerialByQry(@Body() req: any): Promise<SewingJobBatchInfoResp> {
        try {
            return await this.service.getSewingJobBInfoBySewSerialByQry(req);
        } catch (err) {
            return returnException(SewingJobBatchInfoResp, err);
        }
    }

    // @ApiBody({ type: JobSewSerialReq })
    // @Post('/getBarcodeDetailsByJobNumber')
    // async getBarcodeDetailsByJobNumber(@Body() req: any): Promise<SewingJobBarcodeInfoResp> {
    //     try {
    //         return await this.service.getBarcodeDetailsByJobNumber(req);
    //     } catch (err) {
    //         return returnException(SewingJobBarcodeInfoResp, err);
    //     }
    // }

    @ApiBody({ type: JobNumberRequest })
    @Post('/getBundleInfoByJob')
    async getBundleInfoByJob(@Body() req: JobNumberRequest): Promise<JobBundleFgInfoResponse> {
        try {
            return await this.infoService.getBundleInfoByJob(req);
        } catch (err) {
            return returnException(JobBundleFgInfoResponse, err);
        }
    }


    @ApiBody({ type: OslRefIdRequest })
    @Post('/getFgInfoByOSLRefIds')
    async getFgInfoByOSLRefIds(@Body() req: any): Promise<OslIdFgsSpsResponse> {
        try {
            return await this.infoService.getFgInfoByOSLRefIds(req);
        } catch (err) {
            return returnException(OslIdFgsSpsResponse, err);
        }
    }

}
