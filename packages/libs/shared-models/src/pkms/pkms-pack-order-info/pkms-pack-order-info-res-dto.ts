import { PKMSPackListInfoModel } from "../pkms-pack-list-order-info";

export class PKMSPackOrderInfoModel {
    packListsInfo: PKMSPackListInfoModel[]; // should get only if iNeedPackLists is true
    packOrderId: number;
    packOrderDesc: string;
    constructor(
        packListsInfo: PKMSPackListInfoModel[], // should get only if iNeedPackLists is true
        packOrderId: number,
        packOrderDesc: string,
    ) {
        this.packListsInfo = packListsInfo;
        this.packOrderId = packOrderId;
        this.packOrderDesc = packOrderDesc;
    }
}

