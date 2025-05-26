import { CommonRequestAttrs } from "../../../common";

export class StyleIdRequest extends CommonRequestAttrs {
    id?: number;
    styleName?: string;
    styleCode?: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,  
        id?: number,
        styleName?: string,
        styleCode?: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.styleName = styleName;
        this.styleCode = styleCode;
    }
}