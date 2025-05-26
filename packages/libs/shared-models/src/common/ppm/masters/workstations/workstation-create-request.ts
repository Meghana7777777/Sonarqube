import { CommonRequestAttrs } from "../../../common-request-attr.model";
import { WorkstationModel } from "./workstation-model";

export class WorkstationCreateRequest extends CommonRequestAttrs {
    workstations: WorkstationModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        workstations: WorkstationModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.workstations = workstations;
    }
}