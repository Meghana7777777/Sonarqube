import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { DeleteSewingJobsRequest, GlobalResponseObject, INV_C_InvOutAllocIdRequest, IPS_C_LocationCodeRequest, IPS_R_LocationJobsResponse, JobSewSerialReq, PJ_ProcessingJobBatchInfoResp, PJ_ProcessingJobPreviewModelResp, PJ_ProcessingJobsGenRequest, PJ_ProcessingJobsSummaryForFeaturesResponse, PJ_ProcessingJobsSummaryResponse, PJ_ProcessingSerialRequest, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingTypesResponse, PJP_LocationCodesRequest, PJP_PlannedProcessingJobsResponse, PJP_ProcessingJobPlanningRequest, PJP_StyleProductProcessingSerialReq, PJP_UnPlannedProcessingJobsResponse, PTS_C_TranLogIdRequest, SewingJobBarcodeInfoResp, SewingJobPropsResp, SPS_C_InvOutConfirmationRequest, SPS_C_JobNumbersForReconciliationRequest, SPS_C_JobTrimReqIdRequest, SPS_C_JobTrimRequest, SPS_C_ProcJobNumberRequest, SPS_R_InvOutItemsForConfirmationIdResponse, SPS_R_JobInfoDetailedResponse, SPS_R_JobRequestedTrimsResponse, SPS_RequestDetailsModelResponse, WMS_C_IssuanceIdRequest } from '@xpparel/shared-models';
import { PJMaterialAllocationService } from './processing-jobs-material.allocation.service';
import { ProcessingJobsPlanningService } from './processing-jobs-planning.service';
import { ProcessingJobsService } from './processing-jobs.service';
import { ProcessingJobRepService } from './processing-job-rep.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('processing-jobs')
export class ProcessingJobsController {
  constructor(
    private prJobService: ProcessingJobsService,
    private prJobPlanService: ProcessingJobsPlanningService,
    private allocateMaterialService: PJMaterialAllocationService,
    private sewJobRepService: ProcessingJobRepService
  ) { }


  @Post('/getProcessingTypesByProcessingSerial')
  async getProcessingTypesByProcessingSerial(@Body() reqObj: PJ_ProcessingSerialRequest): Promise<PJ_ProcessingTypesResponse> {
    try {
      return await this.prJobService.getProcessingTypesByProcessingSerial(reqObj);
    } catch (error) {
      return returnException(PJ_ProcessingTypesResponse, error);
    }
  }

  @Post('/getProcessingJobSummaryForProcessType')
  async getProcessingJobSummaryForProcessType(@Body() reqObj: PJ_ProcessingSerialRequest, oslRefIds?: number[]): Promise<PJ_ProcessingJobsSummaryResponse> {
    try {
      return await this.prJobService.getProcessingJobSummaryForProcessType(reqObj);
    } catch (error) {
      return returnException(PJ_ProcessingJobsSummaryResponse, error);
    }
  }

  @Post('/getProcessingJobSummaryForProcessTypeAndFeatureGroup')
  async getProcessingJobSummaryForProcessTypeAndFeatureGroup(@Body() reqObj: PJ_ProcessingSerialTypeAndFeatureGroupReq): Promise<PJ_ProcessingJobsSummaryForFeaturesResponse> {
    try {
      return await this.prJobService.getProcessingJobSummaryForProcessTypeAndFeatureGroup(reqObj);
    } catch (error) {
      return returnException(PJ_ProcessingJobsSummaryForFeaturesResponse, error);
    }
  }

  @Post('/getVirtualProcessingJobsForProcessTypeAndFeatureGroup')
  async getVirtualProcessingJobsForProcessTypeAndFeatureGroup(@Body() reqObj: PJ_ProcessingJobsGenRequest): Promise<PJ_ProcessingJobPreviewModelResp> {
    try {
      return await this.prJobService.getVirtualProcessingJobsForProcessTypeAndFeatureGroup(reqObj);
    } catch (error) {
      return returnException(PJ_ProcessingJobPreviewModelResp, error);
    }
  }

