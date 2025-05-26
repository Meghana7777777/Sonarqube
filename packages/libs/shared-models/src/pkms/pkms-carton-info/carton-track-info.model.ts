import { CartonStatusEnum, CartonStatusTrackingEnum } from "../enum";

export class CartonTrackInfoModel {
    stage: CartonStatusTrackingEnum; // The current stage of carton tracking
    remarks: string; // Remarks or comments
    status: CartonStatusEnum; // The status of the carton
    inTime: string; // The time the carton entered the stage
    outTime: string; // The time the carton left the stage

    constructor(
        stage: CartonStatusTrackingEnum,
        remarks: string,
        status: CartonStatusEnum,
        inTime: string,
        outTime: string
    ) {
        this.stage = stage;
        this.remarks = remarks;
        this.status = status;
        this.inTime = inTime;
        this.outTime = outTime;
    }
}
