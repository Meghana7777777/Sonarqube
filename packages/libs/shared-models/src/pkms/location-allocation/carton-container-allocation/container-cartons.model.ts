import { CartonBasicInfoModel } from "../../carton-filling";


export class ContainerCartonsModel {
    containerId: number;
    containerCode: string;
    cartonsInfo: CartonBasicInfoModel[];

    constructor(containerId: number, containerCode: string, cartonsInfo: CartonBasicInfoModel[]) {
        this.containerCode = containerCode;
        this.containerId = containerId;
        this.cartonsInfo = cartonsInfo;
    }
}
