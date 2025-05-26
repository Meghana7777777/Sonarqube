import { CommonRequestAttrs } from "../../../common";
import { StyleModel } from "./style-model";

export class StyleRequest extends CommonRequestAttrs{
    style: StyleModel
    
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: StyleModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.style = style;
    }
}