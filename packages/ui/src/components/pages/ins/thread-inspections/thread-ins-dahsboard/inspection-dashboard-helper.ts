import { ThreadTypeEnum } from "@xpparel/shared-models";


export class InspectionDashboardHelper {

    getDahsboardHeading(inspectionType: ThreadTypeEnum) {
        switch (inspectionType) {
            case ThreadTypeEnum.THREADINS: return "Thread Inspection"
                break;
            default: return "Other Inspection"
                break;
        }
    }



}