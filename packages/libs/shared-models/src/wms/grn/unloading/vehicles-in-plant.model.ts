import { CommonRequestAttrs } from "../../../common";


export class GrnVehicleInPlantModel extends CommonRequestAttrs {

    vehicleNumber: string;
    weight: number;
    inAt: string;
    outAt: string;
    supplier: string;



    constructor(username: string, unitCode: string, companyCode: string, userId: number, vehicleNumber: string, weight: number, inAt: string, outAt: string, supplier: string) {
        super(username, unitCode, companyCode, userId);
        this.vehicleNumber = vehicleNumber;
        this.weight = weight;
        this.inAt = inAt;
        this.outAt = outAt;
        this.supplier = supplier;

    }
}