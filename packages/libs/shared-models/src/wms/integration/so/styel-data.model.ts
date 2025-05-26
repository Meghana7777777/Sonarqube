export class StyleInfoModel {
    styleName: string;
    styleCode: string;
    styleDesc: string;
    /**
     * 
     * @param styleName 
     * @param styleCode 
     * @param styleDesc 
     */
    constructor(styleName: string, styleCode: string, styleDesc:string) {
        this.styleName = styleName;
        this.styleCode = styleCode;
        this.styleDesc = styleDesc;
    }
}