import { ProcessTypeEnum } from "../oms";

export class ProcessTypesModel {
    processType: ProcessTypeEnum

    constructor(processType: ProcessTypeEnum) {
        this.processType = processType
    }
}