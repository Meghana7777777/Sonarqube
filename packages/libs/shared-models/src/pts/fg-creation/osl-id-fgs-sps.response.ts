import { GlobalResponseObject } from "@xpparel/shared-models";
import { OslIdFgsSpsModel } from "./osl-id-fgs-sps.model";

export class OslIdFgsSpsResponse extends GlobalResponseObject {
    data?: OslIdFgsSpsModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: OslIdFgsSpsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}