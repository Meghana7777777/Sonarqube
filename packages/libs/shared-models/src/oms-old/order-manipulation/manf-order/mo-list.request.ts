import { CommonRequestAttrs } from "../../../common";
import { MoStatusEnum } from "../../enum";

export class MoListRequest extends CommonRequestAttrs {
    moStatus: MoStatusEnum; // to filter out the MOs based on the MO status

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moStatus: MoStatusEnum)
    {
        super(username, unitCode, companyCode, userId);
        this.moStatus = moStatus;

    }
}