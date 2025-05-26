import { GlobalResponseObject } from "../../../common";
import {MoversCreationModel } from "./movers.model";


export class MoversResponse extends GlobalResponseObject {
    data?: MoversCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: MoversCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}