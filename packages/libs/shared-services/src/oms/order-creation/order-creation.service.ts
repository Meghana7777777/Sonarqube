

import { CommonRequestAttrs, GlobalResponseObject, ManufacturingOrderDumpRequest, ManufacturingOrderPreviewData, MO_R_OslBundlesResponse, MoCombinationRequest, MoCombinationWithPslIdsResponse, MoConfigStatusEnum, MOHeaderInfoModel, MOHeaderInfoModelResponse, MOHeaderModelReqModel, MoNumberDropdownResponse, MOPreviewResponse, MoPslIdsOrderFeaturesResponse, MoPslIdsRequest, MoSummaryPreviewData, MOSummaryPreviewResponse, ProcessingOrderCreationInfoResponse, SI_ManufacturingOrderInfoAbstractResponse, SI_ManufacturingOrderInfoResponse, SI_MoNumberRequest, SI_MoProductIdRequest, SI_MoProductSubLineIdsRequest, StyleCodeRequest, StyleCodesDropdownResponse, StyleMoRequest, StyleProductFgColorResp } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OMSCommonAxiosService } from "../oms-common-axios-service";
import { assignAndGetLoaingReqStatusForHeaders } from "../../loading-helper";

export class OrderCreationService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-creation/' + childUrl;
    }

    async getDistinctProductFgColorInfoForMO(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDistinctProductFgColorInfoForMO'), reqModel, config);
    }

    async upLoadOrders(reqModel: ManufacturingOrderDumpRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('upLoadOrders'), reqModel, config);
    }

    async deleteOrders(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOrders'), reqModel, config);
    }

    async confirmManufacturingOrder(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmManufacturingOrder'), reqModel, config);
    }
    async getManufacturingOrdersList(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getManufacturingOrdersList'), reqModel, config);
    }

    async getOrderInfoByManufacturingOrderNo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfoByManufacturingOrderNo'), reqModel, config);
    }

    // FOR GETTING MO BOM WHICH IS UPLOADED
    async getOrderInfoByManufacturingOrderProductCodeFgColor(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfoByManufacturingOrderProductCodeFgColor'), reqModel, config);
    }

    async getUnConfirmedManufacturingOrdersInfo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnConfirmedManufacturingOrdersInfo'), reqModel, config);
    }

    async getMoInfoByPslId(reqModel: SI_MoProductSubLineIdsRequest, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoInfoByPslId'), reqModel, config);
        // return {
        //     status: true,
        //     errorCode: 0,
        //     internalMessage: "Data fetched successfully",
        //     data: [
        //         {
        //             moNumber: "MO001",
        //             moPk: 101,
        //             confirmed: true,
        //             configStatus: MoConfigStatusEnum.OPEN,
        //             style: "Style001",
        //             uploadedDate: "2025-04-01",
        //             moLineModel: [
        //                 {
        //                     moLineNo: "Line1",
        //                     moLinePk: 201,
        //                     configStatus: MoConfigStatusEnum.OPEN,
        //                     moLineProducts: [
        //                         {
        //                             moLine: "Line1",
        //                             moNumber: "MO001",
        //                             productName: "Product A",
        //                             fgColor: "Red",
        //                             subLines: [
        //                                 {
        //                                     color: "Red",
        //                                     size: "M",
        //                                     qty: 50,
        //                                     moLine: "Line1",
        //                                     moNumber: "MO001",
        //                                     moProdSubLineAttrs: {
        //                                         destination: "New York",
        //                                         delDate: "2025-04-10",
        //                                         vpo: "VPO001",
        //                                         prodName: "Product A",
        //                                         co: "CO001",
        //                                         style: "Style001",
        //                                         color: "Red",
        //                                         size: "M",
        //                                         qty: 50,
        //                                         refNo: "REF001",
        //                                         pcd: "2025-04-05",
        //                                         buyerPo: "BPO001"
        //                                     },
        //                                     pk: 301, // Matches moProductSubLineId in ProcessingOrderCreationRequest
        //                                     moProdSubLineOrdFeatures: {
        //                                         moNumber: ["MO001"],
        //                                         moLineNumber: ["Line1", "Line2"],
        //                                         moOrderSubLineNumber: ["MO001"],
        //                                         planDeliveryDate: ["2025-04-01"],
        //                                         coNumber: ["CO001"],
        //                                         businessHead: ["Head1"],
        //                                         customerName: ["Customer1"],
        //                                         exFactoryDate: ["2025-04-15"],
        //                                         moClosedDate: ["2025-04-20"],
        //                                         moCreationDate: ["2025-03-01"],
        //                                         planCutDate: ["2025-04-05"],
        //                                         planProductionDate: ["2025-04-08"],
        //                                         schedule: ["Schedule1"],
        //                                         styleCode: ["Style001"],
        //                                         styleDescription: "Description1",
        //                                         styleName: "Style Name 1",
        //                                         zFeature: ["Feature1"]
        //                                     }
        //                                 }
        //                             ],
        //                             rmInfo: [],
        //                             opInfo: [],
        //                             opRmInfo: [],
        //                             moLineProdcutAttrs: {
        //                                 delDates: ["2025-04-10"],
        //                                 destinations: ["New York"],
        //                                 styles: ["Style001"],
        //                                 products: ["Product A"],
        //                                 co: ["CO001"],
        //                                 vpo: ["VPO001"]
        //                             },
        //                             productCode: "",
        //                             productType: ""
        //                         }
        //                     ],
        //                     moLineAttrs: {
        //                         delDates: ["2025-04-10"],
        //                         destinations: ["New York"],
        //                         styles: ["Style001"],
        //                         products: ["Product A"],
        //                         co: ["CO001"],
        //                         vpo: ["VPO001"]
        //                     }
        //                 }
        //             ],
        //             moAtrs: {
        //                 delDates: ["2025-04-10"],
        //                 destinations: ["New York"],
        //                 styles: ["Style001"],
        //                 products: ["Product A"],
        //                 co: ["CO001"],
        //                 vpo: ["VPO001"]
        //             },
        //             moRm: []
        //         }
        //     ]
        // };
    }

    async getMoNumbersForStyleCode(req: StyleCodeRequest, config?: AxiosRequestConfig): Promise<MoNumberDropdownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoNumbersForStyleCode'), req, config);
        return {
            status: true,
            errorCode: 0,
            internalMessage: "Data fetched successfully",
            data: [
                {
                    moNumber: "MO001",
                    moPk: 101
                },
                {
                    moNumber: "MO002",
                    moPk: 102
                },
                {
                    moNumber: "MO003",
                    moPk: 103
                },
                {
                    moNumber: "MO004",
                    moPk: 104
                },
                {
                    moNumber: "MO005",
                    moPk: 105
                }
            ]
        };
    }


    async getStyleCodes(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<StyleCodesDropdownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleCodes'), req, config);
        return {
            status: true,
            errorCode: 0,
            internalMessage: "Data fetched successfully",
            data: [
                {
                    styleCode: "ST001",
                    styleName: "Casual Shirt",
                    styleDescription: "A comfortable and stylish casual shirt."
                },
                {
                    styleCode: "ST002",
                    styleName: "Formal Pants",
                    styleDescription: "Elegant formal pants suitable for office wear."
                },
                {
                    styleCode: "ST003",
                    styleName: "Leather Jacket",
                    styleDescription: "A premium black leather jacket for winter."
                },
                {
                    styleCode: "ST004",
                    styleName: "Sports T-Shirt",
                    styleDescription: "A lightweight and breathable sports t-shirt."
                },
                {
                    styleCode: "ST005",
                    styleName: "Running Shoes",
                    styleDescription: "Durable and comfortable running shoes."
                }
            ]
        };
    }

    //method for mo creation screen
    async getMoInfoForMoCreation(req: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderCreationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoInfoForMoCreation'), req, config);
    }

    async getOpenMo(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpenMo'), req, config);
    }

    async getInProgressMo(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInProgressMo'), req, config);
    }

    async getClosedMo(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_ManufacturingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getClosedMo'), req, config);
    }

    async proceedOpenToInprogress(req: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('proceedOpenToInprogress'), req, config);
    }

    async getMoInfoHeader(req: SI_MoProductIdRequest, config?: AxiosRequestConfig): Promise<MOHeaderInfoModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoInfoHeader'), req, config);
    }

    async getMoPreviewData(req: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<MOPreviewResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoPreviewData'), req, config);
    }

    async getMoSummaryPreviewData(req: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<MOSummaryPreviewResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoSummaryPreviewData'), req, config);
    }

    async getBundlesForPslId(req: SI_MoProductSubLineIdsRequest, config?: AxiosRequestConfig): Promise<MO_R_OslBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundlesForPslId'), req, config);
    }

    async getPslIdsForMoCombinations(req: MoCombinationRequest, config?: AxiosRequestConfig): Promise<MoCombinationWithPslIdsResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPslIdsForMoCombinations'), req, modifiedConfig);
    }

    async getOrderFeaturesForGivenPslIds(req: MoPslIdsRequest, config?: AxiosRequestConfig): Promise<MoPslIdsOrderFeaturesResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderFeaturesForGivenPslIds'), req, modifiedConfig);
    }



}
