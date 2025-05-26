import { CommonRequestAttrs } from "../../../common";
import { SoStatusEnum } from "../../enum";

export class SoListRequest extends CommonRequestAttrs {
    soStatus: SoStatusEnum; // to filter out the SOs based on the SO status

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        soStatus: SoStatusEnum)
    {
        super(username, unitCode, companyCode, userId);
        this.soStatus = soStatus;

    }
}