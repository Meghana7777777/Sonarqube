import { EmbBundlePropsModel } from "./bundle-info";

export class ReportedEmbBundleScanModel {
        barcode: string;
        operationCode: string;
        gQty: number;
        rQty: number;
        bundleQty: number;
        otherProps: EmbBundlePropsModel;
        status:boolean;
        reason:string;
    
        constructor(
            barcode: string,
            operationCode: string,
            gQty: number,
            rQty: number,
            bundleQty: number,
            otherProps:EmbBundlePropsModel,
            status:boolean,
            reason:string,
        ) {
            this.barcode = barcode;
            this.operationCode = operationCode;
            this.gQty = gQty;
            this.rQty = rQty;
            this.bundleQty = bundleQty;
            this.status = status;
            this.reason = reason;
            this.otherProps = otherProps;
        }
    }