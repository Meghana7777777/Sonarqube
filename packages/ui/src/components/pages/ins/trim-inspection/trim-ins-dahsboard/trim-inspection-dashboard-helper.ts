import { TrimTypeEnum } from "@xpparel/shared-models";


export class InspectionDashboardHelper {

    getDahsboardHeading(inspectionType: TrimTypeEnum) {
        switch(inspectionType) {
            case TrimTypeEnum.TRIMINS: return "Trim Inspection"
                break;
            // case TrimTypeEnum.LAB_INSPECTION: return "Lab Inspection"
            //     break;
            // case TrimTypeEnum.RELAXATION: return "Relaxation Inspection"
            //     break;
            // case TrimTypeEnum.SHADE_SEGREGATION: return "Shade Inspection"
            //     break;
            // case TrimTypeEnum.SHRINKAGE: return "Shrinkage Inspection"
            //     break;
            default: return "Other Inspection"
                break;
        }
    }

    

}