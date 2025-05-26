import { GlobalResponseObject } from "../../../common";

export class MarkerSpecificDocketsResponse extends GlobalResponseObject {
    data ?: string[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: string[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}