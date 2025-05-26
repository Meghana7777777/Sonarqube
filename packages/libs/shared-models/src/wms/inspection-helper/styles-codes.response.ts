import { GlobalResponseObject } from "@xpparel/shared-models";

export class CodesResponse extends GlobalResponseObject {
    Codes: string[] = [];
    constructor(status: boolean, errorCode: number, internalMessage: string, Codes:string[]) {
        super(status, errorCode, internalMessage);
        this.Codes = Codes;
    }
}




