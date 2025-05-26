import { CommonRequestAttrs } from "../../common";

export class IModuleIdRequest extends CommonRequestAttrs {
    moduleCode: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        moduleCode: string,

    ) {
        super(username, unitCode, companyCode, userId);
        this.moduleCode = moduleCode;
    }
}

export class P_LocationCodeRequest extends CommonRequestAttrs {
    locationCode: string[];
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCode: string[],
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCode = locationCode;
    }
}

export class LocationDataByDateRequest extends CommonRequestAttrs {
    locationCode: string[];
    plannedDate: string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        locationCode: string[],
        plannedDate: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.locationCode = locationCode;
        this.plannedDate = plannedDate;
    }
}