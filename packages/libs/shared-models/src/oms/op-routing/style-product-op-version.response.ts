import { GlobalResponseObject } from "../../common";
import { StyleProductOpVersionAbstract } from "./style-product-op-version.model";

export class StyleProductTypeOpVersionAbstractResponse extends GlobalResponseObject {
    data?: StyleProductOpVersionAbstract[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleProductOpVersionAbstract[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}