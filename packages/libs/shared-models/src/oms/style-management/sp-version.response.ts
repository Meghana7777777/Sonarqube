import { GlobalResponseObject } from "../../common";
import { StyleProductTypeOpVersionCreation } from "./style-product-type-op-version-creation-request";


export class SpVersionResponse extends GlobalResponseObject  {
    data ?: StyleProductTypeOpVersionCreation[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: StyleProductTypeOpVersionCreation[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 