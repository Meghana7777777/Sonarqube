import { RemarkDocketGroupModel } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../../../common";

export class RemarkDocketGroupResponse extends GlobalResponseObject {
    data?: RemarkDocketGroupModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RemarkDocketGroupModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}