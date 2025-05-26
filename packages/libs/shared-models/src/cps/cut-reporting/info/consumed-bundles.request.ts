import { CommonRequestAttrs } from "../../../common";
import { CutBundleInfoModel } from "./cut-bundle-info.model";

export class ConsumedBundleInfoRequest extends CommonRequestAttrs{
    cutBundles : CutBundleInfoModel[];
    constructor(
        username: string,
        userId: number,
        unitCode: string,
        companyCode: string,
        cutBundles : CutBundleInfoModel[]
     
    ) {
        super(username, unitCode, companyCode, userId); 
        this.unitCode = unitCode; 
        this.companyCode = companyCode;
        this.cutBundles = cutBundles
    }
}