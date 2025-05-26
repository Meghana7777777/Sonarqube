import { GlobalResponseObject } from "../../common"
import { PackMatSummaryModel } from "./pack-mat-summ-res-model"

export class PackMaterialSummaryResponse extends GlobalResponseObject {
    data: PackMatSummaryModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: PackMatSummaryModel[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}