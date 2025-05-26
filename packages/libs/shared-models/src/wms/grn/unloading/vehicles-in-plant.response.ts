import { GlobalResponseObject } from "../../../common";
import { GrnVehicleInPlantModel } from "./vehicles-in-plant.model";


export class GrnVehiclesInThePlantResp extends GlobalResponseObject {
    data?: GrnVehicleInPlantModel[];

    /**
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean,
        errorCode: number,
        internalMessage: string,
        data: GrnVehicleInPlantModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}