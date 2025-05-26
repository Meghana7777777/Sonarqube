import { CommonRequestAttrs } from "../../common";
import { FgWhReqSecurityStatusEnum } from "../../pkms/enum/fg-wh-req-security-status.enum";
import { FgWhReqVehTypeEnum } from "../../pkms/enum/fg-wh-req-veh-type.enum";

export class FgwhSecurityUpdateReq extends CommonRequestAttrs {
    fgwhReqId: number;
    status: FgWhReqSecurityStatusEnum;
    securityName: string;
    vehicleType: FgWhReqVehTypeEnum;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, fgwhReqId: number, status: FgWhReqSecurityStatusEnum, vehicleType: FgWhReqVehTypeEnum, securityName: string) {
        super(username, unitCode, companyCode, userId)
        this.status = status
        this.vehicleType = vehicleType
        this.securityName = securityName
        this.fgwhReqId = fgwhReqId
    }

}