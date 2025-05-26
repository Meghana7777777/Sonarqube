import { CutIdWithCutPrefRequest, DocBundlePanelsRequest, DocMaterialAllocationRequest, DocMaterialAllocationResponse, DocketBasicInfoResponse, DocketCutNumberResponse, DocketNumberResponse, DocketsConfirmationListResponse, GlobalResponseObject, ItemCodeInfoResponse, MarkerSpecificDocketsResponse, MaterialRequestNoRequest, PoCutResponse, PoDocketNumberRequest, PoDocketNumbersRequest, PoProdutNameRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoSerialRequest, PoSerialWithCutPrefRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CutGenerationServices extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/cut-generation/' + childUrl;
    }
    
    async generateCuts(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('generateCuts'), reqModel, config);
    }

    async deleteCuts(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
       
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCuts'), reqModel, config);
    }

    async getCutInfoForPo(reqModel: PoSerialWithCutPrefRequest, config?: AxiosRequestConfig): Promise<PoCutResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutInfoForPo'), reqModel, config);
    }

    async getCutInfoForCutIds(reqModel: CutIdWithCutPrefRequest, config?: AxiosRequestConfig): Promise<PoCutResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutInfoForCutIds'), reqModel, config);
    }

    async getCutNumberForDocket(reqModel: PoDocketNumbersRequest, config?: AxiosRequestConfig): Promise<DocketCutNumberResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutNumberForDocket'), reqModel, config);
    }
}


