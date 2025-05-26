export class PO_StyleInfoModel {
    styleCode: string;
    styleName: string;
    styleDescription: string;

    /**
     * Constructor for StyleInfoModel
     * @param styleCode - Unique identifier for the style
     * @param styleName - Name of the style
     * @param styleDescription - Description of the style
     */
    constructor(styleCode: string, styleName: string, styleDescription: string) {
        this.styleCode = styleCode;
        this.styleName = styleName;
        this.styleDescription = styleDescription;
    }
}
