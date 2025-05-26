import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { DocketPanelDetailsDto } from "./doc-bundle-info-for-fgs.model";

export class DocBundleInfoForFgsResp extends GlobalResponseObject {
    data?: DocketPanelDetailsDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: DocketPanelDetailsDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}