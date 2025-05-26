import { CommonRequestAttrs } from "../../../../common";
import { WorkstationModel } from "./workstation-model";

export class WorkStationRequest extends CommonRequestAttrs {
    workstation: WorkstationModel;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        workstations: WorkstationModel
    ) {
        super(username, unitCode, companyCode, userId);
        this.workstation = workstations;
    }
}

