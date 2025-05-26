import { InsRollBasicInfoModel, RollInfoModel } from "../../wms";
import { InsBasicInspectionRequest } from "./basic";
import { InsLabInspectionRequest } from "./lab";
import { InsShadeInspectionRequest } from "./shade";
import { InsShrinkageInspectionRequest } from "./shrinkage";



export class InsIrRollModel {
    rollId: number;
    barcode: string;
    rollInfo: InsRollBasicInfoModel;
    shadeInsInfo?: InsShadeInspectionRequest;
    basicInsInfo?: InsBasicInspectionRequest;
    labInsInfo?: InsLabInspectionRequest;
    shrinkageInfo?: InsShrinkageInspectionRequest;

    constructor(rollId: number, barcode: string, rollInfo: InsRollBasicInfoModel, shadeInsInfo?: InsShadeInspectionRequest, basicInsInfo?: InsBasicInspectionRequest, labInsInfo?: InsLabInspectionRequest, shrinkageInfo?: InsShrinkageInspectionRequest) {
        this.rollId = rollId;
        this.barcode = barcode;
        this.rollInfo = rollInfo;
        this.shadeInsInfo = shadeInsInfo;
        this.basicInsInfo = basicInsInfo;
        this.labInsInfo =labInsInfo;
        this.shrinkageInfo = shrinkageInfo;
    }

}