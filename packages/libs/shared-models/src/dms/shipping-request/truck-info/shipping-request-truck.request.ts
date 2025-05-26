import { CommonRequestAttrs } from "../../../common";
import { TruckTypeEnum } from "../../enum";

export class ShippingRequestTruckRequest extends CommonRequestAttrs {

    truckNo: string;
    contact: string;
    truckType: TruckTypeEnum;
    inAt: string;
    outAt: string;
    sRequestId: number;
    remarks: string;
    driverName: string;
    licenseNo: string;

    constructor(
        truckNo: string,
        contact: string,
        truckType: TruckTypeEnum,
        inAt: string,
        outAt: string,
        sRequestId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        remarks: string,
        driverName: string,
        licenseNo: string
    ) {
        super(username, unitCode, companyCode, userId)

        this.contact = contact
        this.truckNo = truckNo
        this.truckType = truckType
        this.inAt = inAt
        this.outAt = outAt
        this.sRequestId = sRequestId
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
        this.remarks = remarks;
        this.driverName = driverName;
        this.licenseNo = licenseNo;
    }
}
