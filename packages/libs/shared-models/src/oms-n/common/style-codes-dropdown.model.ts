export class StyleCodesDropdownModel {
    styleCode:string;
    styleName:string;
    styleDescription:string;

    constructor(styleCode:string, styleName:string, styleDescription:string) {
        this.styleCode = styleCode;
        this.styleName = styleName;
        this.styleDescription = styleDescription;
    }
}