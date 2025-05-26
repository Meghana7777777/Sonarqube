import { GlobalResponseObject } from "../../common";
import { MoNumberDropdownModel } from "./mo-number-dropdown.model";

export class MoNumberDropdownResponse extends GlobalResponseObject {
    data: MoNumberDropdownModel[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data: MoNumberDropdownModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}