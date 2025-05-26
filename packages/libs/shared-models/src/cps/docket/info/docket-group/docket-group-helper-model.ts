import { CommonRequestAttrs } from "../../../../common";
import { RemarkDocketGroupModel } from "./remarks-docket-group.model";

export class DocketGroupResponseModel {

    unitCode: string;
    companyCode: string;
    date: string;
    username: string;
    userId: number;
    constructor(
        unitCode: string,
        companyCode: string,
        username: string,
        userId: number,
        date: string

    ) {

        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.username = username;
        this.userId = userId;
        this.date = date;
    }
}

