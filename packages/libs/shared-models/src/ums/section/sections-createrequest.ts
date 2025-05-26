import { CommonRequestAttrs,  } from "../../common";
import { SectionsModel } from "./sections-model";

export class SectionsCreateRequest extends CommonRequestAttrs {
    sections: SectionsModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sections: SectionsModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.sections = sections;
    }
}