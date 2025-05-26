import { CommonRequestAttrs } from "../../common";

export class PKMSPackOrderIdRequest extends CommonRequestAttrs {
    packOrderIds: number[];

    iNeedPackLists: boolean;
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;
    iNeedScannedCartonsOnly?: boolean;
    iNeedFgWhOpenPackLists?: boolean;
    iNeedFgWhCompletedPackLists?: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packOrderIds: number[],
        iNeedPackLists: boolean,
        iNeedPackListAttrs: boolean,
        iNeedPackJobs: boolean,
        iNeedPackJobAttrs: boolean,
        iNeedCartons: boolean,
        iNeedCartonAttrs: boolean,
        iNeedScannedCartonsOnly?: boolean,
        iNeedFgWhOpenPackLists?: boolean,
        iNeedFgWhCompletedPackLists?: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.packOrderIds = packOrderIds;
        this.iNeedPackLists = iNeedPackLists;
        this.iNeedPackListAttrs = iNeedPackListAttrs;
        this.iNeedPackJobs = iNeedPackJobs;
        this.iNeedPackJobAttrs = iNeedPackJobAttrs;
        this.iNeedCartons = iNeedCartons;
        this.iNeedCartonAttrs = iNeedCartonAttrs;
        this.iNeedScannedCartonsOnly = iNeedScannedCartonsOnly;
        this.iNeedFgWhOpenPackLists = iNeedFgWhOpenPackLists;
        this.iNeedFgWhCompletedPackLists = iNeedFgWhCompletedPackLists;
    }
}