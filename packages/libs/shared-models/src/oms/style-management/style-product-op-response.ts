import { GlobalResponseObject } from "../../common";
import { StyleProductOpInfo } from "./style-product-op-info";


export class StyleProductOpResponse extends GlobalResponseObject {
    data?: StyleProductOpInfo[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleProductOpInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
