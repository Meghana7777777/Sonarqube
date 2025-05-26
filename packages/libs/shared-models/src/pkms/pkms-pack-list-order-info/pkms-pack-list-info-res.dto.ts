import { PackingMethodsEnum } from "../../common";
import { PKMSPackJobsInfoModel } from "../pkms-pack-order-info";
import { PKMSPackListAttrsModel } from "./pkms-pack-list-attribute-dto";

export class PKMSPackListInfoModel {
    packJobs: PKMSPackJobsInfoModel[]; // should get only send if iNeedPackJobs is true
    moId: number;
    packListId: number;
    packOrderId: number;
    packListDesc: string;
    plType: PackingMethodsEnum;
    packListAttrs: PKMSPackListAttrsModel; // should get only if iNeedPackListAttrs is true
    totalCartons: number;
    isInFgWhLines?: boolean;
    constructor(
        packJobs: PKMSPackJobsInfoModel[],
        moId: number,
        packListId: number,
        packOrderId: number,
        packListDesc: string,
        plType: PackingMethodsEnum,
        packListAttrs: PKMSPackListAttrsModel,
        totalCartons: number,
        isInFgWhLines?: boolean
    ) {
        this.packJobs = packJobs;
        this.moId = moId;
        this.packListId = packListId;
        this.packOrderId = packOrderId;
        this.packListDesc = packListDesc;
        this.plType = plType;
        this.packListAttrs = packListAttrs;
        this.totalCartons = totalCartons;
        this.isInFgWhLines = isInFgWhLines;

    }
}
