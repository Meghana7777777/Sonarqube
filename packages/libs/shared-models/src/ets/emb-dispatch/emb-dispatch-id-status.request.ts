import { CommonRequestAttrs } from "../../common";
import { EmbDispatchStatusEnum } from "../enum";

export class EmbDispatchIdStatusRequest extends CommonRequestAttrs {

    embDispatchId: number; // The PK of the emb dispatch request
    dispatchStatus: EmbDispatchStatusEnum;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        embDispatchId: number,
        dispatchStatus: EmbDispatchStatusEnum
    ) {
        super(username, unitCode, companyCode, userId);
        this.embDispatchId = embDispatchId;
        this.dispatchStatus = dispatchStatus;
    }
}