import { PKMSCartonInfoModel } from "../pkms-carton-info";
import { PKMSPackJobAttrsModel } from "./pkms-pack-job-attribute-dto";

export class PKMSPackJobsInfoModel {
    packListId: number;
    packOrderId: number;
    cartonsList: PKMSCartonInfoModel[]; // should get only send if iNeedCartons is true
    packJobNo: string;
    packJobId: number; // PK of the pack job
    attrs: PKMSPackJobAttrsModel; // should get only send if iNeedPackJobAttrs is true
    packLIstNo?: string; // pack list no of the pack job
    packOrderNo?: string; 
    constructor(
        packListId: number,
        packOrderId: number,
        cartonsList: PKMSCartonInfoModel[],
        packJobNo: string,
        packJobId: number,
        attrs: PKMSPackJobAttrsModel,
        packLIstNo?: string,
        packOrderNo?: string,
    ) {
        this.packListId = packListId
        this.packOrderId = packOrderId
        this.cartonsList = cartonsList
        this.packJobNo = packJobNo
        this.packJobId = packJobId
        this.attrs = attrs;
        this.packLIstNo = packLIstNo;
        this.packOrderNo=packOrderNo;
    }
}