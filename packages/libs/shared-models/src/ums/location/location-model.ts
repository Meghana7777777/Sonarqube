import { ProcessTypeEnum } from "packages/libs/shared-models/src/oms";

export class LocationModel  {
    id?: number;
    locationCode: string;
    locationName: string;
    locationDesc: string;
    locationType: ProcessTypeEnum;
    locationExtRef: string;
    locationCapacity: string;
    maxInputJobs: string;
    maxDisplayJobs: string;
    locationHeadName: string;
    locationHeadCount: string;
    locationOrder: string;
    locationColor: string;
    secCode: string;
    isActive: boolean;

    constructor(
       
        id: number,
        locationCode: string,
        locationName: string,
        locationDesc: string,
        locationType: ProcessTypeEnum,
        locationExtRef: string,
        locationCapacity: string,
        maxInputJobs: string,
        maxDisplayJobs: string,
        locationHeadName: string,
        locationHeadCount: string,
        locationOrder: string,
        locationColor: string,
        secCode: string,
        isActive: boolean,


    ) {
        this.id = id;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.locationDesc = locationDesc;
        this.locationType = locationType;
        this.locationExtRef = locationExtRef;
        this.locationCapacity = locationCapacity;
        this.maxInputJobs = maxInputJobs;
        this.maxDisplayJobs = maxDisplayJobs;
        this.locationHeadName = locationHeadName;
        this.locationHeadCount = locationHeadCount;
        this.locationOrder = locationOrder;
        this.locationColor = locationColor;
        this.secCode = secCode;
        this.isActive = isActive

    }
}


