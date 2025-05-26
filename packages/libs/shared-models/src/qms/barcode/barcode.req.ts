import { CommonRequestAttrs } from "../../common";

export class QMS_BarcodeReq extends CommonRequestAttrs {
    barcode: string;
    iNeedBarcodeAttribute: boolean;
    iNeeedQualityConfigInfo : boolean;


    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        iNeedBarcodeAttribute: boolean,
        iNeeedQualityConfigInfo : boolean

    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.iNeedBarcodeAttribute = iNeedBarcodeAttribute;
        this.iNeeedQualityConfigInfo = iNeeedQualityConfigInfo;
    }
}