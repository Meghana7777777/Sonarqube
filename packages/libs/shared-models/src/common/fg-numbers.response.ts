import { GlobalResponseObject } from "./global-response-object";

export class FgNumbersResp extends GlobalResponseObject {
    data?: number[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: number[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}