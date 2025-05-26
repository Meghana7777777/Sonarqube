import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { LocationDetailsModel } from "../../location-allocation";
import { FgContainerLocationStatusEnum } from "./fg-container-location-status.enum";

export class FgContainersDetailsModel extends CommonRequestAttrs {
    barcode: string;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    uom: string;
    maxItems: number;

    status: FgContainerLocationStatusEnum;
    containerCurrentLoc: FgCurrentContainerLocationEnum; // describes where the container is
    containerCureentState: FgCurrentContainerStateEnum; // describes what the container current status is


    totalConfirmedCartons: number; // calculation from the container_roll_map entity
    confirmedQty: number; // calculation from the container_roll_map entity i.e based on the roll_id and its pending quantity

    totalAllocatedCartons: number; // calculation from the container_roll_map entity
    allocatedQty: number; // calculation from the container_roll_map entity i.e based on the roll_id and its pending quantity

    suggestedBinInfo: LocationDetailsModel;
    confimredBinInfo: LocationDetailsModel;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, barcode: string, containerId: number, containerCode: string, containerCapacity: number, uom: string, maxItems: number, status: FgContainerLocationStatusEnum, containerCurrentLoc: FgCurrentContainerLocationEnum, containerCureentState: FgCurrentContainerStateEnum, totalConfirmedCartons: number, confirmedQty: number, totalAllocatedCartons: number, allocatedQty: number, suggestedBinInfo: LocationDetailsModel, confimredBinInfo: LocationDetailsModel) {
        super(username, unitCode, companyCode, userId);
        this.barcode = barcode;
        this.containerId = containerId;
        this.containerCode = containerCode;
        this.containerCapacity = containerCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.status = status;
        this.containerCurrentLoc = containerCurrentLoc;
        this.containerCureentState = containerCureentState;
        this.totalConfirmedCartons = totalConfirmedCartons;
        this.confirmedQty = confirmedQty;
        this.totalAllocatedCartons = totalAllocatedCartons;
        this.allocatedQty = allocatedQty;
        this.suggestedBinInfo = suggestedBinInfo;
        this.confimredBinInfo = confimredBinInfo;
    }



}