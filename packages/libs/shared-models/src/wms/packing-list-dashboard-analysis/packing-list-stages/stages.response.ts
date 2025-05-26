import { GlobalResponseObject } from "../../../common";
import { StagesForPackingList } from "./stages.model";

export class StagesResoponse extends GlobalResponseObject{
    data?:StagesForPackingList[]

    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: StagesForPackingList[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}