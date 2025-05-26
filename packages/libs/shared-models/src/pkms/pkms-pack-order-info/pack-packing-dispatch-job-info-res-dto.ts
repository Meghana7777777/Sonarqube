import { PKMSPackingDispatchCartonInfoModel } from "../pkms-carton-info";
import { PKMSPackJobAttrsModel } from "./pkms-pack-job-attribute-dto";

export class PKMSPackingDispatchPackJobsInfoModel {
    packListId: number;
    packOrderId: number;
    cartonsList: PKMSPackingDispatchCartonInfoModel[]; // should get only send if iNeedCartons is true
    packJobNo: string;
    packJobId: number; // PK of the pack job
    attrs: PKMSPackJobAttrsModel; // should get only send if iNeedPackJobAttrs is true
    constructor(
        packListId: number,
        packOrderId: number,
        cartonsList: PKMSPackingDispatchCartonInfoModel[],
        packJobNo: string,
        packJobId: number,
        attrs: PKMSPackJobAttrsModel,
    ) {
        this.packListId = packListId
        this.packOrderId = packOrderId
        this.cartonsList = cartonsList
        this.packJobNo = packJobNo
        this.packJobId = packJobId
        this.attrs = attrs;
    }
}