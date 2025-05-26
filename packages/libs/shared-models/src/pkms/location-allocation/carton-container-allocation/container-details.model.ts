import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { FgContainerLocationStatusEnum } from "../../masters";
import { LocationDetailsModel } from "../location-container-confirmation";

export class ContainerDetailsModel extends CommonRequestAttrs{
    barcode: string;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    uom: string;
    maxItems: number;

    status: FgContainerLocationStatusEnum;
    containerCurrentLoc: FgCurrentContainerLocationEnum; // describes where the container is
    containerCurrentState: FgCurrentContainerStateEnum; // describes what the container current status is


    totalConfirmedCartons: number; // calculation from the container_carton_map entity
    confirmedQty: number; // calculation from the container_carton_map entity i.e based on the carton_id and its pending quantity

    totalAllocatedCartons: number; // calculation from the container_carton_map entity
    allocatedQty: number; // calculation from the container_carton_map entity i.e based on the carton_id and its pending quantity

    suggestedLocationInfo: LocationDetailsModel;
    confirmedLocationInfo: LocationDetailsModel;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, containerId: number, containerCode: string,  containerCapacity: number, uom: string, maxItems: number, status: FgContainerLocationStatusEnum, containerCurrentLoc: FgCurrentContainerLocationEnum, containerCurrentState: FgCurrentContainerStateEnum, totalConfirmedCartons: number, confirmedQty: number, totalAllocatedCartons: number, allocatedQty: number,  suggestedLocationInfo: LocationDetailsModel, confirmedLocationInfo: LocationDetailsModel) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.containerId = containerId;
        this.containerCode = containerCode;
        this.containerCapacity = containerCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.status = status;
        this.containerCurrentLoc = containerCurrentLoc;
        this.containerCurrentState = containerCurrentState;
        this.totalConfirmedCartons= totalConfirmedCartons;
        this.confirmedQty = confirmedQty;   
        this.totalAllocatedCartons = totalAllocatedCartons;
        this.allocatedQty = allocatedQty;
        this.suggestedLocationInfo = suggestedLocationInfo;
        this.confirmedLocationInfo = confirmedLocationInfo;
    }



}