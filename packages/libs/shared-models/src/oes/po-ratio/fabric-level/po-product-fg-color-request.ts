import { CommonRequestAttrs } from "../../../common";

export class PoProductFgColorRequest extends CommonRequestAttrs {
    poSerial: number;
    productName: string;
    style: string;
    fgColor: string;
    
    iNeedDocketFabricInfo?: boolean;
    manufacturingOrder?:string;
    styleName? :string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        productName: string,
        style: string,
        fgColor: string,
        iNeedDocketFabricInfo?: boolean,
        manufacturingOrder?:string,
        styleName?: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.productName = productName;
        this.style = style;
        this.fgColor = fgColor;
        this.iNeedDocketFabricInfo = iNeedDocketFabricInfo;
        this.manufacturingOrder = manufacturingOrder;
        this.styleName = styleName;
    }
}

