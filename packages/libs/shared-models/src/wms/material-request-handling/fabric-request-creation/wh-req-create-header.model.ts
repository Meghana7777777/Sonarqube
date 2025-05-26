import { CommonRequestAttrs, PhItemCategoryEnum } from "../../../common";
import { WhReqCreateItemsListModel } from "./wh-req-create-items-list.model";
import { WhReqByObjectEnum } from "../enum/wh-req-by-object.enum";
import { WhReqCreateLineModel } from "./wh-req-create-line.model";

export class WhReqCreateHeaderModel {
    id: number; // PK of the request header
    requestNo: string;
    materialRequestedOn: string; // YYYY-MM-DD HH:MM:SS
    requestedBy: string;
    reqByObject: WhReqByObjectEnum;
    reqInventoryType: PhItemCategoryEnum;
    reqLines: WhReqCreateLineModel[];
    fulfillByDateTime: string; // YYYY-MM-DD HH:MM:SS
    requestedResourceId: string;
    requestedResourceDesc: string;

    constructor(
        id: number, // PK of the request header
        requestNo: string,
        materialRequestedOn: string,
        requestedBy: string,
        reqByObject: WhReqByObjectEnum,
        reqInventoryType: PhItemCategoryEnum,
        reqLines: WhReqCreateLineModel[],
        fulfillByDateTime: string,
        requestedResourceId: string,
        requestedResourceDesc: string
    ) {
        this.id = id;
        this.requestNo = requestNo;
        this.materialRequestedOn = materialRequestedOn;
        this.requestedBy = requestedBy;
        this.reqByObject = reqByObject;
        this.reqInventoryType = reqInventoryType;
        this.reqLines = reqLines;
        this.fulfillByDateTime = fulfillByDateTime;
        this.requestedResourceId = requestedResourceId;
        this.requestedResourceDesc = requestedResourceDesc;
    }
}

