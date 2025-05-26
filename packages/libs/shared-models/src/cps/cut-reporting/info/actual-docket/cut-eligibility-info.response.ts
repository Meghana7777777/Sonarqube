import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { ColorSizeCutPanelInfo } from "./color-size-cut-panels-info.model";

export class CutEligibilityInfoResp extends GlobalResponseObject {
    data?: ColorSizeCutPanelInfo[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: ColorSizeCutPanelInfo[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}