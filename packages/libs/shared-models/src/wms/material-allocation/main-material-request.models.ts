import { CommonRequestAttrs, GlobalResponseObject } from "../../common";

export class KMS_C_JobMainMaterialReqIdRequest extends CommonRequestAttrs {
    reqId: number; // PK of the request header table in SPS

    /**
     * Constructor for KMS_C_JobMainMaterialReqIdRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param reqId - Request ID (PK of the request header)
     * @param date - Optional request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        reqId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.reqId = reqId;
    }
}

// wh request header PK level request to get the items allocated for the 
export class WMS_C_WhKnitMaterialRequestIdRequest extends CommonRequestAttrs {
    whReqId: number;
    /**
     * 
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param whReqId - Request ID (PK of the request header)
     * @param date - Optional request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        whReqId: number,
    ) {
        super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
    }
}

// the response from the WMS for the Main material request for the given wh request id
export class WMS_MAINMAT_R_JobRequestedMainMatResponse extends GlobalResponseObject {
    data?: WMS_MAINMAT_R_JobRequestedMainMatModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: WMS_MAINMAT_R_JobRequestedMainMatModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class WMS_MAINMAT_R_JobRequestedMainMatModel {
    whRequestId: string; // the WH req header table PK
    items: WMS_MAINMAT_R_JobRequestedMainItemsModel[];
    constructor(whRequestId: string, items: WMS_MAINMAT_R_JobRequestedMainItemsModel[]) {
        this.items = items;
        this.whRequestId = whRequestId;
    }
}

export class WMS_MAINMAT_R_JobRequestedMainItemsModel {
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


// called from UI when requested material for the knit jobs
export class KMS_C_KnitJobMaterialRequest extends CommonRequestAttrs {
    jobNumbers: string[];
    requestedBy: string;
    date: string;
    expectedFulFillMentDate: string;
    items: KMS_C_KnitJobRequestedMaterialItemsModel[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, jobNumbers: string[], requestedBy: string, date: string, expectedFulFillMentDate: string, items: KMS_C_KnitJobRequestedMaterialItemsModel[]) {
        super(username, unitCode, companyCode, userId);
        this.jobNumbers = jobNumbers;
        this.requestedBy = requestedBy;
        this.date = date;
        this.expectedFulFillMentDate = expectedFulFillMentDate;
        this.items = items;
    }
}

export class KMS_C_KnitJobRequestedMaterialItemsModel {
    phItemLineId: number;
    itemCode: string;
    requestedQty: number;
    constructor(phItemLineId: number, itemCode: string, requestedQty: number) {
        this.phItemLineId = phItemLineId;
        this.itemCode = itemCode;
        this.requestedQty = requestedQty;
    }
}



export class KMS_R_KnitJobRequestedItemsResponse extends GlobalResponseObject {
    data?: KMS_R_KnitJobRequestedMaterialModel[];

    /**
     * Constructor for KMS_R_KnitJobRequestedItemsResponse
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message for debugging or logs
     * @param data - Optional array of requested material models
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KMS_R_KnitJobRequestedMaterialModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
export class KMS_R_KnitJobRequestedMaterialModel {
    jobNumbers: string[];
    moNumber: string;
    expectedFulFillMentDate: string;
    requestNo: string;
    materialRequestedOn: string; // YYYY-MM-DD HH:MM:SS
    requestedBy: string;
    items: KMS_R_KnitJobRequestedItemsModel[];

    /**
     * Constructor for KMS_R_KnitJobRequestedMaterialModel
     * @param jobNumbers - Array of knit job numbers
     * @param moNumber - Manufacturing order number
     * @param expectedFulFillMentDate - Expected date of fulfillment
     * @param items - List of requested item models
     */
    constructor(
        jobNumbers: string[],
        moNumber: string,
        expectedFulFillMentDate: string,
        requestNo: string,
        materialRequestedOn: string, // YYYY-MM-DD HH:MM:SS
        requestedBy: string,
        items: KMS_R_KnitJobRequestedItemsModel[]
    ) {
        this.jobNumbers = jobNumbers;
        this.moNumber = moNumber;
        this.expectedFulFillMentDate = expectedFulFillMentDate;
        this.materialRequestedOn = materialRequestedOn;
        this.requestNo = requestNo;
        this.requestedBy = requestedBy;
        this.items = items;
    }
}

// for knit request, the same object can come multiple times
export class KMS_R_KnitJobRequestedItemsModel {
    phItemLinesId: number;
    barcode: string;
    itemCode: string;
    requestingQty: number;

    /**
     * Constructor for KMS_R_KnitJobRequestedItemsModel
     * @param phItemLinesId - ID of the item line
     * @param barcode - Barcode of the item
     * @param itemCode - Code of the item
     * @param requestingQty - Requested quantity
     */
    constructor(
        phItemLinesId: number,
        barcode: string,
        itemCode: string,
        requestingQty: number
    ) {
        this.phItemLinesId = phItemLinesId;
        this.barcode = barcode;
        this.itemCode = itemCode;
        this.requestingQty = requestingQty;
    }
}

