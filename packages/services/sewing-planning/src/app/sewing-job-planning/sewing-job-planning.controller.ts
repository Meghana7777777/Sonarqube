import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { BarcodeDetailsForQualityResultsResponse, CommonRequestAttrs, GetModuleByJobNoResponse, GlobalResponseObject, IModuleIdRequest, IPlannningDowntimeResponse, IPlannningJobModelResponse, IPlannningModuleModelResponse, IPlannningSectionModelResponse, IPlannningTrimsResponse, SequencedIJobOperationResponse, SewingIJobNoRequest, SewingJobNoRequest, SewingJobPendingDataResponse, SewingJobPriorityRequest, SewingJobPriorityResponse, SewingOrderIdRequest, SewingOrderLineResponse, SewingOrderResponse, SewingOrdersewSerialResponse, SewSerialIdRequest, SJobFgResponse, SJobLineOperationsResponse, MorderSewSerialRequest } from "@xpparel/shared-models";
import { InputPlanningDashboardService } from "./input-planning-dashboard.service";
import { SewingJobPlanningService } from "./sewing-job-planning.service";
import { BarcodeDetailsForQualityResultsDto } from "./barcode-quality-results.dto";

@ApiTags('Sewing Job Planning')
@Controller('sewing-job-planning')
export class SewingJobPlanningController {
    constructor(
        private sewingJobService: SewingJobPlanningService,
        private iPlanningDashboardService: InputPlanningDashboardService,
    ) {

    }

    // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/getAllSewingOrders')
    // async getAllSewingOrders(@Body() req: any): Promise<SewingOrderResponse> {
    //     try {
    //         return await this.sewingJobService.getAllSewingOrders(req);
    //     } catch (error) {
    //         return returnException(SewingOrderResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewingOrderIdRequest })
    // @Post('/getSewingOrderLinesAgainstSewingOrder')
    // async getSewingOrderLinesAgainstSewingOrder(@Body() req: any): Promise<SewingOrderLineResponse> {
    //     try {
    //         return await this.sewingJobService.getSewingOrderLinesAgainstSewingOrder(req);
    //     } catch (error) {
    //         return returnException(SewingOrderLineResponse, error);
    //     }
    // }

