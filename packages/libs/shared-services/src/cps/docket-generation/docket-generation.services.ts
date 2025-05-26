import { BarcodeDetailsResponse, BundleScanningRequest, ComponentBundleBarCodeInfoResponse, ConsumedBundleInfoRequest, CutBundleInfoResponse, CutEligibilityInfoResp, DocBundleInfoForFgsResp, DocBundlePanelsRequest, DocMaterialAllocationRequest, DocMaterialAllocationResponse, DocketBasicInfoResponse, DocketDetailedInfoResponse, DocketGroupBasicInfoResponse, DocketGroupDetailedInfoResponse, DocketGroupResponseModel, DocketHeaderResponse, DocketNumberResponse, DocketsCardDetailsResponse, DocketsConfirmationListResponse, FeatureGroupCutDetailsResp, FgColorSizeCompRequest, FgFindingOptions, GetReportedBundleReqModel, GlobalResponseObject, ItemCodeInfoResponse, KnitJobRequest, MarkerSpecificDocketsResponse, MaterialRequestNoRequest, MinEligibleCompPanelsResp, PoDocketGroupRequest, PoDocketNumberRequest, PoProdutNameRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoSerialRequest, RemarkDocketGroupResponse, TransactionIdFgNumbersReq } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class DocketGenerationServices extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/docket-generation/' + childUrl;
    }

    async generateDockets(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('generateDockets'), reqModel, config);
    }

    async generateDocketBundles(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('generateDocketBundles'), reqModel, config);
    }

    async deleteDockets(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteDockets'), reqModel, config);
    }

    async confirmDockets(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmDockets'), reqModel, config);
    }

    async unConfirmDockets(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmDockets'), reqModel, config);
    }

    async generatePanelsForDocBundle(reqModel: DocBundlePanelsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('generatePanelsForDocBundle'), reqModel, config);
    }

    async getDocketsConfimrationListForPo(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<DocketsConfirmationListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketsConfimrationListForPo'), reqModel, config);
    }

    async getDocketsBasicInfoForPo(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<DocketBasicInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketsBasicInfoForPo'), reqModel, config);
    }

    async getDocketsBasicInfoForDocketNumber(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<DocketBasicInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketsBasicInfoForDocketNumber'), reqModel, config);
    }

    async getDocketsMappedForPoMarker(reqModel: PoRatioIdMarkerIdRequest, config?: AxiosRequestConfig): Promise<MarkerSpecificDocketsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketsMappedForPoMarker'), reqModel, config);
    }

    async getDocketNumbersForPo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<DocketNumberResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketNumbersForPo'), reqModel, config);
    }

    // currently not used
    async getDocketDetailedInfo(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<DocketDetailedInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketDetailedInfo'), reqModel, config);
    }

    async getDocketGroupDetailedInfo(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<DocketGroupDetailedInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketGroupDetailedInfo'), reqModel, config);
    }

    async getDocketGroupsBasicInfoForPo(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<DocketGroupBasicInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketGroupsBasicInfoForPo'), reqModel, config);
    }

    async getDocketGroupsBasicInfoForDocketGroup(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<DocketGroupBasicInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketGroupsBasicInfoForDocketGroup'), reqModel, config);
    }

    async createRemarksDocketGroup(reqModel: any, config?: AxiosRequestConfig): Promise<RemarkDocketGroupResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createRemarksDocketGroup'), reqModel, config);
    }

    async getKPICardDetailsForCadAndPlanning(reqModel: DocketGroupResponseModel, config?: AxiosRequestConfig): Promise<DocketsCardDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKPICardDetailsForCadAndPlanning'), reqModel, config);
    }

    async getDataForMainHeader(reqModel: DocketGroupResponseModel, config?: AxiosRequestConfig): Promise<DocketHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDataForMainHeader'), reqModel, config);
    }

    // async getEligibleDocBundleInfoForSewJobGen(reqModel: FgFindingOptions, config?: AxiosRequestConfig): Promise<FeatureGroupCutDetailsResp> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleDocBundleInfoForSewJobGen'), reqModel, config);
    // }


    // async getDocPanelInfoForColorSizeFgNumbers(reqModel: FgColorSizeCompRequest[], config?: AxiosRequestConfig): Promise<CutEligibilityInfoResp> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocPanelInfoForColorSizeFgNumbers'), reqModel, config);
    // }

    // async updateTransactionIdAndStatusForFgs(reqModel: TransactionIdFgNumbersReq, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTransactionIdAndStatusForFgs'), reqModel, config);
    // }

    // async generateKnittingForKnittingRatio(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('generateKnittingForKnittingRatio'), reqModel, config);
    // }

    // async getReportedBundleInfo(reqModel: GetReportedBundleReqModel, config?: AxiosRequestConfig): Promise<CutBundleInfoResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getReportedBundleInfo'), reqModel, config);
    // }

    // async updateConsumedStatusAgainstToCompBundle(reqModel: ConsumedBundleInfoRequest, config?: AxiosRequestConfig): Promise<CutBundleInfoResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('updateConsumedStatusAgainstToCompBundle'), reqModel, config);
    // }

    // async getDocketBundleInfoByBarcode(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<BarcodeDetailsResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketBundleInfoByBarcode'), reqModel, config);
    // }

    // async getComponentBarcodeInfoByDocketNo(reqModel: KnitJobRequest, config?: AxiosRequestConfig): Promise<ComponentBundleBarCodeInfoResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getComponentBarcodeInfoByDocketNo'), reqModel, config);
    // }

    async createPoDocketSerialDetails(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPoDocketSerialDetails'), reqModel, config);
    }
}
