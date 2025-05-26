import { GlobalResponseObject } from "../../common"
import { PackMAterialsForPackLists } from "./pack-mat-req-response.model"

export class PackMaterialResponse extends GlobalResponseObject {
    data: PackMAterialsForPackLists[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: PackMAterialsForPackLists[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}