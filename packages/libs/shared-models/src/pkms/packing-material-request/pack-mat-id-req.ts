import { CommonRequestAttrs } from "../../common";
import { PackListMrnStatusEnum } from "../enum";

export class PackMatReqID extends CommonRequestAttrs {
    mrnID: number;
    status: PackListMrnStatusEnum;
    issuedQty: {
        issuedQty: number,
        mapId: number,
        requiredQty: number
    }[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        mrnID: number,
        status?: PackListMrnStatusEnum,
        issuedQty?: {
            issuedQty: number,
            mapId: number,
            requiredQty: number
        }[]) {
        super(username,
            unitCode,
            companyCode,
            userId)
        this.mrnID = mrnID;
        this.status = status;
        this.issuedQty = issuedQty;
    }
}