import { GlobalResponseObject } from "../../../common";
import { ItemsModelDto } from "./items-model-dto";

export class  ItemsResponse extends GlobalResponseObject{
    data ?: ItemsModelDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ItemsModelDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}