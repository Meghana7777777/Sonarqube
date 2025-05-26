import { CommonRequestAttrs, GlobalResponseObject } from "../../common";

export class PKMS_C_JobTrimReqIdRequest extends CommonRequestAttrs {
    reqId: number; // PK of the request header table in SPS

    /**
     * Constructor for PKMS_C_JobTrimReqIdRequest
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




export class PKMS_R_JobTrimResponse extends GlobalResponseObject {
    data?: PKMS_R_JobTrimMaterialModel[];

    /**
     * Constructor for PKMS_R_JobRequestedItemsResponse
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message for debugging or logs
     * @param data - Optional array of requested material models
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: PKMS_R_JobTrimMaterialModel[]
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
export class PKMS_R_JobTrimMaterialModel {
    jobNumbers: string[];
    moNumber: string;
    expectedFulFillMentDate: string;
    requestNo: string;
    materialRequestedOn: string; // YYYY-MM-DD HH:MM:SS
    requestedBy: string;
    items: PKMS_R_JobTrimItemModel[];

    /**
     * Constructor for PKMS_R_JobRequestedMaterialModel
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
        items: PKMS_R_JobTrimItemModel[]
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
export class PKMS_R_JobTrimItemModel {
    phItemLinesId: number;
    barcode: string;
    itemCode: string;
    requestingQty: number;

    /**
     * Constructor for PKMS_R_JobRequestedItemsModel
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

export class WMS_C_PTrimIssuanceRequest extends CommonRequestAttrs {
    whReqId: number;
    issuedBy: string;
    issuedOn: string; // date time string
    issuingItems: WMS_C_PTrimItemLevelIssuanceRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, whReqId: number, issuedBy: string, issuedOn: string, issuingItems: WMS_C_PTrimItemLevelIssuanceRequest[]) {
        super(username, unitCode, companyCode, userId);
        this.whReqId = whReqId;
        this.issuedBy = issuedBy;
        this.issuedOn = issuedOn;
        this.issuingItems = issuingItems;
    }
}

export class WMS_C_PTrimItemLevelIssuanceRequest {
    phItemLineId: number; // pk of the ph item lines
    issuingQty: number;
    constructor(phItemLineId: number, issuingQty: number) {
        this.phItemLineId = phItemLineId;
        this.issuingQty = issuingQty;
    }
}