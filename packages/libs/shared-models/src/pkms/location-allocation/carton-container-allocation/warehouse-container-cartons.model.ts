import { CartonBasicInfoModel } from "../../carton-filling";
import { CartonInfoModel } from "../../carton-filling/carton-info.model";
import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { FgContainerLocationStatusEnum } from "../../masters";



export class WarehouseContainerCartonsModel {
    phId: number; 
    pgName: string;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    uom: string;
    maxItems: number;
    containerCurrentLoc: FgCurrentContainerLocationEnum;
    containerCurrentState: FgCurrentContainerStateEnum;
    status: FgContainerLocationStatusEnum;
    totalMappedCartons: number;
    cartonsInfo: CartonInfoModel[];
    cartonsBasicInfo: CartonBasicInfoModel[];

    constructor(pgName: string, phId: number, containerId: number,containerCode: string, containerCapacity: number, uom: string, maxItems: number, containerCurrentLoc: FgCurrentContainerLocationEnum, containerCurrentState: FgCurrentContainerStateEnum, status: FgContainerLocationStatusEnum, totalMappedCartons: number, cartonsInfo: CartonInfoModel[], cartonsBasicInfo: CartonBasicInfoModel[]) {
        this.pgName = pgName;
        this.phId = phId;
        this.containerId = containerId;
        this.containerCode = containerCode;
        this.containerCapacity = containerCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.containerCurrentLoc = containerCurrentLoc;
        this.containerCurrentState = containerCurrentState;
        this.status = status;
        this.totalMappedCartons = totalMappedCartons;
        this.cartonsInfo = cartonsInfo;
        this.cartonsBasicInfo = cartonsBasicInfo;
    }
}
