import { CommonRequestAttrs,  } from "../../common";
import { SectionsModel } from "./sections-model";

export class SectionsRequest extends CommonRequestAttrs {
    section: SectionsModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        section: SectionsModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.section = section;
    }
}
