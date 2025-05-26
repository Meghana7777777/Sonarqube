import { GlobalResponseObject } from "../../common";
import { OpVersionModel } from "./op-version.model";


export class OpVersionResponse extends GlobalResponseObject  {
    data ?: OpVersionModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OpVersionModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 