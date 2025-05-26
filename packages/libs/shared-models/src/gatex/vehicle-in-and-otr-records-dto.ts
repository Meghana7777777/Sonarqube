export class VehicleInAndOTRRecordsDto {
    id: number;
    vehicleNo: string;
    dName: string;
    dContact: string;
    arrivalDateTime: string | null;
    departureDateTime: string | null;
    vehicleType: string;
    inHouseVehicle: boolean;
    vinrId: string | null;
    votrId: string | null;
    isActive: boolean;
    createdAt: string;
    createdUser: string;
    updatedAt: string;
    updatedUser: string;
    versionFlag: number;
    constructor(
        id: number,
        vehicleNo: string,
        dName: string,
        dContact: string,
        arrivalDateTime: string | null,
        departureDateTime: string | null,
        vehicleType: string,
        inHouseVehicle: boolean,
        vinrId: string | null,
        votrId: string | null,
        isActive: boolean,
        createdAt: string,
        createdUser: string,
        updatedAt: string,
        updatedUser: string,
        versionFlag: number,
    ){
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
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
    }
}