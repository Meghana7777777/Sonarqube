import { GlobalResponseObject } from "../../../common";
import { FgEmptyContainerLocationModel } from "./fg-empty-container-location.model";


export class FgEmptyContainersLocationResponse extends GlobalResponseObject {
    data?: FgEmptyContainerLocationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?:FgEmptyContainerLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}