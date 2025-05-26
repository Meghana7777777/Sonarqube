import { InsFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";


export class InspectionDashboardHelper {

    getDahsboardHeading(inspectionType: InsFabricInspectionRequestCategoryEnum) {
        switch(inspectionType) {
            case InsFabricInspectionRequestCategoryEnum.INSPECTION: return "Four Point Inspection"
                break;
            case InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION: return "Lab Inspection"
                break;
            case InsFabricInspectionRequestCategoryEnum.RELAXATION: return "Relaxation Inspection"
                break;
            case InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION: return "Shade Inspection"
                break;
            case InsFabricInspectionRequestCategoryEnum.SHRINKAGE: return "Shrinkage Inspection"
                break;
            default: return "Other Inspection"
                break;
        }
    }

    

}