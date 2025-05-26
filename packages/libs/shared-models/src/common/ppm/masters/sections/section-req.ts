import { CommonRequestAttrs, SectionModel } from "../../../../common";

export class SectionRequest extends CommonRequestAttrs {
    section: SectionModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        section: SectionModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.section = section;
    }
}
