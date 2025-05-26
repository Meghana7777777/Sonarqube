export class GetReportedBundleReqModel {
    moNumber: string;
    moLineNumber: string[];
    productName: string;
    fgColor: string;
    size: string;
    component: string[];
    requestingQty: number;

    constructor(moNumber: string, moLineNumber: string[], productName: string, fgColor: string, size: string, component: string[], requestingQty: number) {
        this.moNumber = moNumber;
        this.moLineNumber = moLineNumber;
        this.productName = productName;
        this.fgColor = fgColor;
        this.size = size;
        this.component = component;
        this.requestingQty = requestingQty;
    }
}