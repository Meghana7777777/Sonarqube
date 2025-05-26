import { CommonRequestAttrs } from "../../../common";

export class PoProdutNameRequest extends CommonRequestAttrs {
    poSerial: number;
    productName: string;
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
        fgColor: string,
        iNeedDocketFabricInfo?: boolean,
        manufacturingOrder?:string,
        styleName?: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.productName = productName;
        this.fgColor = fgColor;
        this.iNeedDocketFabricInfo = iNeedDocketFabricInfo;
        this.manufacturingOrder = manufacturingOrder;
        this.styleName = styleName;
    }
}

