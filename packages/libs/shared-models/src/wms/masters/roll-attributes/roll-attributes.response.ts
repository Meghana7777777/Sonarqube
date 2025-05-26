import { GlobalResponseObject } from "../../../common";
import { RollAttributesCreationModel } from "./roll-attributes.model";


export class RollAttributesResponse extends GlobalResponseObject {
    data?: RollAttributesCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: RollAttributesCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}