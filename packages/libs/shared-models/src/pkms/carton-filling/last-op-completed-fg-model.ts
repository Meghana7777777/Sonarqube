import { CommonRequestAttrs } from "../../common";

export class LastOpCompletedFGsModel extends CommonRequestAttrs {
    moNumber: string;
    moLineNumber: string[];
    productName: string;
    fgColor: string;
    size: string;
    fgs: number[];

    constructor(moNumber: string, moLineNumber: string[], productName: string, fgColor: string, size: string, fgs: number[], username: string, unitCode: string, companyCode: string, userId: number) {
        super(username, unitCode, companyCode, userId);
        this.moNumber = moNumber;
        this.moLineNumber = moLineNumber;
        this.productName = productName;
        this.fgColor = fgColor;
        this.size = size;
        this.fgs = fgs;
    }
}