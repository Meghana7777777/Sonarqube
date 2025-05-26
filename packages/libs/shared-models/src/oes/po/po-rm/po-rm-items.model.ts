import { CutRmModel } from "./cut-rm.model";
import { TrimRmModel } from "./trim-rm.model";

export class PoRmItemsModel {
    productName: string;
    productType: string;
    fgColor: string;
    style: string;
    cutRmInfo: CutRmModel[];
    trimRmInfo: TrimRmModel[];

    constructor(
        productName: string,
        productType: string,
        fgColor: string,
        style: string,
        cutRmInfo: CutRmModel[],
       trimRmInfo: TrimRmModel[],
    ) {
        this.productName = productName;
        this.productType = productType;
        this.fgColor = fgColor;
        this.style = style;
        this.cutRmInfo = cutRmInfo;
        this.trimRmInfo = trimRmInfo;
    }
}