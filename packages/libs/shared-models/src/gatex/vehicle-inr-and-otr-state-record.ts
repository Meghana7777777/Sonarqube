export class VehicleINRAndOTRStateRecord {
    id: number;
    vid: string;
    vinrId: string | null;
    votrId: string | null;
    vehicleType: number;
    isActive: boolean;
    createdAt: string;
    createdUser: string | null;
    updatedAt: string;
    updatedUser: string | null;
    versionFlag: number;
    constructor(
        id: number,
        vid: string,
        vinrId: string | null,
        votrId: string | null,
        vehicleType: number,
        isActive: boolean,
        createdAt: string,
        createdUser: string | null,
        updatedAt: string,
        updatedUser: string | null,
        versionFlag: number,
    ){
        this.id = id;
        this.vid = vid;
        this.vinrId = vinrId;
        this.votrId = votrId;
        this.vehicleType = vehicleType;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
    }
}