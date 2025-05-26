
import { GlobalResponseObject } from "../../../common";
import { WeareHouseDropDownModel } from "./fg-warehousedropdown.model";

export class WeareHouseDropDownResponse extends GlobalResponseObject {
    data?: WeareHouseDropDownModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: WeareHouseDropDownModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}