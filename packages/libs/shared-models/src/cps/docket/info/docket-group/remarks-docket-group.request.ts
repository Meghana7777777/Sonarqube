import { CommonRequestAttrs } from "../../../../common";
import { RemarkDocketGroupModel } from "./remarks-docket-group.model";

export class RemarksDocketGroupRequest extends CommonRequestAttrs {
    remarkss: RemarkDocketGroupModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        remarkss: RemarkDocketGroupModel,

    ) {
        super(username, unitCode, companyCode, userId);
        this.remarkss = remarkss;
    }
}

