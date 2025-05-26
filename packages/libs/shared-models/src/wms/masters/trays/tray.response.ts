import { GlobalResponseObject } from "../../../common";
import { TrayModel } from "./tray.model";

export class TrayResponse extends GlobalResponseObject {
    data?: TrayModel[];

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: TrayModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}