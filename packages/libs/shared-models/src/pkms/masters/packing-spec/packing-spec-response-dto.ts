import { PackingMethodsEnum } from "../../../common";
import { BoxMapReqDto } from "./box-map-req";

export class PackingSpecResponseDto {
    id: number
    code: string;
    desc: string;
    noOfLevels: number;
    isActive: boolean
    boxMap: BoxMapReqDto[]
    constructor(
        id: number,
        code: string,
        desc: string,
        noOfLevels: number,
        isActive: boolean,
        boxMap: BoxMapReqDto[]
    ) {
        this.id = id;
        this.code = code;
        this.desc = desc;
        this.noOfLevels = noOfLevels;
        this.isActive = isActive
        this.boxMap = boxMap;
    }
}