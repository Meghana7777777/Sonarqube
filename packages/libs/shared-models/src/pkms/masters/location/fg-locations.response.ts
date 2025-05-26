import { GlobalResponseObject } from "../../../common";
import { FgLocationCreateReq } from "./fg-location-create.req";




export class FgLocationsResponse extends GlobalResponseObject {
    data?: FgLocationCreateReq[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?:  FgLocationCreateReq[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}