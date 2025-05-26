export class VehicleINRAndOTRDetailsDto {
    id: number;
    refId: string;
    refNumber: string;
    expectedArrival: string;
    from: string;
    to: string;
    fromType: string;
    toType: string;
    readyToIn: number;
    reqStatus: number;
    hasItems: number;
    isActive: boolean;
    createdAt: string;
    createdUser: string;
    updatedAt: string;
    updatedUser: string;
    versionFlag: number;
    constructor(
        id: number,
        refId: string,
        refNumber: string,
        expectedArrival: string,
        from: string,
        to: string,
        fromType: string,
        toType: string,
        readyToIn: number,
        reqStatus: number,
        hasItems: number,
        isActive: boolean,
        createdAt: string,
        createdUser: string,
        updatedAt: string,
        updatedUser: string,
        versionFlag: number,
    ){
        this.id = id;
        this.refId = refId;
        this.refNumber = refNumber;
        this.expectedArrival = expectedArrival;
        this.from = from;
        this.to = to;
        this.fromType = fromType;
        this.toType = toType;
        this.readyToIn = readyToIn;
        this.reqStatus = reqStatus;
        this.hasItems = hasItems;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
    }
}