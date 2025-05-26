import { CommonIdReqModal, CommonRequestAttrs } from "../../common"

export class MasterToggleDto extends CommonRequestAttrs {
    id: number
    constructor(
        id: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number
    ) {
        super(username, unitCode, companyCode, userId,)
        this.id = id
    }
}