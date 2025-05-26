import { CommonRequestAttrs } from "../../common"
import { PackListMrnStatusEnum, PackMatReqStatusEnum } from "../enum"

export class PackMAterialRequest extends CommonRequestAttrs {
    packListId: number
    mrStatus: PackListMrnStatusEnum[]
    issuedQty: { issuedQty: number, mapId: number }[]
    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        packListId: number,
        mrStatus: PackListMrnStatusEnum[],
        issuedQty?: { issuedQty: number, mapId: number }[]
    ) {
        super(username, unitCode, companyCode, userId)
        this.packListId = packListId;
        this.mrStatus = mrStatus;
        this.issuedQty = issuedQty;
    }
}