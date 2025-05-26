import { CommonRequestAttrs } from "../../common";

export class PoSerialWithEmbPrefRequest extends CommonRequestAttrs {

    poSerial: number;
    
    iNeedEmbProps: boolean;
    iNeedEmbLines: boolean;
    iNeedEmbBundles: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        iNeedEmbProps: boolean,
        iNeedEmbLines: boolean,
        iNeedEmbBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);

        this.poSerial = poSerial;
        this.iNeedEmbProps = iNeedEmbProps;
        this.iNeedEmbLines = iNeedEmbLines;
        this.iNeedEmbBundles = iNeedEmbBundles;
    }
}

