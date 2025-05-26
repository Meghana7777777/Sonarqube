import { GlobalResponseObject } from "../../common"

export class MmsAssetLocationsResponse extends GlobalResponseObject {
    data: MmsAssetLocationsDataModel[]
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: MmsAssetLocationsDataModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class MmsAssetLocationsDataModel {
    assetServeId: number;
    assetId: number;
    assetName: string;
    assetCode: string;
    assetServiceDate: string;
    status: string;
    serviceName: string;
    serviceOwner: string;
    ServiceMobileNumber: string;
    supervisor: string;
    supervisorNumber: string;
    serviceStartDate: string;
    completedDate: string;
    serviceType: string;
    supervisorStartTime: string;
    mechanicStartTime: string;
    mechanicEndTime: string | null;
    supervisorEndTime: string | null;
    downtimeReason: string;
    rootCause: string | null;
    downtimeStatus: string;
    remarks: string | null;
    location: string;
    constructor(
        assetServeId: number,
        assetId: number,
        assetName: string,
        assetCode: string,
        assetServiceDate: string,
        status: string,
        serviceName: string,
        serviceOwner: string,
        ServiceMobileNumber: string,
        supervisor: string,
        supervisorNumber: string,
        serviceStartDate: string,
        completedDate: string,
        serviceType: string,
        supervisorStartTime: string,
        mechanicStartTime: string,
        mechanicEndTime: string | null,
        supervisorEndTime: string | null,
        downtimeReason: string,
        rootCause: string | null,
        downtimeStatus: string,
        remarks: string | null,
        location: string
    ) {
        this.assetServeId = assetServeId;
        this.assetId = assetId;
        this.assetName = assetName;
        this.assetCode = assetCode;
        this.assetServiceDate = assetServiceDate;
        this.status = status;
        this.serviceName = serviceName;
        this.serviceOwner = serviceOwner;
        this.ServiceMobileNumber = ServiceMobileNumber;
        this.supervisor = supervisor;
        this.supervisorNumber = supervisorNumber;
        this.serviceStartDate = serviceStartDate;
        this.completedDate = completedDate;
        this.serviceType = serviceType;
        this.supervisorStartTime = supervisorStartTime;
        this.mechanicStartTime = mechanicStartTime;
        this.mechanicEndTime = mechanicEndTime;
        this.supervisorEndTime = supervisorEndTime;
        this.downtimeReason = downtimeReason;
        this.rootCause = rootCause;
        this.downtimeStatus = downtimeStatus;
        this.remarks = remarks;
        this.location = location;
    }
}