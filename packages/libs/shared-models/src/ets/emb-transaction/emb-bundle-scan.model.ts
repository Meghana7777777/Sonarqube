import { CommonRequestAttrs } from "../../common";
import { EmbBundlePropsModel } from "./bundle-info/emb-bundle-prop.model";
import { RejectionScanModel } from "./rejection/rejection-scan.model";

export class EmbBundleScanModel extends CommonRequestAttrs {
    barcode: string;
    operationCode: string;
    gQty: number;
    rQty: number;
    bundleQty: number;
    otherProps: EmbBundlePropsModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        barcode: string,
        operationCode: string,
        gQty: number,
        rQty: number,
        bundleQty: number,
        otherProps: EmbBundlePropsModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.operationCode = operationCode;
        this.gQty = gQty;
        this.rQty = rQty;
        this.bundleQty = bundleQty;
        this.otherProps = otherProps;
    }
}
