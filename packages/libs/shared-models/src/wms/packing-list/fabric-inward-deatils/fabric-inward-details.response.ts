import { GlobalResponseObject } from "../../../common";
import { FabricInwardDetailsModel } from "./fabric-inward-details.model";


export class FabricInwardDetailsResponse extends GlobalResponseObject {
    data?: FabricInwardDetailsModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: FabricInwardDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}