import { CommonRequestAttrs, GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";

export class SPS_R_SpsOrderElgBundlesResponse extends GlobalResponseObject {
    data ?: SPS_R_SpsOrderProductWiseElgBundlesModel[];
}

export class SPS_R_SpsOrderProductWiseElgBundlesModel {
    procSerial: number;
    processType: ProcessTypeEnum;
    productCode: string;
    productName: string;
    elgBundles: SPS_R_SpsOrderElgBundleModel[];
}

export class SPS_R_SpsOrderElgBundleModel {
    bundleNumber: string;
    pslId: number;
    quantity: number;
    color: string;
    size: string;
}


export class SPS_C_SpsOrderBundlesConfirmationRequest extends CommonRequestAttrs {
    procSerial: number; // mandatory
    processType: ProcessTypeEnum; // mandatory
    productCode: string; // mandatory
    fgColor: string; // mandatory
    bundles: SPS_C_SpsOrderConfirmedBundleModel[];
    confirmedUser: string;
    confirmedDate: string
}

export class SPS_C_SpsOrderConfirmedBundleModel {
    bundleNo: string;
    confirmedQty: number; // this is the confirmed qty. if at all user explicitly want to split a bundle due to lack of panels due to some damages or inspection failures
}



export class SPS_ELGBUN_C_SewProcSerialRequest extends CommonRequestAttrs{
    procSerial: number; // mandatory
    processingType: ProcessTypeEnum; // mandatory
    productCode: string; // mandatory
    fgColor: string; // mandatory
    iNeedBundles: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        procSerial: number,
        processingType: ProcessTypeEnum,
        productCode: string,
        fgColor: string,
        iNeedBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.procSerial = procSerial;
        this.processingType = processingType;
        this.productCode = productCode;
        this.fgColor = fgColor;
        this.iNeedBundles = iNeedBundles;
    }
}
