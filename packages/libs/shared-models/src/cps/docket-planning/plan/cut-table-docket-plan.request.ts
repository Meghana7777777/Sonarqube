import { CommonRequestAttrs } from "../../../common";
import { DocketPriorityModel } from "./docket-priority.model";

export class CutTableDocketPlanRequest extends CommonRequestAttrs {
    tableId: number;
    docketsList: DocketPriorityModel[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        tableId: number,
        docketsList: DocketPriorityModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.tableId = tableId;
        this.docketsList = docketsList;
    }
}


/*

{
    "tableId": "1",
    "docketsList": [
        {
            "matReqNo": "5-1",
            "docNo": "10"
        }
    ],
    "companyCode": "5000",
    "unitCode": "B3"
}

{
    "tableId": "1",
    "docketsList": [
        {
            "matReqNo": "5-2",
            "docNo": "10"
        }
    ],
    "companyCode": "5000",
    "unitCode": "B3"
}

*/