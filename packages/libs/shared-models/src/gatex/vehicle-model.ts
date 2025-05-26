import { TruckStateEnum } from "./enum";
import { VehicleTypeEnum } from "./enum/vehicle-type-enum";

export class historyRecord {
    inAt: Date;
    originalUnloadingStartTime: Date;
    unloadStartAt: Date;
    unloadCompleteAt: Date;
    unloadPauseAt: Date;
    outAt: Date;
}

export class VehicleModal {
    id: number;
    vehicleNo: string;
    dName: string;
    dContact: string;
    arrivalDateTime: Date;
    departureDateTime: Date;
    vehicleType: VehicleTypeEnum;
    inHouseVehicle: boolean;
    vinrId: number;
    votrId: number;
    vState: TruckStateEnum;
    historyData: historyRecord;
    constructor(
        id: number,
        vehicleNo: string,
        dName: string,
        dContact: string,
        arrivalDateTime: Date,
        departureDateTime: Date,
        vehicleType: VehicleTypeEnum,
        inHouseVehicle: boolean,
        vinrId: number,
        votrId: number,
    ) {
        this.id = id;
        this.vehicleNo = vehicleNo;
        this.dName = dName;
        this.dContact = dContact;
        this.arrivalDateTime = arrivalDateTime;
        this.departureDateTime = departureDateTime;
        this.vehicleType = vehicleType;
        this.inHouseVehicle = inHouseVehicle;
        this.vinrId = vinrId;
        this.votrId = votrId;
    }
}