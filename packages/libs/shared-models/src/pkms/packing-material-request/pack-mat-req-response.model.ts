import { PackMatReqStatusEnum } from "../enum"

export class PackMAterialsForPackLists {
    mrnID: number
    requestNo: number
    requestStatus: PackMatReqStatusEnum
    matReqOn: string
    matReqBy: string
    matFulfillmentDateTime: string
    constructor(
        mrnID: number,
        requestNo: number,
        requestStatus: PackMatReqStatusEnum,
        matReqOn: string,
        matReqBy: string,
        matFulfillmentDateTime: string
    ) {
        this.mrnID = mrnID
        this.requestNo = requestNo
        this.requestStatus = requestStatus
        this.matFulfillmentDateTime = matFulfillmentDateTime
        this.matReqOn = matReqOn
        this.matReqBy = matReqBy
    }
}
