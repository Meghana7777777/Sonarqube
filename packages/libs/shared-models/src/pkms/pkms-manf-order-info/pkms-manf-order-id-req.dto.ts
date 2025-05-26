import { CommonRequestAttrs } from "../../common";

export class PKMSManufacturingOrderIdRequest extends CommonRequestAttrs {
    manufacturingOrderIds: number[];

    iNeedPackLists: boolean;
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        manufacturingOrderNos: number[],
        iNeedPackLists: boolean,
        iNeedPackListAttrs: boolean,
        iNeedPackJobs: boolean,
        iNeedPackJobAttrs: boolean,
        iNeedCartons: boolean,
        iNeedCartonAttrs: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.manufacturingOrderIds = manufacturingOrderNos;
        this.iNeedPackLists = iNeedPackLists;
        this.iNeedPackListAttrs = iNeedPackListAttrs;
        this.iNeedPackJobs = iNeedPackJobs;
        this.iNeedPackJobAttrs = iNeedPackJobAttrs;
        this.iNeedCartons = iNeedCartons;
        this.iNeedCartonAttrs = iNeedCartonAttrs;
    }
}