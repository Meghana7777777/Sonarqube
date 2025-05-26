import { GlobalResponseObject } from "./global-response-object";


export class ValidatorResponse extends GlobalResponseObject {
    data?: boolean;

    constructor(status: boolean, errorCode: number, internalMessage: string, data:boolean) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}