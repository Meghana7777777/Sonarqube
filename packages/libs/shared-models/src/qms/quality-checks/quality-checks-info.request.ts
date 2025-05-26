import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class QualityChecksInfoReq extends CommonRequestAttrs {
    barcode?: string;
    iNeedBarcodeAttributes : boolean;
    iNeedEsclationsLog : boolean;

    /**
     * 
     * @param username 
     * @param unitCode 
     * @param companyCode 
     * @param userId 
     * @param iNeedBarcodeAttributes 
     * @param iNeedEsclationsLog 
     * @param barcode 
     */
    constructor(username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        iNeedBarcodeAttributes : boolean,
        iNeedEsclationsLog : boolean,
        barcode?: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.iNeedBarcodeAttributes = iNeedBarcodeAttributes;
        this.iNeedEsclationsLog = iNeedEsclationsLog;
    }

}