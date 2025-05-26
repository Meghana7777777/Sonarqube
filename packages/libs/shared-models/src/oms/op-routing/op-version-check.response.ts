import { GlobalResponseObject } from "../../common";

export class OpVersionCheckResponse extends GlobalResponseObject {
    data?: boolean;

    constructor(status: boolean, errorCode: number, internalMessage: string, data: boolean) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}