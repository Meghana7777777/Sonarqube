import { PackingMethodsEnum } from "../../../common";

export class PackTypeModelDto {
    id: number;
    packTypeCode: string;
    packTypeDesc: string;
    packMethod: PackingMethodsEnum;
    constructor(
        id: number,
        packTypeCode: string,
        packTypeDesc: string,
        packMethod: PackingMethodsEnum
    ) {
        this.id = id
        this.packTypeCode = packTypeCode
        this.packTypeDesc = packTypeDesc
        this.packMethod = packMethod
    }

}