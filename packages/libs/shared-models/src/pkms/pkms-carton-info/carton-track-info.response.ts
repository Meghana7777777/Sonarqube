import { GlobalResponseObject } from "../../common"
import { CartonTrackInfoModel } from "./carton-track-info.model"

export class CartonTrackInfoResp  extends GlobalResponseObject {
    data: CartonTrackInfoModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: CartonTrackInfoModel[]
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}