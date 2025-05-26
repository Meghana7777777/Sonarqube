import { GlobalResponseObject } from "../../../common";
import { StyleProductCodeFgColor } from "./style-product-code-fg-color.model";

export class StyleProductFgColorResp extends GlobalResponseObject {
    data: StyleProductCodeFgColor[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleProductCodeFgColor[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}