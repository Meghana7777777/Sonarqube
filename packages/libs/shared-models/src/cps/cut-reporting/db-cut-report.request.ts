import { CommonRequestAttrs } from "../../common";
import { CutRepAttr } from "../enum";


export class DbCutReportRequest extends CommonRequestAttrs {
    layId: number;
    docketNumber: string;
    docBundleNumber: string;
    size: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        docketNumber: string,
        docBundleNumber: string,
        size: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.docBundleNumber = docBundleNumber;
        this.docketNumber = docketNumber;
        this.size = size;
    }
}
