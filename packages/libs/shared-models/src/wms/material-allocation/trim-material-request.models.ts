import { CommonRequestAttrs, GlobalResponseObject, MaterialRequestTypeEnum, WhRequestStatusEnum } from "../../common";

export class SPS_C_JobTrimReqIdRequest extends CommonRequestAttrs {
    reqId: number; // PK of the request header table in SPS
    constructor(username: string, unitCode: string, companyCode: string, userId: number, reqId: number) {
        super(username, unitCode, companyCode, userId);
        this.reqId = reqId;
    }
}

export class WMS_C_WhTrimRequestIdRequest extends CommonRequestAttrs {
    whReqId: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, whReqId: number) {
        super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
    }
}

export class WMS_TRIM_R_JobRequestedTrimResponse extends GlobalResponseObject {
    data: WMS_TRIM_R_JobRequestedTrimModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: WMS_TRIM_R_JobRequestedTrimModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class WMS_TRIM_R_JobRequestedTrimModel {
    whRequestId: string; // the WH req header table PK
    items: WMS_TRIM_R_JobRequestedTrimItemsModel[];
    constructor(whRequestId: string, items: WMS_TRIM_R_JobRequestedTrimItemsModel[]) {
        this.whRequestId = whRequestId;
        this.items = items;
    }
}


export class WMS_TRIM_R_JobRequestedTrimItemsModel {
    barcode: string;
    location: string;
    itemCode: string;
    itemDesc: string;
    allocatedQty: number;
    phItemLineId: number;
    issuedQty: number;
    constructor(barcode: string, location: string, itemCode: string, itemDesc: string, allocatedQty: number, phItemLineId: number, issuedQty: number) {
        this.barcode = barcode;
        this.location = location;
        this.itemCode = itemCode;
        this.itemDesc = itemDesc;
        this.allocatedQty = allocatedQty;
        this.phItemLineId = phItemLineId;
        this.issuedQty = issuedQty;
    }
}


// called from UI
export class SPS_C_JobTrimRequest extends CommonRequestAttrs {
    jobNumber: string;
    requestedBy: string;
    date: string;
    expectedFulFillMentDate: Date;
    items: SPS_C_JobRequestedTrimItemsModel[];
    requestingBundlesInfo: SPS_C_ACT_RequestedBundles[]; // It [] for planned po, will be there for actual PO
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNumber: string, requestedBy: string, date: string, expectedFulFillMentDate: Date, items: SPS_C_JobRequestedTrimItemsModel[], requestingBundlesInfo: SPS_C_ACT_RequestedBundles[]) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.requestedBy = requestedBy;
        this.date = date;
        this.expectedFulFillMentDate = expectedFulFillMentDate;
        this.items = items;
        this.requestingBundlesInfo = requestingBundlesInfo;
    }
}

export class SPS_C_JobRequestedTrimItemsModel {
    itemCode: string;
    requestingQty: number;
    constructor(itemCode: string, requestingQty: number) {
        this.itemCode = itemCode;
        this.requestingQty = requestingQty;
    }
}


export class SPS_C_ACT_RequestedBundles {
    pslId: number;
    bunBarcode: string;
    rQty: number;

    constructor(pslId: number, bunBarcode: string, rQty: number) {
        this.pslId = pslId;
        this.bunBarcode = bunBarcode;
        this.rQty = rQty;
    }
}

