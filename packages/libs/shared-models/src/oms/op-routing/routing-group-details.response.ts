import { GlobalResponseObject } from "../../common";
import { RoutingGroupDetail } from "./routing-detail.model";

export class RoutingGroupDetailsResponse extends GlobalResponseObject {
    data?: RoutingGroupDetail[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RoutingGroupDetail[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}