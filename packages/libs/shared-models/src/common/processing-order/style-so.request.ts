import { TaskStatusEnum } from "../../cps";
import { ProcessTypeEnum } from "../../oms";
import { CommonRequestAttrs } from "../common-request-attr.model"
import { ProcessingOrderStatusEnum } from "../enums";

export class StyleMoRequest extends CommonRequestAttrs {
    styleCode: string
    moNumber: string[] //change to monumber
    processingType: ProcessTypeEnum
    status?: ProcessingOrderStatusEnum;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        styleCode: string,
        moNumber: string[],
        processingType: ProcessTypeEnum,
        status?: ProcessingOrderStatusEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.styleCode = styleCode;
        this.moNumber = moNumber;
        this.processingType = processingType;
        this.status = status;
    }
}