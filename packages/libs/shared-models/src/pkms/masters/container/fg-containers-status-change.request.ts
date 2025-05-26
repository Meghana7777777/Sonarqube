
import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { FgContainerBehaviorEnum } from "./fg-container-behavior.enum";

export class FgContainerStatusChangeRequest extends CommonRequestAttrs {
    containerId: number;
    currentContainerState: FgCurrentContainerStateEnum;
    currentContainerLocation: FgCurrentContainerLocationEnum;
    containerBehavior: FgContainerBehaviorEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, containerId: number, currentContainerState: FgCurrentContainerStateEnum, currentContainerLocation: FgCurrentContainerLocationEnum, containerBehavior: FgContainerBehaviorEnum) {

        super(username, unitCode, companyCode, userId);
        this.containerId = containerId;
        this.currentContainerState = currentContainerState;
        this.currentContainerLocation = currentContainerLocation;
        this.containerBehavior = containerBehavior;

    }
}