export class GbGetAllLocationsDto {
    locationCode: string;
    isActive: number;
    locationName: string;
    parentCode: string;
    parentId: number;
    configMasterId: number;
    locationId: number;
    moduleDesc: string;
    locationExtRef: string;
    locationCapacity: string;
    maxInputJobs: string;
    maxDisplayJobs: string;
    locationHeadName: string;
    locationHeadCount: string;
    locationOrder: string;
    secCode: string;
    locationType: string;
    locationColor: string;
    constructor(
        code: string,        
        isActive: number,
        name: string,
        parentCode: string,
        parentId: number,
        configMasterId: number,
        locationId: number,
        moduleDesc: string,
        locationExtRef: string,
        locationCapacity: string,
        maxInputJobs: string,
        maxDisplayJobs: string,
        locationHeadName: string,
        locationHeadCount: string,
        moduleOrder: string,
        secCode: string,
        locationType: string,
        locationColor: string,
    ) {
        this.locationCode = code
        this.isActive = isActive
        this.locationName = name
        this.parentCode = parentCode
        this.parentId = parentId
        this.configMasterId = configMasterId
        this.locationId = locationId
        this.moduleDesc = moduleDesc
        this.locationExtRef = locationExtRef
        this.locationCapacity = locationCapacity
        this.maxInputJobs = maxInputJobs
        this.maxDisplayJobs = maxDisplayJobs
        this.locationHeadName = locationHeadName
        this.locationHeadCount = locationHeadCount
        this.locationOrder = moduleOrder
        this.secCode = secCode
        this.locationType = locationType
        this.locationColor = locationColor
    }
}
