import { GlobalResponseObject } from "../../../common";
import { ComponentModel } from "./component.model";


export class ComponentResponse extends GlobalResponseObject {
    data?: ComponentModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ComponentModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}