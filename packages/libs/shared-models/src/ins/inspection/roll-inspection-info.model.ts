import { InsBasicInspectionRequest, ThreadInsBasicInspectionRequest, TrimInsBasicInspectionRequest, YarnInsBasicInspectionRequest } from "./basic";
import { InsLabInspectionRequest } from "./lab";
import { InsRelaxationInspectionRequest } from "./relaxation";
import { InsShadeInspectionRequest } from "./shade";
import { InsShrinkageInspectionRequest } from "./shrinkage";

export class InsRollInspectionInfo {
    shadeInsInfo?: InsShadeInspectionRequest;
    basicInsInfo?: InsBasicInspectionRequest;
    labInsInfo?: InsLabInspectionRequest;
    shrinkageInfo?: InsShrinkageInspectionRequest;
    relaxationInfo?: InsRelaxationInspectionRequest;

    constructor(shadeInsInfo?: InsShadeInspectionRequest,
        basicInsInfo?: InsBasicInspectionRequest,
        labInsInfo?: InsLabInspectionRequest,
        shrinkageInfo?: InsShrinkageInspectionRequest,
        relaxationInfo?: InsRelaxationInspectionRequest) {
        this.shadeInsInfo = shadeInsInfo;
        this.basicInsInfo = basicInsInfo;
        this.labInsInfo = labInsInfo;
        this.shrinkageInfo = shrinkageInfo;
        this.relaxationInfo = relaxationInfo;
    }
}



export class YarnInsRollInspectionInfo {
    basicInsInfo?: YarnInsBasicInspectionRequest;
    constructor(
        basicInsInfo?: YarnInsBasicInspectionRequest,
    ) {
        this.basicInsInfo = basicInsInfo;
    }
} 


export class ThreadInsRollInspectionInfo {
    basicInsInfo?: ThreadInsBasicInspectionRequest;
    constructor(
        basicInsInfo?: ThreadInsBasicInspectionRequest,
    ) {
        this.basicInsInfo = basicInsInfo;
    }
} 


export class TrimInsRollInspectionInfo {
    basicInsInfo?: TrimInsBasicInspectionRequest;
    constructor(
        basicInsInfo?: TrimInsBasicInspectionRequest,
    ) {
        this.basicInsInfo = basicInsInfo;
    }
} 