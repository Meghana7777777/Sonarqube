import { FgLocationModel } from "../../masters";
import { ContainerDetailsModel } from "../carton-container-allocation";

export class CartonLocationModel {
    cartonId: string;
    barcode: string;

    containerInfo ?: ContainerDetailsModel
    locationInfo ?: FgLocationModel;

    constructor(cartonId: string, barcode: string, containerInfo ?: ContainerDetailsModel,locationInfo ?: FgLocationModel) {
        this.cartonId = cartonId;
        this.barcode = barcode;
        this.containerInfo = containerInfo;
        this.locationInfo = locationInfo;
    }
}