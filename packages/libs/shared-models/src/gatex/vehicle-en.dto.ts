import { VehicleTypeEnum } from "./enum";

export class VehicleDto {
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
    isActive: boolean;
    createdAt: Date;
    createdUser: string | null;
    updatedAt: Date;
    updatedUser: string | null;
    versionFlag: number;
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
        isActive: boolean,
        createdAt: Date,
        createdUser: string | null,
        updatedAt: Date,
        updatedUser: string | null,
        versionFlag: number,
    ){
        this.id=id;
        this.vehicleNo=vehicleNo;
        this.dName=dName;
        this.dContact=dContact;
        this.arrivalDateTime=arrivalDateTime;
        this.departureDateTime=departureDateTime;
        this.vehicleType=vehicleType;
        this.inHouseVehicle=inHouseVehicle;
        this.vinrId=vinrId;
        this.votrId=votrId;
        this.isActive=isActive;
        this.createdAt=createdAt;
        this.createdUser=createdUser;
        this.updatedAt=updatedAt;
        this.updatedUser=updatedUser;
        this.versionFlag=versionFlag;
    }
}
