import { WarehouseContainerCartonsModel } from "../carton-container-allocation/warehouse-container-cartons.model";


export class LocationContainerModel {
    locationId: number;
    locationCode: string;
    locationDesc: string;
    totalSupportedContainers: number;
    totalFilledContainers: number;
    emptyContainers: number;
    containersInfo: WarehouseContainerCartonsModel[];

    constructor( locationId: number, locationCode: string, locationDesc: string, totalSupportedContainers: number, totalFilledContainers: number, emptyContainers: number, containersInfo: WarehouseContainerCartonsModel[]) {
        this.locationId = locationId;
        this.locationCode = locationCode;
        this.locationDesc = locationDesc;
        this.totalSupportedContainers = totalSupportedContainers;
        this.totalFilledContainers = totalFilledContainers;
        this.emptyContainers = emptyContainers;
        this.containersInfo = containersInfo;
    }
}