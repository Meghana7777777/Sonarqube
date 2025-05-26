
import { GlobalResponseObject } from "../../../common";
import { TrayAndTrolleyModel } from "./tray-and-trolley.model";

export class TrayAndTrolleyResponse extends GlobalResponseObject {
    data?: TrayAndTrolleyModel[];

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: TrayAndTrolleyModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}