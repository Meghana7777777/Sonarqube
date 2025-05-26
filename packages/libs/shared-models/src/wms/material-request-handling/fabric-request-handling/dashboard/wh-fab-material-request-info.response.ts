import { CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../../../../common";
import { WhDashMaterialRequesHeaderModel } from "./wh-dash-fab-material-request-header.model";
import { WhDashMaterialRequesLineModel } from "./wh-dash-fab-material-request-line.model";

export class WhFabMaterialRequestInfoResponse extends GlobalResponseObject { 
    data: WhDashMaterialRequesHeaderModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: WhDashMaterialRequesHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}

