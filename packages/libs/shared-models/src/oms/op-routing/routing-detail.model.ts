import { ProcessTypeEnum } from "../enum";

export class RoutingGroupDetail {
    procType: ProcessTypeEnum;
    routingGroup: string;
    bundleQty: number;
    outPutSku: string;

    constructor(procType: ProcessTypeEnum, routingGroup: string, bundleQty: number, outPutSku: string) {
        this.procType = procType;
        this.routingGroup = routingGroup;
        this.bundleQty = bundleQty;
        this.outPutSku = outPutSku;
    }
}