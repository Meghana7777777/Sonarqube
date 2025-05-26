import { GlobalResponseObject } from "../../common";
import { StyleCodesDropdownModel } from "./style-codes-dropdown.model";

export class StyleCodesDropdownResponse extends GlobalResponseObject{
     data: StyleCodesDropdownModel[]
    
        constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleCodesDropdownModel[]) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}