  @Post('/confirmProcessingJobsForProcessTypeAndFeatureGroup')
  async confirmProcessingJobsForProcessTypeAndFeatureGroup(@Body() reqObj: PJ_ProcessingJobsGenRequest): Promise<GlobalResponseObject> {
    try {
      return await this.prJobService.confirmProcessingJobsForProcessTypeAndFeatureGroup(reqObj);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/getProcessingJobsInfoForProcessingType')
  async getProcessingJobsInfoForProcessingType(@Body() reqObj: PJ_ProcessingSerialRequest): Promise<PJ_ProcessingJobBatchInfoResp> {
    try {
      return await this.prJobService.getProcessingJobsInfoForProcessingType(reqObj);
    } catch (error) {
      return returnException(PJ_ProcessingJobBatchInfoResp, error);
    }
  }

  @Post('/getJobInfoByJobNumber')
  async getJobInfoByJobNumber(@Body() reqObj: SPS_C_ProcJobNumberRequest): Promise<SPS_R_JobInfoDetailedResponse> {
    try {
      return await this.prJobService.getJobInfoByJobNumber(reqObj);
    } catch (error) {
      return returnException(SPS_R_JobInfoDetailedResponse, error);
    }
  }

  @Post('/getRMInProgressJobsForLocation')
  async getRMInProgressJobsForLocation(@Body() reqObj: IPS_C_LocationCodeRequest): Promise<IPS_R_LocationJobsResponse> {
    try {
      return await this.prJobService.getRMInProgressJobsForLocation(reqObj);
    } catch (error) {
      console.log(error);
      return returnException(IPS_R_LocationJobsResponse, error);
    }
  }

  @Post('/getUnPlannedProcessingJobs')
  async getUnPlannedProcessingJobs(@Body() reqObj: PJP_StyleProductProcessingSerialReq): Promise<PJP_UnPlannedProcessingJobsResponse> {
    try {
      return await this.prJobPlanService.getUnPlannedProcessingJobs(reqObj);
    } catch (error) {
      return returnException(PJP_UnPlannedProcessingJobsResponse, error);
    }
  }

  @Post('/getPlannedProcessingJobs')
  async getPlannedProcessingJobs(@Body() reqObj: PJP_LocationCodesRequest): Promise<PJP_PlannedProcessingJobsResponse> {
    try {
      return await this.prJobPlanService.getPlannedProcessingJobs(reqObj);
    } catch (error) {
      return returnException(PJP_PlannedProcessingJobsResponse, error);
    }
  }

  @Post('/planProcessingJobToLocation')
  async planProcessingJobToLocation(@Body() reqObj: PJP_ProcessingJobPlanningRequest): Promise<GlobalResponseObject> {
    try {
      return await this.prJobPlanService.planProcessingJobToLocation(reqObj);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/saveTrimReqForSewingJob')
  async saveTrimReqForSewingJob(@Body() reqObj: SPS_C_JobTrimRequest): Promise<GlobalResponseObject> {
    try {
      return await this.allocateMaterialService.saveTrimReqForSewingJob(reqObj);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/getRequestedTrimMaterialForReqId')
  async getRequestedTrimMaterialForReqId(@Body() reqObj: SPS_C_JobTrimReqIdRequest): Promise<SPS_R_JobRequestedTrimsResponse> {
    try {
      return await this.allocateMaterialService.getRequestedTrimMaterialForReqId(reqObj);
    } catch (error) {
      return returnException(SPS_R_JobRequestedTrimsResponse, error);
    }
  }


  @Post('/deleteProcessingJobs')
  async deleteProcessingJobs(@Body() reqObj: DeleteSewingJobsRequest): Promise<GlobalResponseObject> {
    try {
      return await this.prJobService.deleteProcessingJobs(reqObj);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/getBarcodeDetailsByJobNumber')
  async getBarcodeDetailsByJobNumber(@Body() req: SPS_C_ProcJobNumberRequest): Promise<SewingJobBarcodeInfoResp> {
    try {
      return await this.prJobService.getBarcodeDetailsByJobNumber(req);
    } catch (err) {
      return returnException(SewingJobBarcodeInfoResp, err);
    }
  }

  @Post('/getSewingJobQtyAndPropsInfoByJobNumber')
  async getSewingJobQtyAndPropsInfoByJobNumber(@Body() req: SPS_C_ProcJobNumberRequest): Promise<SewingJobPropsResp> {
    try {
      return await this.prJobService.getSewingJobQtyAndPropsInfoByJobNumber(req.jobNumber, req.unitCode, req.companyCode);
    } catch (error) {
      return returnException(SewingJobPropsResp, error);
    }
  }

  @Post('/getJobsInfoByLocation')
  async getJobsInfoByLocation(@Body() req: IPS_C_LocationCodeRequest): Promise<IPS_R_LocationJobsResponse> {
    try {
      return await this.prJobService.getJobsInfoByLocation(req);
    } catch (error) {
      return returnException(IPS_R_LocationJobsResponse, error);
    }
  }

  @Post('/saveBankReqForSewingJob')
  async saveBankReqForSewingJob(@Body() req: SPS_C_JobTrimRequest): Promise<GlobalResponseObject> {
    try {
      return await this.allocateMaterialService.saveBankReqForSewingJob(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/getRequestDetailsForJob')
  async getRequestDetailsForJob(@Body() req: SPS_C_ProcJobNumberRequest): Promise<SPS_RequestDetailsModelResponse> {
    try {
      return await this.allocateMaterialService.getRequestDetailsForJob(req);
    } catch (error) {
      return returnException(SPS_RequestDetailsModelResponse, error);
    }
  }

  @Post('/getRequestedSFGItemsForReqId')
  async getRequestedSFGItemsForReqId(@Body() req: SPS_C_InvOutConfirmationRequest): Promise<SPS_R_InvOutItemsForConfirmationIdResponse> {
    try {
      return await this.allocateMaterialService.getRequestedSFGItemsForReqId(req);
    } catch (error) {
      return returnException(SPS_R_InvOutItemsForConfirmationIdResponse, error);
    }
  }

  @Post('/createJobBomInfo')
  async createJobBomInfo(@Body() req: SPS_C_ProcJobNumberRequest): Promise<GlobalResponseObject> {
    try {
      return await this.prJobService.createJobBomInfo(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @Post('/issueMaterialForRequestId')
  async issueMaterialForRequestId(@Body() req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.allocateMaterialService.issueMaterialForRequestId(req);
    } catch (error) {
      return returnException(GlobalResponseObject, error);
    }
  }

  @ApiBody({ type: PTS_C_TranLogIdRequest })
  @Post('/updateJobRepQtysByTransId')
  async updateJobRepQtysByTransId(@Body() req: PTS_C_TranLogIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.sewJobRepService.updateJobRepQtysByTransId(req);
    } catch (err) {
      console.log(err);
      return returnException(GlobalResponseObject, err);
    }
  }

  @ApiBody({ type: SPS_C_JobNumbersForReconciliationRequest })
  @Post('/updateJobReconciliationStatus')
  async updateJobReconciliationStatus(@Body() req: SPS_C_JobNumbersForReconciliationRequest): Promise<GlobalResponseObject> {
    try {
      return await this.sewJobRepService.updateJobReconciliationStatus(req);
    } catch (err) {
      console.log(err);
      return returnException(GlobalResponseObject, err);
    }
  }


  @ApiBody({ type: WMS_C_IssuanceIdRequest })
  @Post('/updateIssuedMaterialFromWms')
  async updateIssuedMaterialFromWms(@Body() req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.allocateMaterialService.updateIssuedMaterialFromWms(req);
    } catch (err) {
      console.log(err);
      return returnException(GlobalResponseObject, err);
    }
  }


  @Post('/getJobMaterialSummary')
  async getJobMaterialSummary(@Body() req: any): Promise<any> {
    try {
      return await this.allocateMaterialService.getJobMaterialSummary(9);
    } catch (err) {
      console.log(err);
      return returnException(null, err);
    }
  }

}
