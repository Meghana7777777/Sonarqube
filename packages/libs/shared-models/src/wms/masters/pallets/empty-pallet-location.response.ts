import { GlobalResponseObject } from "../../../common";
import { EmptyPalletsLocationModel } from "./empty-pallets-location.model";


export class EmptyPalletLocationResponse extends GlobalResponseObject {
    data?: EmptyPalletsLocationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: EmptyPalletsLocationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}