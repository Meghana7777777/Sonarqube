import { GlobalResponseObject } from "../../../common";
import { PackSpecDropDownDtoModel } from "./pack-spec-drop-down-dto-model";

export class  PackSpecDropDownResponse extends GlobalResponseObject{
    data ?: PackSpecDropDownDtoModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: PackSpecDropDownDtoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}