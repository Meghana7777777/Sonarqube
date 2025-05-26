import { CommonRequestAttrs, PhItemCategoryEnum } from "../../../common";
import { WhReqCreateItemsListModel } from "./wh-req-create-items-list.model";
import { WhReqByObjectEnum } from "../enum/wh-req-by-object.enum";

export class WhReqCreateLineModel {
    id: number; // PK of the docket material request
    jobNumber: string; // the docket number
    reqInventoryList: WhReqCreateItemsListModel[];

    constructor(
        id: number, // PK of the docket material request
        jobNumber: string, // the docket number
        reqInventoryList: WhReqCreateItemsListModel[]
    ) {
        this.id = id;
        this.jobNumber = jobNumber;
        this.reqInventoryList = reqInventoryList;
    }
}
