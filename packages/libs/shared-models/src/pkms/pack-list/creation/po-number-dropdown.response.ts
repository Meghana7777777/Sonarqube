import { GlobalResponseObject } from "../../../common";
import { PackSerialDropDownModel } from "./pack-serial-dropdown.model";

export class PackSerialDropDownResponse extends GlobalResponseObject{
    data?: PackSerialDropDownModel[];

     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */
    constructor(status:boolean, errorCode:number, internalMessage:string, data?: PackSerialDropDownModel[]){
        super(status,errorCode,internalMessage);
        this.data = data;
    }
}
