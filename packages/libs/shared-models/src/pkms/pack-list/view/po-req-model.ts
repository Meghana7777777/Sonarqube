import { CommonRequestAttrs } from "../../../common";
import { PackFabricInspectionRequestCategoryEnum } from "../../enum";

export class PoReqModel extends CommonRequestAttrs {
    po: number;
    preferenceInspection?: PackFabricInspectionRequestCategoryEnum
    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        po: number,
        preferenceInspection?: PackFabricInspectionRequestCategoryEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.po = po;
        this.preferenceInspection = preferenceInspection;
    }
}