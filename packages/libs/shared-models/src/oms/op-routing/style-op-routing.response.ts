import { GlobalResponseObject } from "../../common";
import { MOP_OpRoutingModel } from "./style-op-routing.model";

export class StyleOpRoutingResponse extends GlobalResponseObject {
    data?: MOP_OpRoutingModel;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MOP_OpRoutingModel) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}