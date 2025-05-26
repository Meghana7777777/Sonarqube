import { CommonRequestAttrs } from "../../common";

export class PackOrderIdModel extends CommonRequestAttrs {
    packOrderId: number;
    whId: number;

    constructor(companyCode: string, unitCode: string, username: string, userId: number, packOrderId: number,whId: number) {
        super(username, unitCode, companyCode, userId);
        this.packOrderId = packOrderId;
        this.whId = whId;
    }
}