import { CommonRequestAttrs, PackingMethodsEnum } from "@xpparel/shared-models";
import { CommonDto } from "packages/services/packing-management/src/base-services/dtos/common-dto";
import { BoxMapDto } from "./box-map.dto";

export class PackingSpecCreateDto extends CommonDto {
    id:number
    code: string;
    desc: string;
    noOfLevels: number;
    packingMethod: PackingMethodsEnum;
    boxMap:BoxMapDto[]
}