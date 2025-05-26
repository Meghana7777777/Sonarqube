import { GlobalResponseObject } from "../../../common";
import { OpenPoDetailsModel } from "./open-po-details.model";


export class OpenPoDetailsResponse extends GlobalResponseObject{
    data : OpenPoDetailsModel[];
    /**
     * @params status
     * @params errorCode
     * @params internalMessage
     * @param data
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: OpenPoDetailsModel[]){
        super(status, errorCode, internalMessage)
        this.data = data;
    }
}