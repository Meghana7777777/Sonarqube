import { CommonRequestAttrs } from "../../common";
import { RmCompMapModel } from "./rm-comp-map.model";

export class SubProductItemMapRequest extends CommonRequestAttrs {
    prodId: number; // Required
    subProdId?: number;
    orderNo: string; // Not required
    orderLineNo: string; // // Not required
    rmCompMapping: RmCompMapModel[]; // will be sent only during the mapping request. For unmap request this will be empty

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        orderNo: string,
        orderLineNo: string,
        rmCompMapping: RmCompMapModel[],
        prodId: number,
        subProdId?: number,

    ) {
        super(username, unitCode, companyCode, userId);
        this.prodId = prodId;
        this.subProdId = subProdId;
        this.orderNo = orderNo;
        this.orderLineNo = orderLineNo;
        this.rmCompMapping = rmCompMapping;
    }
}
