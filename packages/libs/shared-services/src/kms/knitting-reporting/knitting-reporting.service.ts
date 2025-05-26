import { GlobalResponseObject, KC_KnitJobIdRequest, KC_KnitOrderJobsResponse, KC_KnitRatioPoSerialRequest, KJ_C_KnitJobReportingRequest, KJ_R_LocationKnitJobsSummaryRequest, KJ_R_LocationKnitJobsSummaryResponse, KMS_C_KnitOrderBundlesConfirmationRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_ELGBUN_C_KnitProcSerialRequest, KMS_R_KnitBundlingProductColorBundlingSummaryRequest, KMS_R_KnitBundlingProductColorBundlingSummaryResponse, KMS_R_KnitJobBundlingMapResponse, KMS_R_KnitOrderConfirmedBundlesResponse, KMS_R_KnitOrderElgBundlesResponse, ProcessingSerialProdCodeRequest, ProcessTypeEnum } from "@xpparel/shared-models";
import { KJ_C_KnitJobNumberRequest, KJ_R_KnitJobReportedQtyResponse, } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";

export class KnittingReportingService extends KMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/knit-reporting/' + childUrl;
    }

    async getKnitJobReportedSummaryForJobNumbersUnderALocationId(reqObj: KJ_R_LocationKnitJobsSummaryRequest, config?: AxiosRequestConfig): Promise<KJ_R_LocationKnitJobsSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobReportedSummaryForJobNumbersUnderALocationId'), reqObj, config);
    }

    async reportKnitJob(reqObj: KJ_C_KnitJobReportingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportKnitJob'), reqObj, config);
    }

    async getKnitOrderBundlingSummaryForProductCodeAndColor(req: KMS_R_KnitBundlingProductColorBundlingSummaryRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitBundlingProductColorBundlingSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitOrderBundlingSummaryForProductCodeAndColor'), req, config);

    }

    async getEligibleBundlesForKnitOrder(req: KMS_ELGBUN_C_KnitProcSerialRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitOrderElgBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleBundlesForKnitOrder'), req, config);

        //     status: true,
        //     errorCode: 0,
        //     internalMessage: "Dummy eligible bundles fetched successfully",
        //     data: [
        //         {
        //             procSerial: req.procSerial || 1234,
        //             processType: ProcessTypeEnum.KNIT,
        //             productCode: "PROD001",
        //             productName: "Cool Cotton Tee",
        //             elgBundles: [
        //                 {
        //                     bundleNumber: "BN001",
        //                     pslId: 1001,
        //                     quantity: 50,
        //                     color: "Red",
        //                     size: "M"
        //                 },
        //                 {
        //                     bundleNumber: "BN003",
        //                     pslId: 1001,
        //                     quantity: 50,
        //                     color: "orange",
        //                     size: "M"
        //                 },
        //                 {
        //                     bundleNumber: "BN004",
        //                     pslId: 1001,
        //                     quantity: 50,
        //                     color: "green",
        //                     size: "M"
        //                 },
        //                 {
        //                     bundleNumber: "BN002",
        //                     pslId: 1002,
        //                     quantity: 40,
        //                     color: "Red",
        //                     size: "L"
        //                 }
        //             ]
        //         },
        //         {
        //             procSerial: req.procSerial || 1234,
        //             processType: ProcessTypeEnum.KNIT,
        //             productCode: "PROD002",
        //             productName: "Summer Polo",
        //             elgBundles: [
        //                 {
        //                     bundleNumber: "BN003",
        //                     pslId: 1003,
        //                     quantity: 60,
        //                     color: "Blue",
        //                     size: "S"
        //                 },
        //                 {
        //                     bundleNumber: "BN004",
        //                     pslId: 1004,
        //                     quantity: 55,
        //                     color: "Blue",
        //                     size: "XL"
        //                 }
        //             ]
        //         }
        //     ]
        // };
    }

    async confirmProductBundlesForBundling(req: KMS_C_KnitOrderBundlesConfirmationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmProductBundlesForBundling'), req, config);
    }

    async getKnitJobRepQtysForKitJobNumber(reqObj: KJ_C_KnitJobNumberRequest, config?: AxiosRequestConfig): Promise<KJ_R_KnitJobReportedQtyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobRepQtysForKitJobNumber'), reqObj, config);
    }

    async getTheBundlesAgainstConfirmationId(reqObj: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitOrderConfirmedBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTheBundlesAgainstConfirmationId'), reqObj, config);
    }

    async updateExtSystemAckForBundlingConfirmation(reqObj: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateExtSystemAckForBundlingConfirmation'), reqObj, config);
    }

    async updatePtsSystemAckForBundlingConfirmation(reqObj: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePtsSystemAckForBundlingConfirmation'), reqObj, config);
    }

    async getPoBundlingDepMapForCoonfirmationIds(reqObj: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitJobBundlingMapResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoBundlingDepMapForCoonfirmationIds'), reqObj, config);
    }
}
