import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { sizesModel } from "./sizes.model";

export class SizesResponse extends GlobalResponseObject {
    data ?: sizesModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: sizesModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
    
}