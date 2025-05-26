import { StatusEnums } from "@xpparel/shared-models";

export class ConfigDto {
    pkConfigNo: string;
    pkSpecId: number;
    status: StatusEnums;
    po: number;
    poLine: number;
    pkReqId: number;
    grossWeight: number;
    netWeight: number;
    height: number;
    length: number;
    width: number;
}