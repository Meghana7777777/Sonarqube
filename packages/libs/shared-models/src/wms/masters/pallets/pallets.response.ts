import { GlobalResponseObject } from "../../../common";
import { PalletsCreationModel } from "./pallets.model";


export class PalletsResponse extends GlobalResponseObject {
    data?: PalletsCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: PalletsCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}