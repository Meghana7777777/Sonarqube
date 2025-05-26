import { YarnTypeEnum } from "@xpparel/shared-models";


export class InspectionDashboardHelper {

    getDahsboardHeading(inspectionType: YarnTypeEnum) {
        switch(inspectionType) {
            case YarnTypeEnum.YARNINS: return "Yarn Inspection"
                break;
            // case YarnTypeEnum.LAB_INSPECTION: return "Lab Inspection"
            //     break;
            // case YarnTypeEnum.RELAXATION: return "Relaxation Inspection"
            //     break;
            // case YarnTypeEnum.SHADE_SEGREGATION: return "Shade Inspection"
            //     break;
            // case YarnTypeEnum.SHRINKAGE: return "Shrinkage Inspection"
            //     break;
            default: return "Other Inspection"
                break;
        }
    }

    

}