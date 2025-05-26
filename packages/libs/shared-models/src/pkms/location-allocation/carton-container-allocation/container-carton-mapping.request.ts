import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum } from "../../enum";
import { CartonIdRequest } from "../carton-id.request";

export class ContainerCartonMappingRequest extends CommonRequestAttrs {
    packingListId?: number;
    containerId: number;
    // isDirectAllocation: boolean; // this means, if this is true -> then the carton will be mapped to the container with CONFIRM status
    isOverRideSysAllocation: boolean; // false
    mappingRequestFor?: FgCurrentContainerLocationEnum;
    allowPartialAllocation: boolean;
    cartonInfo: CartonIdRequest[];
    markAsIssued?: boolean; // This is utilized during the de-allocation of the carton from the container. If this is set to true, then we will mark the entrire carton qty as issued. 
    insCartonOverride?: boolean; // inspection carton . 
    constructor(username: string, unitCode: string, companyCode: string, userId: number, packingListId: number, containerId: number, isOverRideSysAllocation: boolean, mappingRequestFor: FgCurrentContainerLocationEnum, allowPartialAllocation: boolean, cartonInfo: CartonIdRequest[], markAsIssued?: boolean, insCartonOverride?: boolean) {
        super(username, unitCode, companyCode, userId)
        this.packingListId = packingListId;
        this.containerId = containerId;
        this.isOverRideSysAllocation = isOverRideSysAllocation;
        this.mappingRequestFor = mappingRequestFor;
        this.allowPartialAllocation = allowPartialAllocation;
        this.cartonInfo = cartonInfo;
        this.markAsIssued = markAsIssued;
        this.insCartonOverride = insCartonOverride;
    }
}
