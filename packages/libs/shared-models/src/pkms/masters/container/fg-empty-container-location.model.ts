import { CommonRequestAttrs } from "../../../common";
import { FgCurrentContainerLocationEnum } from "../../enum";


export class FgEmptyContainerLocationModel extends CommonRequestAttrs {
    currentContainerLocation: FgCurrentContainerLocationEnum;
    name: string;
    level: number;
    containerName: string;
    containerCode: string;
    maxItems: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, currentContainerLocation: FgCurrentContainerLocationEnum, name: string, level: number, containerName: string,
        containerCode: string,
        maxItems: number) {

        super(username, unitCode, companyCode, userId);
        this.currentContainerLocation = currentContainerLocation;
        this.name = name;
        this.level = level;
        this.containerName = containerName;
        this.containerCode = containerCode;
        this.maxItems = maxItems


    }
}
