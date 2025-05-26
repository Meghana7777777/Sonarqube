import { ProcessTypeEnum } from "../../oms";

export class GBLocationModel {
    locationId: number;
    locationCode: string;
    locationName: string;
    locationDesc: string;
    processType: string;
    locationExtRef: string;
    locationCapacity: string;
    maxInputJobs: string;
    maxDisplayJobs: string;
    locationHeadName: string;
    locationHeadCount: string;
    locationOrder: string;
    locationColor: string;
    secCode: string;
    locationType: ProcessTypeEnum;
    constructor(
        locationId: number,
        locationCode: string,
        locationName: string,
        locationDesc: string,
        processType: string,
        locationExtRef: string,
        locationCapacity: string,
        maxInputJobs: string,
        maxDisplayJobs: string,
        locationHeadName: string,
        locationHeadCount: string,
        locationOrder: string,
        locationColor: string,
        secCode: string,
        locationType: ProcessTypeEnum,
    ) {
        this.locationId = locationId;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.locationDesc = locationDesc;
        this.processType = processType;
        this.locationExtRef = locationExtRef;
        this.locationCapacity = locationCapacity;
        this.maxInputJobs = maxInputJobs;
        this.maxDisplayJobs = maxDisplayJobs;
        this.locationHeadName = locationHeadName;
        this.locationHeadCount = locationHeadCount;
        this.locationOrder = locationOrder;
        this.locationColor = locationColor;
        this.secCode = secCode;
        this.locationType = locationType;
    }
}