import { CommonRequestAttrs } from "../../../common-request-attr.model";
import { WorkstationOperationModel } from "./workstationoperation-model";

export class WorkstationOperationRequest extends CommonRequestAttrs {
    workstationoperation: WorkstationOperationModel

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        workstationoperations: WorkstationOperationModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.workstationoperation = workstationoperations;
    }
}