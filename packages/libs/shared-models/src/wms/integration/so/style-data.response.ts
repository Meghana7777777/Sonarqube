import { GlobalResponseObject } from "../../../common";
import { StyleInfoModel } from "./styel-data.model";

export class StyleInfoResponse extends GlobalResponseObject{
    data : StyleInfoModel[];

    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
    */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleInfoModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}