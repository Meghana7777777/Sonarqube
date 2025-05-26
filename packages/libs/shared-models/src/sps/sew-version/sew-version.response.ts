import { GlobalResponseObject } from "../../common";
import { SewVersionModel } from "./sew-version.model";


export class SewVersionResponse extends GlobalResponseObject  {
    data ?: SewVersionModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: SewVersionModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
} 