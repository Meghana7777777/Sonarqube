
import { GlobalResponseObject } from "../../../common";
import { FgRackCreationModel } from "./rack.model";


export class FgRacksRespons extends GlobalResponseObject {
    data?:FgRackCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: FgRackCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}