export class SPS_R_JobRequestedTrimsResponse extends GlobalResponseObject {
    data?: SPS_R_JobRequestedTrimsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SPS_R_JobRequestedTrimsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class SPS_R_JobRequestedTrimsModel {
    jobNumber: string;
    moNumber: string;
    expectedFulFillMentDate: Date;
    requestedBy: string;
    requestNo: string;
    materialRequestedOn: Date;
    items: SPS_R_JobRequestedTrimItemsModel[];
    constructor(jobNumber: string, moNumber: string, expectedFulFillMentDate: Date, requestedBy: string, requestNo: string, materialRequestedOn: Date, items: SPS_R_JobRequestedTrimItemsModel[]) {
        this.jobNumber = jobNumber;
        this.moNumber = moNumber;
        this.expectedFulFillMentDate = expectedFulFillMentDate;
        this.requestedBy = requestedBy;
        this.requestNo = requestNo;
        this.materialRequestedOn = materialRequestedOn;
        this.items = items;
    }
}

export class SPS_R_JobRequestedTrimItemsModel {
    itemCode: string;
    barcode: string;
    requestingQty: number;
    constructor(itemCode: string, barcode: string, requestingQty: number) {
        this.itemCode = itemCode;
        this.barcode = barcode;
        this.requestingQty = requestingQty;
    }
}


export class WMS_C_STrimIssuanceRequest extends CommonRequestAttrs {
    whReqId: number;
    issuedBy: string;
    issuedOn: string; // date time string
    issuingItems: WMS_C_STrimItemLevelIssuanceRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, whReqId: number, issuedBy: string, issuedOn: string, issuingItems: WMS_C_STrimItemLevelIssuanceRequest[]) {
        super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
        this.issuedBy = issuedBy;
        this.issuedOn = issuedOn;
        this.issuingItems = issuingItems;
    }
}

export class WMS_C_STrimItemLevelIssuanceRequest {
    phItemLineId: number; // pk of the ph item lines
    issuingQty: number;
    constructor(phItemLineId: number, issuingQty: number) {
        this.phItemLineId = phItemLineId;
        this.issuingQty = issuingQty;
    }
}

export class SPS_RequestDetailsModel {
    requestId: number;
    requestCode: string;
    requestedDate: string;
    status: WhRequestStatusEnum;
    requestType: MaterialRequestTypeEnum;

    constructor(
        requestId: number,
        requestCode: string,
        requestedDate: string,
        status: WhRequestStatusEnum,
        requestType: MaterialRequestTypeEnum
    ) {
        this.requestId = requestId;
        this.requestCode = requestCode;
        this.requestedDate = requestedDate;
        this.status = status;
        this.requestType = requestType;
    }
}

export class SPS_RequestDetailsModelResponse extends GlobalResponseObject {
    data: SPS_RequestDetailsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: SPS_RequestDetailsModel[] = []
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


class Trims {

    // IN WMS
    async issueSTrimForWhReqId(req: WMS_C_STrimIssuanceRequest): Promise<GlobalResponseObject> {
        /**
         * check if the incoming items are part of the wh req id
         * increase the issuing qtys against to the item codes under the wh req id
         * insert a new record into the issuance_track against to the wh request id (currently 1 to 1).
         * keep a track of complete log in a new log table issuance_log with the unique issuance id
         * and update the issued qty in the ph item lines table
         * now make an API call to (bull job) KMS with the issuance id updateIssuedMaterialFromWms
         */
        return null;
    }

    // IN wms
    async allocateTrimsForAJobByRequestId(req: SPS_C_JobTrimReqIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        // Make an API call to SPS getRequestedMaterialForReqId
        return null;
    }

    // IN wms
    async getAllocatedMaterialForWhTrimsRequestId(req: WMS_C_WhTrimRequestIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        return null;
    }

    // IN wms
    async getAllocatedMaterialForExtRefId(req: SPS_C_JobTrimReqIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        return null;
    }

    // SPS
    async getRequestedTrimMaterialForReqId(req: SPS_C_JobTrimReqIdRequest): Promise<SPS_R_JobRequestedTrimsResponse> {
        return null;
    }

    // PRE Req: Insert the job level trim info into a new table whenever the sewing job is being created ***************
    // IN SPS
    // called from UI from IPS
    // maintin a table to track the no of requests made for a seiwng job to WMS for the TRIMS. job_number, wh_req_id, date
    async saveTrimReqForSewingJob(req: SPS_C_JobTrimRequest): Promise<GlobalResponseObject> {
        // insert a new records into wh_mat_request ** dummy
        // 3 new tables same as knit
        // after requesting the material, update the request id in this table for the trims
        // trigger an API call to WMS allocateTrimsForAJobByRequestId() by sending the wh req id in SPS
        return null;
    }

}


/*

UI => request trims for job
    => call SPS API saveTrimReqorSewingJob and log 1 record for this request and them send this request id to WMS API
    => call WMS allocateTrimsForAJobByRequesId
    
WMS => allocateTrimsForAJobByRequesId will call the getRequestedMaterialForReqId and creates the records into req_header, line and sub line
*/