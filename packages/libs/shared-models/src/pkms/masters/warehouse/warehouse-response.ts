import { GlobalResponseObject } from "../../../common";
import { WareHouseResponseDto } from "./warehouse-model";

export class WareHouseResponse extends GlobalResponseObject{
    data ?: WareHouseResponseDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: WareHouseResponseDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}