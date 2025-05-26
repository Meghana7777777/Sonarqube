import { CartonBasicInfoUIModel } from "../../carton-filling";



export class ContainerCartonsUIModel {
    phId: number;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    pgName: string;
    noOfCartons: number;
    cartonsInfo: CartonBasicInfoUIModel[];
}


export class LocationContainersUIModel {
    containerBarcode: string;
    containerId: number;
    containerCode: string;
    containerCapacity: number;
    pgName: string;
    noOfCartons: number;
}
