import { CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../../common";
import { WhReqCreateItemsListModel } from "./wh-req-create-items-list.model";
import { WhReqByObjectEnum } from "../enum/wh-req-by-object.enum";
import { WhReqCreateLineModel } from "./wh-req-create-line.model";
import { WhReqCreateHeaderModel } from "./wh-req-create-header.model";

export class WhReqCreateHeaderResponse extends GlobalResponseObject { 
    data: WhReqCreateHeaderModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: WhReqCreateHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}

