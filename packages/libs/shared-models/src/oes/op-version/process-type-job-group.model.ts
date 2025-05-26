import { ProcessTypeEnum } from "../../oms";

export class ProcessTypeJobGroupModel {
    processType: ProcessTypeEnum; // Enum representing the process type
    jobGroup: number; // Identifier for the job group

    constructor(processType: ProcessTypeEnum, jobGroup: number) {
        this.processType = processType;
        this.jobGroup = jobGroup;
    }
}
