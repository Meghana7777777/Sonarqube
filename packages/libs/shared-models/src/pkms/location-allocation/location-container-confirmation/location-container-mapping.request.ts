import { CommonRequestAttrs } from "../../../common";
import { ContainerIdRequest } from "../container-id.request";

export class LocationContainerMappingRequest extends CommonRequestAttrs {
    locationId: number;
    isOverRideSysAllocation: boolean; // false
    containerInfo: ContainerIdRequest[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number, locationId: number, isOverRideSysAllocation: boolean, containerInfo: ContainerIdRequest[]) {
        super(username, unitCode, companyCode, userId);
        this.locationId = locationId;
        this.isOverRideSysAllocation = isOverRideSysAllocation;
        this.containerInfo = containerInfo;
    }
}
