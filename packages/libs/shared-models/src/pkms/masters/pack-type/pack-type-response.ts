import { GlobalResponseObject } from "../../../common";
import { PackTypeModelDto } from "./pack-type-model-dto";

export class PackTypesResponse extends GlobalResponseObject{
    data ?: PackTypeModelDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackTypeModelDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}