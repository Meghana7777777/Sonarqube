import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";


// {
//     "username": "admin",
//     "unitCode": "NORLANKA",
//     "companyCode": "NORLANKA",
//     "reqId": 14,
//     "processType": "LINK"
// }

export class SPS_C_InvOutConfirmationRequest extends CommonRequestAttrs {
    reqId: number; // PK of the material request header in the SPS
    processType: ProcessTypeEnum;
    fulfillmentExpectedBy: string;
    requestedBy: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reqId: number, // PK of the material request header in the SPS
        processType: ProcessTypeEnum,
        fulfillmentExpectedBy: string,
        requestedBy: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.reqId = reqId;
        this.processType = processType;
        this.fulfillmentExpectedBy = fulfillmentExpectedBy;
        this.requestedBy = requestedBy;
    }
}

export class SPS_R_InvOutItemsForConfirmationIdResponse extends GlobalResponseObject {
    data?: SPS_R_InvOutItemsForConfirmationIdModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: SPS_R_InvOutItemsForConfirmationIdModel
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}

export class SPS_R_InvOutItemsForConfirmationIdModel {
    procSerial: number;
    processType: ProcessTypeEnum;
    itemWiseBundles: SPS_R_InvOutItemsForConfirmationIdItemModel[]; // all the bundles being requested under 1 request id

    constructor(
        procSerial: number,
        processType: ProcessTypeEnum,
        itemWiseBundles: SPS_R_InvOutItemsForConfirmationIdItemModel[]
    ) {
        this.procSerial = procSerial;
        this.processType = processType;
        this.itemWiseBundles = itemWiseBundles;
    }
}

export class SPS_R_InvOutItemsForConfirmationIdItemModel {
    itemSku: string;
    depProcType: ProcessTypeEnum;
    bundles: SPS_R_InvOutItemsForConfirmationIdIdBundleModel[];

    constructor(
        itemSku: string,
        depProcType: ProcessTypeEnum,
        bundles: SPS_R_InvOutItemsForConfirmationIdIdBundleModel[]
    ) {
        this.itemSku = itemSku;
        this.depProcType = depProcType;
        this.bundles = bundles;
    }
}

export class SPS_R_InvOutItemsForConfirmationIdIdBundleModel {
    pslId: number;
    orgQty: number; // the original qty of the bundle
    reqQty: number; // the requesting qty
    bundleNo: string; // always the actual bundle barcode. In planned scenario, the actual and planned bundle are same

    constructor(
        pslId: number,
        orgQty: number,
        reqQty: number,
        bundleNo: string
    ) {
        this.pslId = pslId;
        this.orgQty = orgQty;
        this.reqQty = reqQty;
        this.bundleNo = bundleNo;
    }
}
