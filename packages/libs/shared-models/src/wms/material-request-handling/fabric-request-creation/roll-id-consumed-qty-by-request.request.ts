import { CommonRequestAttrs } from "../../../common";
import { RequestTypeEnum } from "../../enum";

export class RollIdConsumedQtyRequest extends CommonRequestAttrs {
    rollId: number;
    requestNumber: string;
    tillQty: number;
    requestRollQuantity: number;
    requestType: RequestTypeEnum;
    consumedOn: string; // YYYY-MM-DD HH:MM the date on which the consumption is done. 
    constructor(username: string, unitCode: string, companyCode: string, userId: number, rollId: number, tillQty: number, consumedOn: string, requestNumber: string, requestRollQuantity: number, requestType: RequestTypeEnum) {
        super(username, unitCode, companyCode, userId)
        this.rollId = rollId;
        this.tillQty = tillQty;
        this.consumedOn = consumedOn;
        this.requestNumber = requestNumber;
        this.requestRollQuantity = requestRollQuantity;
        this.requestType = requestType;
    }
}
