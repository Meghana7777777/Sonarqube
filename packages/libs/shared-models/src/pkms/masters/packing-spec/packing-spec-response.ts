import { GlobalResponseObject } from "../../../common";
import { PackingSpecResponseDto } from "./packing-spec-response-dto";

export class  PackingSpecResponse extends GlobalResponseObject{
    data ?: PackingSpecResponseDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackingSpecResponseDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}