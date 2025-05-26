import { GlobalResponseObject } from "../../common";
import { WhMatReqLineStatusEnum } from "../../wms";
import { DocRollsModel } from "./doc-rolls.model";

export class DocMaterialAllocationModel {
    docketGroup: string;
    poSerial: number;
    requestNumber: string;
    itemCode: string;
    productName: string;
    productType: string;
    requestStatus: WhMatReqLineStatusEnum;
    rollsInfo: DocRollsModel[];
}
