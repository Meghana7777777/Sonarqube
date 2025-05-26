import { CommonRequestAttrs } from "../../../common/common-request-attr.model";
import { StyleModel } from "./style-model";

export class StyleCreateRequest extends CommonRequestAttrs {
    style: StyleModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: StyleModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.style = style;
    }
}