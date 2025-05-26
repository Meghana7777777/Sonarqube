import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { FgContainerBehaviorEnum } from "./fg-container-behavior.enum";


export class FgContainerCreationModel extends CommonRequestAttrs {
    id: number
    isActive: boolean
    name: string;
    code: string;
    weightCapacity: number;
    weightUom: string;
    currentLocationId: number;
    currentContainerState: FgCurrentContainerStateEnum;
    currentContainerLocation: FgCurrentContainerLocationEnum;
    containerBehavior: FgContainerBehaviorEnum;
    freezeStatus: string;
    maxItems: number;
    barcodeId: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, isActive: boolean, names: string, code: string, weightCapacity: number, weightUom: string, currentLocationId: number, currentContainerState: FgCurrentContainerStateEnum, currentContainerLocation: FgCurrentContainerLocationEnum, containerBehavior: FgContainerBehaviorEnum, freezeStatus: string, maxItems: number, barcodeId: string) {

        super(username, unitCode, companyCode, userId);
        this.id = id
        this.isActive = isActive
        this.name = names;
        this.code = code;
        this.weightCapacity = weightCapacity;
        this.weightUom = weightUom;
        this.currentLocationId = currentLocationId;
        this.currentContainerState = currentContainerState;
        this.currentContainerLocation = currentContainerLocation;
        this.containerBehavior = containerBehavior;
        this.freezeStatus = freezeStatus;
        this.maxItems = maxItems;
        this.barcodeId = barcodeId;

    }
}
