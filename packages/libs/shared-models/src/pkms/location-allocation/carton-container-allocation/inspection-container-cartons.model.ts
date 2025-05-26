import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { InspectionContainerGroupedCartonsModel } from "./inspection-container-grouped-cartons.model";


export class InspectionContainerCartonsModel   {
    phId: number;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    uom: string;
    maxItems: number;
    containerCurrentLoc: FgCurrentContainerLocationEnum;
    containerCurrentState: FgCurrentContainerStateEnum;
    groupedCartons: InspectionContainerGroupedCartonsModel[];

    constructor(phId: number, containerId: number,containerCode: string, containerCapacity: number, uom: string, maxItems: number, containerCurrentLoc: FgCurrentContainerLocationEnum, containerCurrentState: FgCurrentContainerStateEnum, groupedCartons: InspectionContainerGroupedCartonsModel[]) {
        this.phId = phId;
        this.containerId = containerId;
        this.containerCode = containerCode;
        this.containerCapacity = containerCapacity;
        this.uom = uom;
        this.maxItems = maxItems;
        this.containerCurrentLoc = containerCurrentLoc;
        this.containerCurrentState = containerCurrentState;
        this.groupedCartons = groupedCartons;
        
    }
}
