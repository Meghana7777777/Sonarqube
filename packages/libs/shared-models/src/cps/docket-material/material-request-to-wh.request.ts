import { CommonRequestAttrs } from "../../common";
import { DocRollsRequest } from "./doc-rolls.request";

export class MaterialRequestToWhRequest  extends CommonRequestAttrs {
    docketGroup: string;
    materialRequestNo: string;
    remarks: string;
    fulfillemtDateTime: string; // datetime in format YYYT-MM-DD HH:MM:SS

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        docketGroup: string,
        materialRequestNo: string,
        remarks: string,
        fulfillemtDateTime: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.docketGroup = docketGroup;
        this.materialRequestNo = materialRequestNo;
        this.remarks = remarks;
        this.fulfillemtDateTime = fulfillemtDateTime;
    }
}

/*

{
    "docketNumber": "10",
    "materialRequestNo": "5-1",
    "fulfillemtDateTime": "2024-01-13 15:30:00",
    "companyCode": "5000",
    "unitCode": "B3",
    "username": "DEVRAJ"
}


*/