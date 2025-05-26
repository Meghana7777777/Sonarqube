import { GlobalResponseObject } from "../../../common";
import { BinsCreationModel } from "./bins.model";
import { BinsCreateRequest } from "./bins.request";


export class BinsResponse extends GlobalResponseObject {
    data?: BinsCreateRequest[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: BinsCreateRequest[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}