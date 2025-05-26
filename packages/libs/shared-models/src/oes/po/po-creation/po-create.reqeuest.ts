import { CommonRequestAttrs } from "../../../common";
import { SoLineIdsModel } from "./so-sub-line-ids.model";


export class PoCreateRequest extends CommonRequestAttrs {
    poDesc: string;
    orderNo: string;
    orderId: number;
    orderLineIds: SoLineIdsModel[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poDesc: string,
        orderNo: string,
        orderId: number,
        subLineIds: SoLineIdsModel[]
    ) {
        super(username, unitCode, companyCode, userId);

        this.poDesc = poDesc;
        this.orderNo = orderNo;
        this.orderId = orderId;
        this.orderLineIds = subLineIds;
    }
}

