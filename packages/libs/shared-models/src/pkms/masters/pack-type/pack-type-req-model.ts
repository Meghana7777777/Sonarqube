import { CommonRequestAttrs, PackingMethodsEnum } from "../../../common";

export class PackTypeReqModel extends CommonRequestAttrs {
    id: number;
    packTypeCode: string;
    packTypeDesc: string;
    packMethod: PackingMethodsEnum;

    constructor(
        packTypeCode: string,
        packTypeDesc: string,
        packMethod: PackingMethodsEnum,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        id?: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.packTypeCode = packTypeCode;
        this.packTypeDesc = packTypeDesc;
        this.packMethod = packMethod
    }
}