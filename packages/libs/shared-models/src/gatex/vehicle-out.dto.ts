import { LocationFromTypeEnum, LocationToTypeEnum, ReqStatus } from "./enum";
import { VehicleDto } from "./vehicle-en.dto";

export class VehicleOTRDto {
    id: number;
    refId: string;
    refNumber: string;
    expectedDeparture: Date;
    from: string;
    to: string;
    fromType: LocationFromTypeEnum;
    toType: LocationToTypeEnum;
    readyToSend: number;
    reqStatus: ReqStatus;
    hasItems: number;
    isActive: boolean;
    createdAt: Date;
    createdUser: string;
    updatedAt: Date;
    updatedUser: string;
    versionFlag: number;
    vehicleRecords: VehicleDto[];
    constructor(
        id: number,
        refId: string,
        refNumber: string,
        expectedDeparture: Date,
        from: string,
        to: string,
        fromType: LocationFromTypeEnum,
        toType: LocationToTypeEnum,
        readyToSend: number,
        reqStatus: ReqStatus,
        hasItems: number,
        isActive: boolean,
        createdAt: Date,
        createdUser: string | null,
        updatedAt: Date,
        updatedUser: string | null,
        versionFlag: number,
        vehicleRecords: VehicleDto[],
    ) {
        this.id = id;
        this.refId = refId;
        this.refNumber = refNumber;
        this.expectedDeparture = expectedDeparture;
        this.from = from;
        this.to = to;
        this.fromType = fromType;
        this.toType = toType;
        this.readyToSend = readyToSend;
        this.reqStatus = reqStatus;
        this.hasItems = hasItems;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
        this.vehicleRecords = vehicleRecords;
    }
}
