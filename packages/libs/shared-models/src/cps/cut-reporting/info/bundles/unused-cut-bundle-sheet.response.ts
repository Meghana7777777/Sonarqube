import { GlobalResponseObject } from "packages/libs/shared-models/src/common";
import { CutBundleSheetModel } from "./ununsed-cut-bundle-sheet.model";

export class CutBundleSheetResponse extends GlobalResponseObject {
    data ?: CutBundleSheetModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: CutBundleSheetModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}