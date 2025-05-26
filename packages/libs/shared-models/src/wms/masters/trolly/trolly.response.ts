import { GlobalResponseObject } from "../../../common";
import { TrollyModel } from "./trolly.model";


export class TrollyResponse extends GlobalResponseObject {
    data?: TrollyModel[];

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: TrollyModel[]
    ){
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}