import { CommonRequestAttrs } from "../../../common-request-attr.model";
import { SectionModel } from "./section-model";

export class SectionCreateRequest extends CommonRequestAttrs {
    sections: SectionModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        sections: SectionModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.sections = sections;
    }
}