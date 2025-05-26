import { GlobalResponseObject, KC_KnitJobIdRequest, KC_KnitOrderJobsResponse, KC_KnitRatioPoSerialRequest, KnitIdsRequest, KnitJobConformationViewModelResponse, KnitJobConsumptionRequest, KnitJobNumberRequest, KnitJobObjectResponse, KnitJobSizeWiseConsumptionResponse, MoOperationReportedQtyInfoResponse, MoPslIdProcessTypeReq, PoWhRequestDataResponse, PoWhRequestLinesDataResponse, PoWhRequestMaterialDataResponse, ProcessingSerialProdCodeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";
import { assignAndGetLoaingReqStatusForHeaders } from "../../loading-helper";

export class KnittingJobsService extends KMSCommonAxiosService {

  private getURLwithMainEndPoint(childUrl: string) {
    return '/knitting-jobs/' + childUrl;
  }

  /**
   * Service to create Knitting Jobs for knitting group ratio
   * 
   * @param reqObj 
   * @param config 
   * @returns 
  */
  async createJobsForKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('createJobsForKnitGroupRatio'), reqObj, config);
  }


  /**
  * Service to create Knitting Jobs for knitting group ratio
  * 
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async deleteJobsForKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteJobsForKnitGroupRatio'), reqObj, config);
  }

  /**
  * Service to create Knitting Jobs for knitting group ratio
  * 
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async confirmJobsForPoAndProduct(reqObj: ProcessingSerialProdCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmJobsForPoAndProduct'), reqObj, config);
  }

  /**
  * Service to create Knitting Jobs for knitting group ratio
  * 
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async unConfirmJobsForPoAndProduct(reqObj: ProcessingSerialProdCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmJobsForPoAndProduct'), reqObj, config);
  }


  /**
  * Service to create Knitting Jobs for knitting group ratio
  * 
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async confirmJobsForKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('createKnitGroupRatio'), reqObj, config);
  }

  /**
  * Service to create knit jobs by PO and product code
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async getKnitJobsByPoAndProductCode(reqObj: ProcessingSerialProdCodeRequest, config?: AxiosRequestConfig): Promise<KC_KnitOrderJobsResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobsByPoAndProductCode'), reqObj, config);
  }


  /**
  * Service to get the jobs details for given knit job id
  * @param reqObj 
  * @param config 
  * @returns 
 */
  async getKnitJobDetailsForKnitJobId(reqObj: KC_KnitJobIdRequest, config?: AxiosRequestConfig): Promise<KC_KnitOrderJobsResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobDetailsForKnitJobId'), reqObj, config);
  }



  async confirmJobsForRatioId(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmJobsForRatioId'), reqObj, config);
  }


  async unConfirmJobsForForRatioId(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmJobsForForRatioId'), reqObj, config);
  }

  async getKnitJobObjectDetailsByJobNumber(reqObj: KnitJobNumberRequest, config?: AxiosRequestConfig): Promise<KnitJobObjectResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobObjectDetailsByJobNumber'), reqObj, config);
  }

  async getSizeWiseConsumptionDataForJobNumber(reqObj: KnitJobConsumptionRequest, config?: AxiosRequestConfig): Promise<KnitJobSizeWiseConsumptionResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getSizeWiseConsumptionDataForJobNumber'), reqObj, config);
  }

  async getPoWhRequestDataForPoSerial(reqObj: KnitIdsRequest, config?: AxiosRequestConfig): Promise<PoWhRequestDataResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoWhRequestDataForPoSerial'), reqObj, config);
  }

  async getPoWhRequestLinesDataForPoWhRequestId(reqObj: KnitIdsRequest, config?: AxiosRequestConfig): Promise<PoWhRequestLinesDataResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoWhRequestLinesDataForPoWhRequestId'), reqObj, config);
  }

  async getPoWhRequestMaterialDataForPoWhRequestLinesId(reqObj: KnitIdsRequest, config?: AxiosRequestConfig): Promise<PoWhRequestMaterialDataResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoWhRequestMaterialDataForPoWhRequestLinesId'), reqObj, config);
  }


  async getQtyInfoForGivenPslIdAndProcType(reqObj: MoPslIdProcessTypeReq, config?: AxiosRequestConfig): Promise<MoOperationReportedQtyInfoResponse> {
    const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getQtyInfoForGivenPslIdAndProcType'), reqObj, modifiedConfig);
  }

}