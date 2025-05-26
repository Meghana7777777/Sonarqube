import { Body, Controller, Post } from '@nestjs/common';
import { KnittingJobsService } from './knitting-jobs.service';
import { GlobalResponseObject, KC_KnitJobIdRequest, KC_KnitOrderJobsResponse, KC_KnitRatioPoSerialRequest, KnitIdsRequest, KnitJobConsumptionRequest, KnitJobObjectResponse, KnitJobSizeWiseConsumptionResponse, MoOperationReportedQtyInfoResponse, MoPslIdProcessTypeReq, PoWhRequestDataResponse, PoWhRequestLinesDataResponse, PoWhRequestMaterialDataResponse, ProcessingSerialProdCodeRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('knitting-jobs')
export class KnittingJobsController {
    constructor(
        private service: KnittingJobsService
    ) { }

    /**
     * Service to create Knitting Jobs for knitting group ratio
     * 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    @Post('/createJobsForKnitGroupRatio')
    async createJobsForKnitGroupRatio(@Body() reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createJobsForKnitGroupRatio(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/deleteJobsForKnitGroupRatio')
    async deleteJobsForKnitGroupRatio(@Body() reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteJobsForKnitGroupRatio(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/confirmJobsForPoAndProduct')
    async confirmJobsForPoAndProduct(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmJobsForPoAndProduct(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/unConfirmJobsForPoAndProduct')
    async unConfirmJobsForPoAndProduct(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.unConfirmJobsForPoAndProduct(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/confirmJobsForKnitGroupRatio')
    async confirmJobsForKnitGroupRatio(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmJobsForPoAndProduct(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
    * Service to create knit jobs by PO and product code
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/getKnitJobsByPoAndProductCode')
    async getKnitJobsByPoAndProductCode(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitOrderJobsResponse> {
        try {
            return await this.service.getKnitJobsByPoAndProductCode(reqObj);
        } catch (error) {
            console.log(error);
            return returnException(KC_KnitOrderJobsResponse, error);
        }
    }

    /**
    * Service to get the jobs details for given knit job id
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/getKnitJobDetailsForKnitJobId')
    async getKnitJobDetailsForKnitJobId(@Body() reqObj: KC_KnitJobIdRequest): Promise<KC_KnitOrderJobsResponse> {
        try {
            return await this.service.getKnitJobDetailsForKnitJobId(reqObj);
        } catch (error) {
            return returnException(KC_KnitOrderJobsResponse, error);
        }
    }

    @Post('/confirmJobsForRatioId')
    async confirmJobsForRatioId(@Body() reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmJobsForRatioId(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/unConfirmJobsForForRatioId')
    async unConfirmJobsForForRatioId(@Body() reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.unConfirmJobsForForRatioId(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getKnitJobObjectDetailsByJobNumber')
    async getKnitJobObjectDetailsByJobNumber(@Body() reqObj: KC_KnitJobIdRequest): Promise<KnitJobObjectResponse> {
        try {
            return await this.service.getKnitJobObjectDetailsByJobNumber(reqObj);
        } catch (error) {
            return returnException(KnitJobObjectResponse, error);
        }
    }

    @Post('/getSizeWiseConsumptionDataForJobNumber')
    async getSizeWiseConsumptionDataForJobNumber(@Body() reqObj: KnitJobConsumptionRequest): Promise<KnitJobSizeWiseConsumptionResponse> {
        try {
            return await this.service.getSizeWiseConsumptionDataForJobNumber(reqObj);
        } catch (error) {
            return returnException(KnitJobSizeWiseConsumptionResponse, error);
        }
    }

    @Post('/getPoWhRequestDataForPoSerial')
    async getPoWhRequestDataForPoSerial(@Body() reqObj: KnitIdsRequest): Promise<PoWhRequestDataResponse> {
        try {
            return await this.service.getPoWhRequestDataForPoSerial(reqObj);
        } catch (error) {
            return returnException(PoWhRequestDataResponse, error);
        }
    }


    @Post('/getPoWhRequestLinesDataForPoWhRequestId')
    async getPoWhRequestLinesDataForPoWhRequestId(@Body() reqObj: KnitIdsRequest): Promise<PoWhRequestLinesDataResponse> {
        try {
            return await this.service.getPoWhRequestLinesDataForPoWhRequestId(reqObj);
        } catch (error) {
            return returnException(PoWhRequestLinesDataResponse, error);
        }
    }

    @Post('/getPoWhRequestMaterialDataForPoWhRequestLinesId')
    async getPoWhRequestMaterialDataForPoWhRequestLinesId(@Body() reqObj: KnitIdsRequest): Promise<PoWhRequestMaterialDataResponse> {
        try {
            return await this.service.getPoWhRequestMaterialDataForPoWhRequestLinesId(reqObj);
        } catch (error) {
            return returnException(PoWhRequestMaterialDataResponse, error);
        }
    }

    @Post('/getQtyInfoForGivenPslIdAndProcType')
    async getQtyInfoForGivenPslIdAndProcType(@Body() reqObj: MoPslIdProcessTypeReq): Promise<MoOperationReportedQtyInfoResponse> {
        try {
            return await this.service.getQtyInfoForGivenPslIdAndProcType(reqObj);
        } catch (error) {
            return returnException(MoOperationReportedQtyInfoResponse, error);
        }
    }



    
}