const data: any = {
  "status": true,
  "errorCode": 0,
  "internalMessage": "Cut info retrieved",
  "data": [
    {
      "cutId": 122,
      "cutNumber": "1",
      "refDocket": "2420",
      "docketsInvolved": [
        "2420"
      ],
      "poSerial": "10",
      "moNumber": "DUMMY1",
      "moLines": [
        "10",
        "20",
        "30"
      ],
      "planQuantity": 2520,
      "plannedBundles": 21,
      "generateOn": "Thu May 23 2024 17:02:49 GMT+0530 (India Standard Time)",
      "dockets": [
        {
          "mo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "bundleGenStatus": 2,
          "cutNumber": 1,
          "docConfirmationSatus": 2,
          "docketNumber": "2420",
          "docketGroup": "2420",
          "fgColor": "NA",
          "itemCode": "F00099-447",
          "markerInfo": {
            "id": 238,
            "mName": "0952-SS-TB TO 6-9M-BULK-S-1",
            "mVersion": "NORMAL",
            "mWidth": "154.34",
            "mLength": "7.5170",
            "pVersion": "BULK-AW24",
            "defaultMarker": false,
            "endAllowance": "3.50",
            "perimeter": "187.61",
            "cadRemarks": "SOLID-NORMAL MARKER",
            "docRemarks": "PRINT-LEFT FRONT"
          },
          "plies": 120,
          "poSerial": 10,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "ratioDesc": "RATIO-01",
          "ratioId": 220,
          "ratioName": "Ratio-17",
          "sizeRatios": [
            {
              "ratio": 3,
              "size": "F/SIZE"
            },
            {
              "ratio": 1,
              "size": "T/BABY"
            },
            {
              "ratio": 4,
              "size": "0-3M"
            },
            {
              "ratio": 4,
              "size": "3-6M"
            },
            {
              "ratio": 3,
              "size": "6-9M"
            },
            {
              "ratio": 3,
              "size": "9-12M"
            },
            {
              "ratio": 2,
              "size": "12-18M"
            },
            {
              "ratio": 1,
              "size": "18-24M"
            }
          ],
          "totalBundles": 21,
          "totalIssuedMrCount": 0,
          "totalMrCount": 0,
          "allocatedQty": 13.46,
          "originalDocQuantity": 2520,
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "isMainDoc": true,
          "layedPlies": 120,
          "materialRequirement": 0,
          "completeBindingDocket": false,
          "cutSubNumber": 1,
          "bindingConsumption": 0,
          "cutWastage": 0,
          "itemDesc": "100% BCI-COTTON 40S/1_KNITS_TUBULAR INTERLOCK_REGULAR_180_75_FIBER DYED_DTM BC01 GREY MARL"
        }
      ],
      "actualDockets": [
        {
          "layId": 22,
          "poSerial": 10,
          "docketNumber": "2420",
          "docketGroup": "2420",
          "itemCode": "F00099-447",
          "itemDesc": "F00099-447",
          "docketPlies": 120,
          "actualDocketPlies": 1,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "cutNumber": 1,
          "cutSubNumber": 0,
          "layNumber": 22,
          "underPolayNumber": 3,
          "totalAdbs": 21,
          "layStatus": 2,
          "cutStatus": 3,
          "labelsPrintStatus": false,
          "moNo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "sizeRatios": [],
          "adBundles": [
            {
              "adbId": 336,
              "shade": "NS",
              "underLayBundleNo": 1,
              "quantity": 1,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-1-1",
              "component": "Back"
            },
            {
              "adbId": 337,
              "shade": "NS",
              "underLayBundleNo": 2,
              "quantity": 1,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-2-1",
              "component": "Back"
            },
            {
              "adbId": 338,
              "shade": "NS",
              "underLayBundleNo": 3,
              "quantity": 1,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 3,
              "panelEnd": 3,
              "barcode": "B:16-3-1",
              "component": "Back"
            },
            {
              "adbId": 339,
              "shade": "NS",
              "underLayBundleNo": 4,
              "quantity": 1,
              "color": null,
              "size": "T/BABY",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-4-1",
              "component": "Back"
            },
            {
              "adbId": 340,
              "shade": "NS",
              "underLayBundleNo": 5,
              "quantity": 1,
              "color": null,
              "size": "0-3M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-5-1",
              "component": "Back"
            },
            {
              "adbId": 341,
              "shade": "NS",
              "underLayBundleNo": 6,
              "quantity": 1,
              "color": null,
              "size": "0-3M",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-6-1",
              "component": "Back"
            },
            {
              "adbId": 342,
              "shade": "NS",
              "underLayBundleNo": 7,
              "quantity": 1,
              "color": null,
              "size": "0-3M",
              "panelStart": 3,
              "panelEnd": 3,
              "barcode": "B:16-7-1",
              "component": "Back"
            },
            {
              "adbId": 343,
              "shade": "NS",
              "underLayBundleNo": 8,
              "quantity": 1,
              "color": null,
              "size": "0-3M",
              "panelStart": 4,
              "panelEnd": 4,
              "barcode": "B:16-8-1",
              "component": "Back"
            },
            {
              "adbId": 344,
              "shade": "NS",
              "underLayBundleNo": 9,
              "quantity": 1,
              "color": null,
              "size": "3-6M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-9-1",
              "component": "Back"
            },
            {
              "adbId": 345,
              "shade": "NS",
              "underLayBundleNo": 10,
              "quantity": 1,
              "color": null,
              "size": "3-6M",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-10-1",
              "component": "Back"
            },
            {
              "adbId": 346,
              "shade": "NS",
              "underLayBundleNo": 11,
              "quantity": 1,
              "color": null,
              "size": "3-6M",
              "panelStart": 3,
              "panelEnd": 3,
              "barcode": "B:16-11-1",
              "component": "Back"
            },
            {
              "adbId": 347,
              "shade": "NS",
              "underLayBundleNo": 12,
              "quantity": 1,
              "color": null,
              "size": "3-6M",
              "panelStart": 4,
              "panelEnd": 4,
              "barcode": "B:16-12-1",
              "component": "Back"
            },
            {
              "adbId": 348,
              "shade": "NS",
              "underLayBundleNo": 13,
              "quantity": 1,
              "color": null,
              "size": "6-9M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-13-1",
              "component": "Back"
            },
            {
              "adbId": 349,
              "shade": "NS",
              "underLayBundleNo": 14,
              "quantity": 1,
              "color": null,
              "size": "6-9M",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-14-1",
              "component": "Back"
            },
            {
              "adbId": 350,
              "shade": "NS",
              "underLayBundleNo": 15,
              "quantity": 1,
              "color": null,
              "size": "6-9M",
              "panelStart": 3,
              "panelEnd": 3,
              "barcode": "B:16-15-1",
              "component": "Back"
            },
            {
              "adbId": 351,
              "shade": "NS",
              "underLayBundleNo": 16,
              "quantity": 1,
              "color": null,
              "size": "9-12M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-16-1",
              "component": "Back"
            },
            {
              "adbId": 352,
              "shade": "NS",
              "underLayBundleNo": 17,
              "quantity": 1,
              "color": null,
              "size": "9-12M",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-17-1",
              "component": "Back"
            },
            {
              "adbId": 353,
              "shade": "NS",
              "underLayBundleNo": 18,
              "quantity": 1,
              "color": null,
              "size": "9-12M",
              "panelStart": 3,
              "panelEnd": 3,
              "barcode": "B:16-18-1",
              "component": "Back"
            },
            {
              "adbId": 354,
              "shade": "NS",
              "underLayBundleNo": 19,
              "quantity": 1,
              "color": null,
              "size": "12-18M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-19-1",
              "component": "Back"
            },
            {
              "adbId": 355,
              "shade": "NS",
              "underLayBundleNo": 20,
              "quantity": 1,
              "color": null,
              "size": "12-18M",
              "panelStart": 2,
              "panelEnd": 2,
              "barcode": "B:16-20-1",
              "component": "Back"
            },
            {
              "adbId": 356,
              "shade": "NS",
              "underLayBundleNo": 21,
              "quantity": 1,
              "color": null,
              "size": "18-24M",
              "panelStart": 1,
              "panelEnd": 1,
              "barcode": "B:16-21-1",
              "component": "Back"
            }
          ],
          "isMainDoc": true,
          "color": "NA",
          "originalDocQuantity": 120,
          "dispatchCreated": false,
          "dispatchReqNo": ""
        },
        {
          "layId": 24,
          "poSerial": 10,
          "docketNumber": "2420",
          "docketGroup": "2420",
          "itemCode": "F00099-447",
          "itemDesc": "F00099-447",
          "docketPlies": 120,
          "actualDocketPlies": 119,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "cutNumber": 1,
          "cutSubNumber": 0,
          "layNumber": 24,
          "underPolayNumber": 5,
          "totalAdbs": 21,
          "layStatus": 2,
          "cutStatus": 3,
          "labelsPrintStatus": false,
          "moNo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "sizeRatios": [],
          "adBundles": [
            {
              "adbId": 426,
              "shade": "NS",
              "underLayBundleNo": 1,
              "quantity": 119,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-1-1",
              "component": "Back"
            },
            {
              "adbId": 427,
              "shade": "NS",
              "underLayBundleNo": 2,
              "quantity": 119,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-2-1",
              "component": "Back"
            },
            {
              "adbId": 428,
              "shade": "NS",
              "underLayBundleNo": 3,
              "quantity": 119,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 239,
              "panelEnd": 357,
              "barcode": "B:18-3-1",
              "component": "Back"
            },
            {
              "adbId": 429,
              "shade": "NS",
              "underLayBundleNo": 4,
              "quantity": 119,
              "color": null,
              "size": "T/BABY",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-4-1",
              "component": "Back"
            },
            {
              "adbId": 430,
              "shade": "NS",
              "underLayBundleNo": 5,
              "quantity": 119,
              "color": null,
              "size": "0-3M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-5-1",
              "component": "Back"
            },
            {
              "adbId": 431,
              "shade": "NS",
              "underLayBundleNo": 6,
              "quantity": 119,
              "color": null,
              "size": "0-3M",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-6-1",
              "component": "Back"
            },
            {
              "adbId": 432,
              "shade": "NS",
              "underLayBundleNo": 7,
              "quantity": 119,
              "color": null,
              "size": "0-3M",
              "panelStart": 239,
              "panelEnd": 357,
              "barcode": "B:18-7-1",
              "component": "Back"
            },
            {
              "adbId": 433,
              "shade": "NS",
              "underLayBundleNo": 8,
              "quantity": 119,
              "color": null,
              "size": "0-3M",
              "panelStart": 358,
              "panelEnd": 476,
              "barcode": "B:18-8-1",
              "component": "Back"
            },
            {
              "adbId": 434,
              "shade": "NS",
              "underLayBundleNo": 9,
              "quantity": 119,
              "color": null,
              "size": "3-6M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-9-1",
              "component": "Back"
            },
            {
              "adbId": 435,
              "shade": "NS",
              "underLayBundleNo": 10,
              "quantity": 119,
              "color": null,
              "size": "3-6M",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-10-1",
              "component": "Back"
            },
            {
              "adbId": 436,
              "shade": "NS",
              "underLayBundleNo": 11,
              "quantity": 119,
              "color": null,
              "size": "3-6M",
              "panelStart": 239,
              "panelEnd": 357,
              "barcode": "B:18-11-1",
              "component": "Back"
            },
            {
              "adbId": 437,
              "shade": "NS",
              "underLayBundleNo": 12,
              "quantity": 119,
              "color": null,
              "size": "3-6M",
              "panelStart": 358,
              "panelEnd": 476,
              "barcode": "B:18-12-1",
              "component": "Back"
            },
            {
              "adbId": 438,
              "shade": "NS",
              "underLayBundleNo": 13,
              "quantity": 119,
              "color": null,
              "size": "6-9M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-13-1",
              "component": "Back"
            },
            {
              "adbId": 439,
              "shade": "NS",
              "underLayBundleNo": 14,
              "quantity": 119,
              "color": null,
              "size": "6-9M",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-14-1",
              "component": "Back"
            },
            {
              "adbId": 440,
              "shade": "NS",
              "underLayBundleNo": 15,
              "quantity": 119,
              "color": null,
              "size": "6-9M",
              "panelStart": 239,
              "panelEnd": 357,
              "barcode": "B:18-15-1",
              "component": "Back"
            },
            {
              "adbId": 441,
              "shade": "NS",
              "underLayBundleNo": 16,
              "quantity": 119,
              "color": null,
              "size": "9-12M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-16-1",
              "component": "Back"
            },
            {
              "adbId": 442,
              "shade": "NS",
              "underLayBundleNo": 17,
              "quantity": 119,
              "color": null,
              "size": "9-12M",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-17-1",
              "component": "Back"
            },
            {
              "adbId": 443,
              "shade": "NS",
              "underLayBundleNo": 18,
              "quantity": 119,
              "color": null,
              "size": "9-12M",
              "panelStart": 239,
              "panelEnd": 357,
              "barcode": "B:18-18-1",
              "component": "Back"
            },
            {
              "adbId": 444,
              "shade": "NS",
              "underLayBundleNo": 19,
              "quantity": 119,
              "color": null,
              "size": "12-18M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-19-1",
              "component": "Back"
            },
            {
              "adbId": 445,
              "shade": "NS",
              "underLayBundleNo": 20,
              "quantity": 119,
              "color": null,
              "size": "12-18M",
              "panelStart": 120,
              "panelEnd": 238,
              "barcode": "B:18-20-1",
              "component": "Back"
            },
            {
              "adbId": 446,
              "shade": "NS",
              "underLayBundleNo": 21,
              "quantity": 119,
              "color": null,
              "size": "18-24M",
              "panelStart": 1,
              "panelEnd": 119,
              "barcode": "B:18-21-1",
              "component": "Back"
            }
          ],
          "isMainDoc": true,
          "color": "NA",
          "originalDocQuantity": 120,
          "dispatchCreated": false,
          "dispatchReqNo": ""
        }
      ],
      "dispatchCreated": false,
      "dispatchReqNo": "",
      "productName": "BESPO1346-0952-COLOR-1",
      "cutSubNumber": "1"
    },
    {
      "cutId": 123,
      "cutNumber": "2",
      "refDocket": "2421",
      "docketsInvolved": [
        "2421"
      ],
      "poSerial": "10",
      "moNumber": "DUMMY1",
      "moLines": [
        "10",
        "20",
        "30"
      ],
      "planQuantity": 2520,
      "plannedBundles": 21,
      "generateOn": "Thu May 23 2024 17:02:50 GMT+0530 (India Standard Time)",
      "dockets": [
        {
          "mo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "bundleGenStatus": 2,
          "cutNumber": 2,
          "docConfirmationSatus": 2,
          "docketNumber": "2421",
          "docketGroup": "2421",
          "fgColor": "NA",
          "itemCode": "F00099-447",
          "markerInfo": {
            "id": 238,
            "mName": "0952-SS-TB TO 6-9M-BULK-S-1",
            "mVersion": "NORMAL",
            "mWidth": "154.34",
            "mLength": "7.5170",
            "pVersion": "BULK-AW24",
            "defaultMarker": false,
            "endAllowance": "3.50",
            "perimeter": "187.61",
            "cadRemarks": "SOLID-NORMAL MARKER",
            "docRemarks": "PRINT-LEFT FRONT"
          },
          "plies": 120,
          "poSerial": 10,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "ratioDesc": "RATIO-01",
          "ratioId": 220,
          "ratioName": "Ratio-17",
          "sizeRatios": [
            {
              "ratio": 3,
              "size": "F/SIZE"
            },
            {
              "ratio": 1,
              "size": "T/BABY"
            },
            {
              "ratio": 4,
              "size": "0-3M"
            },
            {
              "ratio": 4,
              "size": "3-6M"
            },
            {
              "ratio": 3,
              "size": "6-9M"
            },
            {
              "ratio": 3,
              "size": "9-12M"
            },
            {
              "ratio": 2,
              "size": "12-18M"
            },
            {
              "ratio": 1,
              "size": "18-24M"
            }
          ],
          "totalBundles": 21,
          "totalIssuedMrCount": 0,
          "totalMrCount": 0,
          "allocatedQty": 14,
          "originalDocQuantity": 2520,
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "isMainDoc": true,
          "layedPlies": 2,
          "materialRequirement": 0,
          "completeBindingDocket": false,
          "cutSubNumber": 2,
          "bindingConsumption": 0,
          "cutWastage": 0,
          "itemDesc": "100% BCI-COTTON 40S/1_KNITS_TUBULAR INTERLOCK_REGULAR_180_75_FIBER DYED_DTM BC01 GREY MARL"
        }
      ],
      "actualDockets": [
        {
          "layId": 21,
          "poSerial": 10,
          "docketNumber": "2421",
          "docketGroup": "2421",
          "itemCode": "F00099-447",
          "itemDesc": "F00099-447",
          "docketPlies": 120,
          "actualDocketPlies": 2,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "cutNumber": 2,
          "cutSubNumber": 0,
          "layNumber": 21,
          "underPolayNumber": 2,
          "totalAdbs": 21,
          "layStatus": 2,
          "cutStatus": 3,
          "labelsPrintStatus": false,
          "moNo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "sizeRatios": [],
          "adBundles": [
            {
              "adbId": 357,
              "shade": "NS",
              "underLayBundleNo": 1,
              "quantity": 2,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-1-1",
              "component": "Back"
            },
            {
              "adbId": 358,
              "shade": "NS",
              "underLayBundleNo": 2,
              "quantity": 2,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-2-1",
              "component": "Back"
            },
            {
              "adbId": 359,
              "shade": "NS",
              "underLayBundleNo": 3,
              "quantity": 2,
              "color": null,
              "size": "F/SIZE",
              "panelStart": 5,
              "panelEnd": 6,
              "barcode": "B:15-3-1",
              "component": "Back"
            },
            {
              "adbId": 360,
              "shade": "NS",
              "underLayBundleNo": 4,
              "quantity": 2,
              "color": null,
              "size": "T/BABY",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-4-1",
              "component": "Back"
            },
            {
              "adbId": 361,
              "shade": "NS",
              "underLayBundleNo": 5,
              "quantity": 2,
              "color": null,
              "size": "0-3M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-5-1",
              "component": "Back"
            },
            {
              "adbId": 362,
              "shade": "NS",
              "underLayBundleNo": 6,
              "quantity": 2,
              "color": null,
              "size": "0-3M",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-6-1",
              "component": "Back"
            },
            {
              "adbId": 363,
              "shade": "NS",
              "underLayBundleNo": 7,
              "quantity": 2,
              "color": null,
              "size": "0-3M",
              "panelStart": 5,
              "panelEnd": 6,
              "barcode": "B:15-7-1",
              "component": "Back"
            },
            {
              "adbId": 364,
              "shade": "NS",
              "underLayBundleNo": 8,
              "quantity": 2,
              "color": null,
              "size": "0-3M",
              "panelStart": 7,
              "panelEnd": 8,
              "barcode": "B:15-8-1",
              "component": "Back"
            },
            {
              "adbId": 365,
              "shade": "NS",
              "underLayBundleNo": 9,
              "quantity": 2,
              "color": null,
              "size": "3-6M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-9-1",
              "component": "Back"
            },
            {
              "adbId": 366,
              "shade": "NS",
              "underLayBundleNo": 10,
              "quantity": 2,
              "color": null,
              "size": "3-6M",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-10-1",
              "component": "Back"
            },
            {
              "adbId": 367,
              "shade": "NS",
              "underLayBundleNo": 11,
              "quantity": 2,
              "color": null,
              "size": "3-6M",
              "panelStart": 5,
              "panelEnd": 6,
              "barcode": "B:15-11-1",
              "component": "Back"
            },
            {
              "adbId": 368,
              "shade": "NS",
              "underLayBundleNo": 12,
              "quantity": 2,
              "color": null,
              "size": "3-6M",
              "panelStart": 7,
              "panelEnd": 8,
              "barcode": "B:15-12-1",
              "component": "Back"
            },
            {
              "adbId": 369,
              "shade": "NS",
              "underLayBundleNo": 13,
              "quantity": 2,
              "color": null,
              "size": "6-9M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-13-1",
              "component": "Back"
            },
            {
              "adbId": 370,
              "shade": "NS",
              "underLayBundleNo": 14,
              "quantity": 2,
              "color": null,
              "size": "6-9M",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-14-1",
              "component": "Back"
            },
            {
              "adbId": 372,
              "shade": "NS",
              "underLayBundleNo": 15,
              "quantity": 2,
              "color": null,
              "size": "6-9M",
              "panelStart": 5,
              "panelEnd": 6,
              "barcode": "B:15-15-1",
              "component": "Back"
            },
            {
              "adbId": 371,
              "shade": "NS",
              "underLayBundleNo": 16,
              "quantity": 2,
              "color": null,
              "size": "9-12M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-16-1",
              "component": "Back"
            },
            {
              "adbId": 373,
              "shade": "NS",
              "underLayBundleNo": 17,
              "quantity": 2,
              "color": null,
              "size": "9-12M",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-17-1",
              "component": "Back"
            },
            {
              "adbId": 374,
              "shade": "NS",
              "underLayBundleNo": 18,
              "quantity": 2,
              "color": null,
              "size": "9-12M",
              "panelStart": 5,
              "panelEnd": 6,
              "barcode": "B:15-18-1",
              "component": "Back"
            },
            {
              "adbId": 375,
              "shade": "NS",
              "underLayBundleNo": 19,
              "quantity": 2,
              "color": null,
              "size": "12-18M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-19-1",
              "component": "Back"
            },
            {
              "adbId": 376,
              "shade": "NS",
              "underLayBundleNo": 20,
              "quantity": 2,
              "color": null,
              "size": "12-18M",
              "panelStart": 3,
              "panelEnd": 4,
              "barcode": "B:15-20-1",
              "component": "Back"
            },
            {
              "adbId": 377,
              "shade": "NS",
              "underLayBundleNo": 21,
              "quantity": 2,
              "color": null,
              "size": "18-24M",
              "panelStart": 1,
              "panelEnd": 2,
              "barcode": "B:15-21-1",
              "component": "Back"
            }
          ],
          "isMainDoc": true,
          "color": "NA",
          "originalDocQuantity": 120,
          "dispatchCreated": false,
          "dispatchReqNo": ""
        },
        {
          "layId": 23,
          "poSerial": 10,
          "docketNumber": "2421",
          "docketGroup": "2421",
          "itemCode": "F00099-447",
          "itemDesc": "F00099-447",
          "docketPlies": 120,
          "actualDocketPlies": 0,
          "productName": "BESPO1346-0952-COLOR-1",
          "productType": "Sleep Suite",
          "cutNumber": 2,
          "cutSubNumber": 0,
          "layNumber": 23,
          "underPolayNumber": 4,
          "totalAdbs": 0,
          "layStatus": 1,
          "cutStatus": 0,
          "labelsPrintStatus": false,
          "moNo": "DUMMY1",
          "moLines": [
            "10",
            "20",
            "30"
          ],
          "components": [
            "Back",
            "Front",
            "Gripper Panel",
            "Gusset",
            "Left Bottom Foot",
            "Left Front",
            "Left Sleeve",
            "Left Top Foot",
            "Right Bottom Foot",
            "Right Front",
            "Right Sleeve",
            "Right Top Foot"
          ],
          "sizeRatios": [],
          "adBundles": [],
          "isMainDoc": true,
          "color": "NA",
          "originalDocQuantity": 120,
          "dispatchCreated": false,
          "dispatchReqNo": ""
        }
      ],
      "dispatchCreated": false,
      "dispatchReqNo": "",
      "productName": "BESPO1346-0952-COLOR-1",
      "cutSubNumber": "2"
    }
  ]
}