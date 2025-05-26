import { GlobalResponseObject } from "../../common"
import { CartonHeadInfoModel } from "./carton-head-info.model"

export class CartonHeadInfoResponse extends GlobalResponseObject {
    data?: CartonHeadInfoModel
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string, data: CartonHeadInfoModel
    ) {
        super(status, errorCode, internalMessage)
        this.data = data
    }
}