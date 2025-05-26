import { CommonRequestAttrs } from "../../common"
import { PackItemsModel, PackJobItems } from "./pack-job-response-model"
import { PK_ItemWiseAllocationModel_C } from "./pk-item-wise-requirement.model"

export class PackMatReqModel extends CommonRequestAttrs {
    poId: number
    packListId: number;
    planCloseDate: Date;
    packJobItems: PackJobItems[]
    extraItems: PackItemsModel[]
    allocatedObjects: PK_ItemWiseAllocationModel_C[]
    constructor(
        poId: number,
        packListId: number,
        planCloseDate: Date,
        packJobItems: PackJobItems[],
        extraItems: PackItemsModel[],
        allocatedObjects: PK_ItemWiseAllocationModel_C[],        
        companyCode: string,
        unitCode: string,
        username: string,
        userId: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.poId = poId
        this.packListId = packListId
        this.planCloseDate = planCloseDate
        this.packJobItems = packJobItems
        this.extraItems = extraItems        
        this.allocatedObjects = allocatedObjects
    }

}

