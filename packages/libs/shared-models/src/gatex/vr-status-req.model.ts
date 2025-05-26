import { CommonRequestAttrs } from "../common";
import { LocationFromTypeEnum } from "./enum";

export class VRStatusReqModel extends CommonRequestAttrs {
    status: number[];
    fromType: LocationFromTypeEnum;
    constructor(status: number[], fromType: LocationFromTypeEnum, username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId);
        this.status = status;
        this.fromType = fromType;
    }
}