export class WMS_C_KnitMaterialIssuanceRequest extends CommonRequestAttrs{
    whReqId: number;
    issuedBy: string;
    issuedOn: string; // date time string
    issuingItems: WMS_C_KnitMaterialItemLevelIssuanceRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, whReqId: number, issuedBy: string, issuedOn: string, issuingItems: WMS_C_KnitMaterialItemLevelIssuanceRequest[]) {
       super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
        this.issuedBy = issuedBy;
        this.issuedOn = issuedOn;
        this.issuingItems = issuingItems;
    }
}

export class WMS_C_KnitMaterialItemLevelIssuanceRequest {
    phItemLineId: number; // pk of the ph item lines
    issuingQty: number;
    constructor(phItemLineId: number, issuingQty: number) {
        this.phItemLineId = phItemLineId;
        this.issuingQty = issuingQty;
    }
}

// same for Knit, S Trims, P trim
export class WMS_C_IssuanceIdRequest extends CommonRequestAttrs {
    issuanceId: number; // PK of the issuance_track in the WMS

    /**
     * Constructor for WMS_C_IssuanceIdRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param issuanceId - Issuance ID (PK of issuance_track)
     * @param date - Optional request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        issuanceId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.issuanceId = issuanceId;
    }
}


// same for Knit, S Trims, P trim
export class WMS_R_IssuanceIdItemsResponse extends GlobalResponseObject {
    data?: WMS_R_IssuanceIdItemsModel[];

    /**
     * Constructor for WMS_R_IssuanceIdItemsResponse
     * @param status - Status of the response
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message or details
     * @param data - Optional array of WMS_R_IssuanceIdItemsModel
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: WMS_R_IssuanceIdItemsModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}


// same for Knit, S Trims, P trim
export class WMS_R_IssuanceIdItemsModel {
    extRefId: number; // PK of the wh req in the KMS / SPS / PKMS
    itemCode: string;
    phItemLinesId: number;
    issuedQty: number;
    barcode: string;
    constructor(extRefId: number, itemCode: string, phItemLinesId: number, issuedQty: number, barcode: string) {
        this.extRefId = extRefId;
        this.itemCode = itemCode;
        this.phItemLinesId = phItemLinesId;
        this.issuedQty = issuedQty;
        this.barcode = barcode;
    }
}

/**
 * NOTE: When we request the material for a knit jobs, we dont maintain the job number in the wh_mat_request_line. It will be a csv of multiple knit jobs. We should never query the WMS for the requested materials by providing the job number.
 ****** It should always be with the sps_mat_req_id / kms_mat_req_id / pkms_mat_req_id (ref_id)
            OR
 ****** It should always be with the wms_mat_req_id (PK)
 */


/*
****************************** KMS ****************************************
KMS - material request will be made for multiple job numbers
1. partial material allocation cannot be done for the selected kint jobs qty. IF qty not available then he has to reduce the selected knit jobs.
1.1. We must allow the create request only if all the item codes has the required availability. If atleast 1 item doesnt have sufficient qty then we have do point 1
2. we maintain the request header table in KMS and all the material info we maintain in a new table. jut the req_id, item_code, requested_qty, issued_qty
3. for every knit job when we create the knit jobs, we will maintain the knit_material requirement for every knit job + item code in a new table.
When the request is made, we will update the req_header_id against to the selected knit jobs in UI and the material. This way we can know to what knit jobs we have already requested the material for. Then finally call the WMS API for populating over there
4.Whenever we issue the qty for a requested id, we will sort the knit jobs in ASC order and update the issued_qtys. If for all the knit jobs under the request id, the issued_qty = requested_qty, then we will make the req_header_id to ISSUED status. If partial, then we will make it to partial
5. This way we can know for any given knit job whether the material is requested / partially issued / completely issued.



knit_mat_req_header (created when we request the material for set of jobs from the UI)
id, requested_by, requested_on, fulfill_by

knit_mat_req_items (created when we request the material for set of jobs from the UI)
id, item_code, ph_item_lines_id, barcode, requested_qty, issued_qty (updated when the WH issues some material against this barcode)


knit_job_mat_line (records in this table will be created during the knit job generation)(this table gets updated, when we issue items from WH)
id, knit_job_number, item_code, required_qty, allocated_qty(for phase1 this is = required_qty), issued_qty, req_header_id (updated after the material request)


If we are interested to maintain the ph_item_lines_id for the knit job, then keep it into a new table
knit_job_mat_barcode
id, knit_job_number, barcode, ph_item_line_id, quantity, item_code

*/
