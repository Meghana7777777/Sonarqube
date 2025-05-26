import { GlobalResponseObject } from "../../../common";
import { RacksCreationModel } from "./racks.model";

export class RacksResponse extends GlobalResponseObject {
    data?: RacksCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: RacksCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}