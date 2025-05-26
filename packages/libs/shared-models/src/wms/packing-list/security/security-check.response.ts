import { GlobalResponseObject } from "../../../common";
import { SecurityCheckModel } from "./security-check.model";

export class SecurityCheckResponse extends GlobalResponseObject {
    data?: SecurityCheckModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: SecurityCheckModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}