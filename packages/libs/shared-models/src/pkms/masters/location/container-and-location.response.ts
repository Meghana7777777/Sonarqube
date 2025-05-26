
import { GlobalResponseObject } from "../../../common";
import { ContainerAndLocationModel } from "./container-and-location.model";

export class ContainerAndLocationResponse extends GlobalResponseObject {
    data?: ContainerAndLocationModel[];

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: ContainerAndLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}