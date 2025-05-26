import { PackActivityStatusEnum, PackInspectionStatusEnum } from "../enum";

export class FgWhReportResponseDto {
    date: string;
    floor: string;
    buyer: string;
    style: string;
    buyerPoNo: string;
    color: string;
    poQty: number;
    cartonQtyIn: number;
    garmentsQtyIn: number;
    cartonQtyOut: number;
    garmentsQtyOut: number;
    cartonWip: number;
    garmentsWip: number;
    location: string;
    remarks: string;
    unit: string;
    rackNo: string;
    country: string;
    lastReceipt: string;
    age: number;
    ageCategory: string;
    shipmentDate: string;
    weekNo: string;
    orderQty: number;
    totalCartonQty: number;
    balanceCarton: number;
    qtyPerCarton: number;
    totalOnHeadQty: number;
    inspectionStatus: PackInspectionStatusEnum;
    completeStatus: PackActivityStatusEnum;
    constructor(
        date: string,
        floor: string,
        buyer: string,
        style: string,
        buyerPoNo: string,
        color: string,
        poQty: number,
        cartonQtyIn: number,
        garmentsQtyIn: number,
        cartonQtyOut: number,
        garmentsQtyOut: number,
        cartonWip: number,
        garmentsWip: number,
        location: string,
        remarks: string,
        unit: string,
        rackNo: string,
        country: string,
        lastReceipt: string,
        age: number,
        ageCategory: string,
        shipmentDate: string,
        weekNo: string,
        orderQty: number,
        totalCartonQty: number,
        balanceCarton: number,
        qtyPerCarton: number,
        totalOnHeadQty: number,
        inspectionStatus: PackInspectionStatusEnum,
        completeStatus: PackActivityStatusEnum,
    ) {
        this.date = date;
        this.floor = floor;
        this.buyer = buyer;
        this.style = style;
        this.buyerPoNo = buyerPoNo;
        this.color = color;
        this.poQty = poQty;
        this.cartonQtyIn = cartonQtyIn;
        this.garmentsQtyIn = garmentsQtyIn;
        this.cartonQtyOut = cartonQtyOut;
        this.garmentsQtyOut = garmentsQtyOut;
        this.cartonWip = cartonWip;
        this.garmentsWip = garmentsWip;
        this.location = location;
        this.remarks = remarks;
        this.unit = unit;
        this.rackNo = rackNo;
        this.country = country;
        this.lastReceipt = lastReceipt;
        this.age = age;
        this.ageCategory = ageCategory;
        this.shipmentDate = shipmentDate;
        this.weekNo = weekNo;
        this.orderQty = orderQty;
        this.totalCartonQty = totalCartonQty;
        this.balanceCarton = balanceCarton;
        this.qtyPerCarton = qtyPerCarton;
        this.totalOnHeadQty = totalOnHeadQty;
        this.inspectionStatus = inspectionStatus;
        this.completeStatus = completeStatus;
    }
}