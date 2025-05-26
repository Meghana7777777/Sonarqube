import { CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../../../common";
import { WhReqByObjectEnum } from "../../enum/wh-req-by-object.enum";
import { WhDashMaterialRequesHeaderModel } from "./wh-dash-fab-material-request-header.model";

export class WhMaterialRequestsResponse extends GlobalResponseObject { 
    data: WhDashMaterialRequesHeaderModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: WhDashMaterialRequesHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}

