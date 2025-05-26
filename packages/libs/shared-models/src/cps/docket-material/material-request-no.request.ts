import { CommonRequestAttrs } from "../../common";
import { DocRollsRequest } from "./doc-rolls.request";

export class MaterialRequestNoRequest  extends CommonRequestAttrs {
    // docketNumber: string;
    materialRequestNo: string;
    rollsInfo: DocRollsRequest[]; // optional. Required when deleting the specific roll from a docket request
    docketGroup: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        // docketNumber: string,
        materialRequestNo: string,
        rollsInfo: DocRollsRequest[],
        docketGroup: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.docketGroup = docketGroup;
        this.materialRequestNo = materialRequestNo;
        this.rollsInfo = rollsInfo;
    }
}

/*
{
    "docketGroup": "10",
    "materialRequestNo": "5-1",
    "companyCode": "5000",
    "unitCode": "B3"
}

*/