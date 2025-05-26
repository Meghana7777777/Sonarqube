import { GlobalResponseObject } from "../../../common";
import { InsTypesModel } from "./ins-types.model";

export class InsTypesResponse extends GlobalResponseObject
{
    data?: InsTypesModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: InsTypesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

