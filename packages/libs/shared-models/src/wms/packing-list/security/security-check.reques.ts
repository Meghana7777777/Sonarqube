import { CommonRequestAttrs } from "../../../common";
import { CheckListStatus } from "../../enum";

export class SecurityCheckRequest extends CommonRequestAttrs {
    id: number;
    vehicleNumber: string;
    driverName: string;
    securityPerson: string;
    vehicleContact: string;
    inAt: Date;
    outAt: Date;
    phId: number;
    checkListStatus: CheckListStatus;
    containerNo: string;
    cusDecNo: string;
    grossWeight: number;
    netWeight: number;
    invoiceNo: string;
    remarks: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number,
        vehicleNumber: string,
        driverName: string,
        securityPerson: string,
        vehicleContact: string,
        inAt: Date,
        outAt: Date,
        phId: number,checkListStatus: CheckListStatus, containerNo: string, cusDecNo: string,  grossWeight: number, netWeight: number, invoiceNo: string, remarks: string) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.securityPerson = securityPerson;
        this.vehicleContact = vehicleContact;
        this.inAt = inAt;
        this.outAt = outAt;
        this.phId = phId;
        this.checkListStatus = checkListStatus;
        this.containerNo = containerNo;
        this.cusDecNo = cusDecNo;
        this.grossWeight = grossWeight;
        this.netWeight = netWeight;
        this.invoiceNo = invoiceNo;
        this.remarks = remarks;
    }
}
