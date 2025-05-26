import { CommonRequestAttrs } from "../../common";
import { WhReqByObjectEnum } from "../material-request-handling";
import { MaterialReqStatusEnum } from "./material-req-status.enum";

export class MRStatusRequest extends CommonRequestAttrs {
    externalRefModuleType: WhReqByObjectEnum
    materialRequestStatus: MaterialReqStatusEnum[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        materialRequestStatus: MaterialReqStatusEnum[],
        externalRefModuleType: WhReqByObjectEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.materialRequestStatus = materialRequestStatus;
        this.externalRefModuleType = externalRefModuleType;
    }
}