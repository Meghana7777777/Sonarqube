import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DocketPanelDetailsDto } from "./doc-bundle-info-for-fgs.model";
import { FgColorSizeCompRequest } from "./fg-comp-color-size.model";

export class MinEligibleCompPanelsResp extends GlobalResponseObject {
    data?: FgColorSizeCompRequest[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: FgColorSizeCompRequest[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}