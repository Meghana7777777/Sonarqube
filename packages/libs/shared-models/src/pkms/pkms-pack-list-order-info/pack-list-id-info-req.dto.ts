import { CommonRequestAttrs } from "../../common";

export class PKMSPackListIdsRequest extends CommonRequestAttrs {
    packListIds: number[];
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;
    iNeedScannedCartonsOnly?: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packListIds: number[],
        iNeedPackListAttrs: boolean,
        iNeedPackJobs: boolean,
        iNeedPackJobAttrs: boolean,
        iNeedCartons: boolean,
        iNeedCartonAttrs: boolean,
        iNeedScannedCartonsOnly?: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.packListIds = packListIds
        this.iNeedPackListAttrs = iNeedPackListAttrs
        this.iNeedPackJobs = iNeedPackJobs
        this.iNeedPackJobAttrs = iNeedPackJobAttrs
        this.iNeedCartons = iNeedCartons
        this.iNeedCartonAttrs = iNeedCartonAttrs;
        this.iNeedScannedCartonsOnly = iNeedScannedCartonsOnly;
    }
}
