import { VehicleRequestTypeEnum } from "./enum";

export class GatexRefIdReqDto {
    refId: string;
    vid: number;
    status: number;
    vrType: VehicleRequestTypeEnum;
    constructor(
        refId: string,
        vid: number,
        status: number,
        vrType: VehicleRequestTypeEnum,
    ) {
        this.refId = refId; 
        this.vid = vid; 
        this.status = status;   
        this.vrType = vrType;   
    }
}