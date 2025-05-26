import { GlobalResponseObject } from "../../common";

export class PhItemIdResponse extends GlobalResponseObject {
    data: PhItemIdModel
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PhItemIdModel) {
            super(status, errorCode, internalMessage);
            this.data = data;
        }
}

export class PhItemIdModel {
    phItemId: number
}