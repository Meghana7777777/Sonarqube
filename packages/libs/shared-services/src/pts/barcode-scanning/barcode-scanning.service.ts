import { BarcodeDetailsForBundleScanning, BarcodeDetailsResponse, BarcodeScanningResultResponse, BarcodeScanningStatusModel, BarcodeTypesEnum, BundleScanningRequest, JobBarcodeTypeEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { PTSCommonAxiosService } from "../pts-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class BarcodeScanningService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-reporting/' + childUrl;
    }

    async getBarcodeDetailsForManualScanning(reqModel?: BundleScanningRequest, config?: AxiosRequestConfig): Promise<BarcodeDetailsResponse> {
        // return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeDetailsForManualScanning'), reqModel, config);
        const res: any = {
            "status": true,
            "errorCode": 0,
            "internalMessage": "Barcode details fetched successfully",
            "data": {
                "barcode": "12345ABC67890",
                "barcodeType": JobBarcodeTypeEnum.JOB_BUNDLE,
                "barcodeProps": {
                    "moNumber": "MO123456",
                    "style": "Casual Shirt",
                    "moLineNo": "10",
                    "destination": "Warehouse A",
                    "plannedDelDate": "2025-01-31",
                    "planProdDate": "2025-01-15",
                    "planCutDate": "2025-01-10",
                    "coLine": "COL123",
                    "buyerPo": "PO56789",
                    "moNumbers": "MO112233",
                    "productName": "Men's Shirt",
                    "fgColor": "Blue",
                    "size": "L"
                },
                "colorAndSizeDetails": [
                    {
                        "color": "Red",
                        "sizesDetails": [
                            {
                                "size": "M",
                                "originalQty": 100,
                                "reportedQty": 50,
                                "eligibleToReportQty": 30,
                                "reportingGoodQty": 20,
                                "rejectionDetails": [
                                    {
                                        "reasonCode": "QC01",
                                        "rejectedQty": 5
                                    },
                                    {
                                        "reasonCode": "QC02",
                                        "rejectedQty": 3
                                    }
                                ]
                            },
                            {
                                "size": "L",
                                "originalQty": 80,
                                "reportedQty": 40,
                                "eligibleToReportQty": 25,
                                "reportingGoodQty": 15,
                                "rejectionDetails": [
                                    {
                                        "reasonCode": "QC03",
                                        "rejectedQty": 10
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "color": "Blue",
                        "sizesDetails": [
                            {
                                "size": "S",
                                "originalQty": 50,
                                "reportedQty": 30,
                                "eligibleToReportQty": 15,
                                "reportingGoodQty": 10,
                                "rejectionDetails": [
                                    {
                                        "reasonCode": "QC04",
                                        "rejectedQty": 5
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "operationCode": "OP1234",
                "processType": ProcessTypeEnum.CUT
            }
        } as any;
        return res;
    }

    async barcodeAutoReporting(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<BarcodeScanningResultResponse> {
        // return await this.axiosPostCall(this.getURLwithMainEndPoint('barcodeAutoReporting'), reqModel, config);
        return {
            "status": true,
            "errorCode": 0,
            "internalMessage": "Barcode scanning completed successfully",
            "data": {
                "barcode": "789XYZ456",
                "barcodeType": JobBarcodeTypeEnum.JOB_BUNDLE,
                "barcodeProps": {
                    "moNumber": "MO987654",
                    "style": "Formal Pants",
                    "moLineNo": "20",
                    "destination": "Warehouse B",
                    "plannedDelDate": "2025-02-15",
                    "planProdDate": "2025-02-01",
                    "planCutDate": "2025-01-25",
                    "coLine": "COL789",
                    "buyerPo": "PO12345",
                    "moNumbers": "MO556677",
                    "productName": "Men's Pants",
                    "fgColor": "Black",
                    "size": "XL"
                },
                "totalGoodQuantity": 100,
                "totalRejectedQuantity": 15,
                "operationCode": "OP5678",
                "processType": ProcessTypeEnum.CUT,
                "sessionId": 12345,
                "qualityType": "A-Grade",
                "status" : true,
            }
        }

    }

    async barcodeManualReporting(reqModel: BarcodeDetailsForBundleScanning, config?: AxiosRequestConfig): Promise<BarcodeScanningResultResponse> {
        // return await this.axiosPostCall(this.getURLwithMainEndPoint('barcodeManualReporting'), reqModel, config);
        return {
            "status": true,
            "errorCode": 0,
            "internalMessage": "Barcode scanning completed successfully",
            "data": {
                "barcode": "789XYZ456",
                "barcodeType": JobBarcodeTypeEnum.JOB_BUNDLE,
                "barcodeProps": {
                    "moNumber": "MO987654",
                    "style": "Formal Pants",
                    "moLineNo": "20",
                    "destination": "Warehouse B",
                    "plannedDelDate": "2025-02-15",
                    "planProdDate": "2025-02-01",
                    "planCutDate": "2025-01-25",
                    "coLine": "COL789",
                    "buyerPo": "PO12345",
                    "moNumbers": "MO556677",
                    "productName": "Men's Pants",
                    "fgColor": "Black",
                    "size": "XL"
                },
                "totalGoodQuantity": 100,
                "totalRejectedQuantity": 15,
                "operationCode": "OP5678",
                "processType": ProcessTypeEnum.CUT,
                "sessionId": 12345,
                "qualityType": "A-Grade",
                "status" : true,
            }
        }
    }
}