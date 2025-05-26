import { CommonRequestAttrs, PackingMethodsEnum } from "../../../common";
import { BoxMapReqDto } from "./box-map-req";

export class PackingSpecReqModelDto extends CommonRequestAttrs {
    id: number
    code: string;
    desc: string;
    noOfLevels: number;
    boxMap: BoxMapReqDto[];
    packSerial?: number;
    constructor(
        id: number,
        code: string,
        desc: string,
        noOfLevels: number,
        boxMap: BoxMapReqDto[],
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packSerial?: number
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id
        this.code = code
        this.desc = desc
        this.noOfLevels = noOfLevels
        this.boxMap = boxMap
        this.packSerial = packSerial
    }
}