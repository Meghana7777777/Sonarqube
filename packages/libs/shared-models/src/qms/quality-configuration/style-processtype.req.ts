import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class StyleProcessTypeReq extends CommonRequestAttrs {
    styleCode : string;
    processType : ProcessTypeEnum[]

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        styleCode : string,
        processType : ProcessTypeEnum[]
    ){
        super(username, unitCode, companyCode, userId);
        this.styleCode = styleCode;
        this.processType = processType;

    }
}