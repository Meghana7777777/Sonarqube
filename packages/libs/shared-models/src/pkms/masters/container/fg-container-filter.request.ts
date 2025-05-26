import { CommonRequestAttrs } from "../../../common";

export class FgContainerFilterRequest extends CommonRequestAttrs {
    whId: number;
    rackId?: number[];
    locationId?: number[];
    constructor(
        companyCode: string,
        unitCode: string,
        username: string,
        userId: number,
        whId: number,
        rackId?: number[],
        locationId?: number[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.whId = whId
        this.rackId = rackId
        this.locationId = locationId
    }
}