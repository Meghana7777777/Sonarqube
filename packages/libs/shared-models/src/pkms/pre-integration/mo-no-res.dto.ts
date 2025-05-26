import { CommonRequestAttrs } from "../../common";

export class MoNumberResDto extends CommonRequestAttrs {
    moNumber: string;
    moId?: string;
    packSerial?: string;
}