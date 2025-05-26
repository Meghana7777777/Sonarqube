import { GlobalResponseObject } from "../../common"
import { CartonGarmentInfo } from "./carton-garment-info.model"

export class CartonGarmentInfoResp  extends GlobalResponseObject {
    data: CartonGarmentInfo[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: CartonGarmentInfo[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}