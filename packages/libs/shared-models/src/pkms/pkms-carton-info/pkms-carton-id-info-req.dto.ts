import { CommonRequestAttrs } from "../../common";

export class PKMSCartonIdsRequest extends CommonRequestAttrs {
    cartonIds: number[];
    iNeedCartonAttrs: boolean;
    iNeedScannedCartonsOnly?: boolean;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        cartonIds: number[],
        iNeedCartonAttrs: boolean,
        iNeedScannedCartonsOnly?: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.cartonIds = cartonIds;
        this.iNeedCartonAttrs = iNeedCartonAttrs;
        this.iNeedScannedCartonsOnly = iNeedScannedCartonsOnly
    }
}