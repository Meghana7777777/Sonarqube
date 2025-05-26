import { ProcessTypeEnum } from "../../oms";

export class JobGroupBundleGroupProcessTypeModel {
    jobGroup: number;
    bundleGroup: number;
    processType: ProcessTypeEnum;

    /**
     * Constructor for JobGroupBundleGroupProcessTypeModel
     * @param jobGroup - The job group ID
     * @param bundleGroup - The bundle group ID
     * @param processType - The process type (operation category)
     */
    constructor(jobGroup: number, bundleGroup: number, processType: ProcessTypeEnum) {
        this.jobGroup = jobGroup;
        this.bundleGroup = bundleGroup;
        this.processType = processType;
    }
}
