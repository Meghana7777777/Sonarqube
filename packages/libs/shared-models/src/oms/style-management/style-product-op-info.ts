import { OpVersionIdDesp} from "./op-version-id-desp";

export class StyleProductOpInfo {
    styleCode: string;
    productType: string;
    opVersionInfo: OpVersionIdDesp[];

    constructor(
        styleCode: string,
        productType: string,
        opVersionInfo: OpVersionIdDesp[]
    ) {
        this.styleCode = styleCode;
        this.opVersionInfo = opVersionInfo;
        this.productType = productType;
    }
}