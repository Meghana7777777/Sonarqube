import { CommonRequestAttrs } from "../../../common";
import { PkTruckTypeEnum } from "../../enum";

export class PkShippingRequestTruckIdRequest extends CommonRequestAttrs {
    truckIds: number[];
    sRequestId: number;

    constructor(
        truckIds: number[],
        sRequestId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.truckIds = truckIds
        this.sRequestId = sRequestId

    }
}
