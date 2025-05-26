import { GbGetAllLocationsDto, KC_KnitJobModel, KJ_MaterialStatusEnum } from "@xpparel/shared-models";

export interface ILocationCapacity {
    locationName: string;
    locationCode: string;
    locationId: number;
    maxCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
}
export interface ILocationCapacityMap {
    [key: number]: ILocationCapacity
}
export interface ILocations extends GbGetAllLocationsDto {
    allocatedQty: number
}
export interface IPlannedLocation {
    [key: string]: string[];
}
export interface IPlannedUnPlannedJobs {
    plannedJobs: IPlannedLocation;
    unplannedJobs: KC_KnitJobModel[]
}
export interface IKnitJob {
    jobNumber: string;
    jobQty: number;
    color: string;
    size: string;
    knitGroup: string;
    productCode: string;
    productName: string;
    productType: string;
    bgColor: string;
    isPlanned: boolean;
}
export interface IKnitJobMap {
    [key: string]: IKnitJob;
}

export const kjMaterialStatusEnumClassNames = {
    [KJ_MaterialStatusEnum.COMPLETELY_ISSUED]: 'bg-green',
    [KJ_MaterialStatusEnum.OPEN]: 'bg-gray',
    [KJ_MaterialStatusEnum.PARTIAL_ISSUED]: 'bg-orange',
    [KJ_MaterialStatusEnum.REQUESTED]: 'bg-yellow-knit',
}