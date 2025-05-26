import { GlobalResponseObject } from "../common";

export class KnitJobObjectResponse extends GlobalResponseObject {
    data: KnitJobObjectModel[];
    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KnitJobObjectModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KnitJobObjectModel {
    objectCode: string;
    groupCode: string;
    requiredQty: number;
    issuedQty: number;
    locationCode: string;
    constructor(
        objectCode: string,
        groupCode: string,
        requiredQty: number,
        issuedQty: number,
        locationCode: string
    ) {
        this.objectCode = objectCode;
        this.groupCode = groupCode;
        this.requiredQty = requiredQty;
        this.issuedQty = issuedQty;
        this.locationCode = locationCode;
    }
}
