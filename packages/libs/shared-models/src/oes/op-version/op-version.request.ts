import { CommonRequestAttrs } from "../../common";
import { OperationModel } from "../../ums/operation";
import { OpGroupModel } from "./op-group.model";
import { OpVersionModel } from "./op-version.model";

export class OpVersionRequest extends CommonRequestAttrs {
    productName: string;
    fgColor: string;
    style: string;
    poSerial: number;
    opSeqModel: OpVersionModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        productName: string,
        fgColor: string,
        style: string,
        poSerial: number,
        opSeqModel: OpVersionModel,
    ) {
        super(username, unitCode, companyCode, userId);
        this.productName = productName;
        this.fgColor = fgColor;
        this.style = style;
        this.poSerial = poSerial;
        this.opSeqModel = opSeqModel;
    }
}