    // @ApiBody({ type: MorderSewSerialRequest })
    // @Post('/getSewSerialsBySOrderAndSOrderLine')
    // async getSewSerialsBySOrderAndSOrderLine(@Body() req: any): Promise<SewingOrdersewSerialResponse> {
    //     try {
    //         return await this.sewingJobService.getSewSerialsBySOrderAndSOrderLine(req);
    //     } catch (error) {
    //         return returnException(SewingOrdersewSerialResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewingJobNoRequest })
    // @Post('/getAllOperationsDataByJobId')
    // async getAllOperationsDataByJobId(@Body() req: any): Promise<SJobLineOperationsResponse> {
    //     try {
    //         return await this.sewingJobService.getAllOperationsDataByJobId(req);
    //     } catch (error) {
    //         return returnException(SJobLineOperationsResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewSerialIdRequest })
    // @Post('/getSewingJobDataBySewSerialCode')
    // async getSewingJobDataBySewSerialCode(@Body() req: any): Promise<SewingJobPendingDataResponse> {
    //     try {
    //         return await this.sewingJobService.getSewingJobDataBySewSerialCode(req);
    //     } catch (error) {
    //         return returnException(SewingJobPendingDataResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewingJobNoRequest })
    // @Post('/updateSewingJobStatus')
    // async updateSewingJobStatus(@Body() req: any): Promise<GlobalResponseObject> {
    //     try {
    //         return await this.sewingJobService.updateSewingJobStatus(req);
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error);
    //     }
    // }

    // @ApiBody({ type: IModuleIdRequest })
    // @Post('/getInprogressJobForJobPriority')
    // async getInprogressJobForJobPriority(@Body() req: any): Promise<SewingJobPriorityResponse> {
    //     try {
    //         return await this.sewingJobService.getInprogressJobForJobPriority(req);
    //     } catch (error) {
    //         return returnException(SewingJobPriorityResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewingJobPriorityRequest })
    // @Post('/updateInprogressJobsJobPriority')
    // async updateInprogressJobsJobPriority(@Body() req: any): Promise<GlobalResponseObject> {
    //     try {
    //         return await this.sewingJobService.updateInprogressJobsJobPriority(req);
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error);
    //     }
    // }

    // //** Input planning dashboard */

    // @ApiBody({ type: SewingJobNoRequest })
    // @Post('/getJobDetailsByJobNo')
    // async getJobDetailsByJobNo(@Body() req: any): Promise<IPlannningJobModelResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getJobDetailsByJobNo(req);
    //     } catch (error) {
    //         return returnException(IPlannningJobModelResponse, error);
    //     }
    // }

    // @ApiBody({ type: IModuleIdRequest })
    // @Post('/getModuledetailsByModuleCode')
    // async getModuledetailsByModuleCode(@Body() req: any): Promise<IPlannningModuleModelResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getModuledetailsByModuleCode(req);
    //     } catch (error) {
    //         return returnException(IPlannningModuleModelResponse, error);
    //     }
    // }

    // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/getInputPlanningdashBoardData')
    // async getInputPlanningdashBoardData(@Body() req: any): Promise<IPlannningSectionModelResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getInputPlanningdashBoardData(req);
    //     } catch (error) {
    //         return returnException(IPlannningSectionModelResponse, error);
    //     }
    // }

    // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/getModuleDowntimeDataByModuleCode')
    // async getModuleDowntimeDataByModuleCode(@Body() req: any): Promise<IPlannningDowntimeResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getModuleDowntimeDataByModuleCode(req);
    //     } catch (error) {
    //         return returnException(IPlannningDowntimeResponse, error);
    //     }
    // }

    // @ApiBody({ type: SewingIJobNoRequest })
    // @Post('/getTrimsDataByJobNo')
    // async getTrimsDataByJobNo(@Body() req: any): Promise<IPlannningTrimsResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getTrimsDataByJobNo(req);
    //     } catch (error) {
    //         return returnException(IPlannningTrimsResponse, error);
    //     }
    // }

    // // @ApiBody({ type: SewingIJobNoRequest })
    // // @Post('/getJobStatusByJobNo')
    // // async getJobStatusByJobNo(@Body() req: any): Promise<IPlannningJobStatusResponse> {
    // //     try {
    // //         return await this.iPlanningDashboardService.getJobStatusByJobNo(req);
    // //     } catch (error) {
    // //         return returnException(IPlannningJobStatusResponse, error);
    // //     }
    // // }

    @ApiBody({ type: SewingIJobNoRequest })
    @Post('/getSequencedOperationsByJobId')
    async getSequencedOperationsByJobId(@Body() req: any): Promise<SequencedIJobOperationResponse> {
        try {
            return await this.iPlanningDashboardService.getSequencedOperationsByJobId(req);
        } catch (error) {
            return returnException(SequencedIJobOperationResponse, error);
        }
    }

    // @ApiBody({ type:SewingIJobNoRequest})
    // @Post('/getSJobFgDataByJobNo')
    // async getSJobFgDataByJobNo(@Body() req:any) : Promise<SJobFgResponse> {
    //     try {
    //         return await this.sewingJobService.getSJobFgDataByJobNo(req);
    //     } catch (error) {
    //         return returnException
    //         (SJobFgResponse,error)
    //     }
    // }

    // @ApiBody({type:SewingIJobNoRequest})
    // @Post('getModuleNoByJobNo')
    // async getModuleNoByJobNo(@Body() req: SewingIJobNoRequest) : Promise<GetModuleByJobNoResponse> {
    //     try {
    //         return await this.sewingJobService.getModuleNoByJobNo(req)
    //     } catch (error) {
    //         return returnException 
    //         ( GetModuleByJobNoResponse , error)
    //     }
    // }

    // @ApiBody({type:BarcodeDetailsForQualityResultsDto})
    // @Post('saveBarcodeQualityDetails')
    // async saveBarcodeQualityDetails(@Body() req: BarcodeDetailsForQualityResultsDto) : Promise<GlobalResponseObject> {
    //     try {
    //         return await this.iPlanningDashboardService.saveBarcodeQualityDetails(req)
    //     } catch (error) {
    //         return returnException( GlobalResponseObject , error)
    //     }
    // }

    // @ApiBody({type:IModuleIdRequest})
    // @Post('getBarcodeQualityDetailsByModuleCode')
    // async getBarcodeQualityDetailsByModuleCode(@Body() req: IModuleIdRequest) : Promise<BarcodeDetailsForQualityResultsResponse> {
    //     try {
    //         return await this.iPlanningDashboardService.getBarcodeQualityDetailsByModuleCode(req)
    //     } catch (error) {
    //         return returnException( BarcodeDetailsForQualityResultsResponse , error)
    //     }
    // }


}