export class PkShippingRequestTruckInfoModel {
    id: number; // PK of the sr_truck
    truckNumber: string;
    contact: string;
    remarks: string;
    loadStartAt: string; // when did loading started 
    loadEndAt: string; // when did the loading end
    inAt: string; // when did truck came in
    outAt: string; // when did truck leave out
    dirverName: string;
    licenseNo: string;
    loadingStatus: number;

    constructor(
        id: number, // PK of the sr_truck
        truckNumber: string,
        contact: string,
        remarks: string,
        loadStartAt: string, // when did loading started 
        loadEndAt: string, // when did the loading end
        inAt: string, // when did truck came in
        outAt: string, // when did truck leave out
        dirverName: string,
        licenseNo: string,
        loadingStatus: number
    ) {
        this.id = id;
        this.truckNumber = truckNumber;
        this.contact = contact;
        this.remarks = remarks;
        this.loadEndAt = loadEndAt;
        this.loadStartAt = loadStartAt;
        this.inAt = inAt;
        this.outAt = outAt;
        this.dirverName = dirverName;
        this.licenseNo = licenseNo;
        this.loadingStatus = loadingStatus;
    }
}