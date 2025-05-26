import { InsInspectionStatusEnum } from "@xpparel/shared-models";
import { GrnStatusEnum,  } from "../../enum";



export class PackingListSummaryModel {
    id: number;
    batchCount: number;
    lotCount: number;
    rollCount: number;
    totalQuantity: number;
    uom: string;

    securityCheckIn: boolean; // IF CHECK IN AT IS NOT NULL ITS TRUE
    securityCheckInAt: Date;
    securityCheckOutAt: Date;

    packingListCode: string;
    packingListDate: Date;
    deliveryDate: Date;
    grnStatus: GrnStatusEnum;
    inspectionStatus: InsInspectionStatusEnum;

    supplierName: string;

    supplierCode: string;
    supplierDesc: string;

    supplierPoCode: string;
    supplierPoDesc: string;
    poQty: number;

    phVehicleId: number;
    phVehicleNumber: string;
    vehicleCameIn: boolean; // ITS SAME AS SECURITY IN
    driverName: string;
    driverContact: string;

    unloadingStartTime: Date;
    unloadingCompletedTime: Date;


    constructor(id: number,
        batchCount: number,
        lotCount: number,
        rollCount: number,
        totalQuantity: number,
        uom: string,

        securityCheckIn: boolean,
        securityCheckInAt: Date,
        securityCheckOutAt: Date,

        packingListCode: string,
        packingListDate: Date,
        deliveryDate: Date,
        grnStatus: GrnStatusEnum,
        inspectionStatus: InsInspectionStatusEnum,

        supplierName: string,
        supplierCode: string,
        supplierDesc: string,

        supplierPoCode: string,
        supplierPoDesc: string,
        poQty: number,

        phVehicleId: number,
        phVehicleNumber: string,
        vehicleCameIn: boolean,

        unloadingStartTime: Date,
        unloadingCompletedTime: Date,
        driverName: string,
        driverContact: string) {
        this.id = id,
            this.batchCount = batchCount,
            this.lotCount = lotCount,
            this.rollCount = rollCount,
            this.totalQuantity = totalQuantity,
            this.uom = uom,

            this.securityCheckIn = securityCheckIn,
            this.securityCheckInAt = securityCheckInAt,
            this.securityCheckOutAt = securityCheckOutAt,

            this.packingListCode = packingListCode,
            this.packingListDate = packingListDate,
            this.deliveryDate = deliveryDate,
            this.grnStatus = grnStatus,
            this.inspectionStatus = inspectionStatus,

            this.supplierName = supplierName,
            this.supplierCode = supplierCode,
            this.supplierDesc = supplierDesc,

            this.supplierPoCode = supplierPoCode,
            this.supplierPoDesc = supplierPoDesc,
            this.poQty = poQty,

            this.vehicleCameIn = vehicleCameIn,
            this.phVehicleId = phVehicleId,
            this.phVehicleNumber = phVehicleNumber,

            this.unloadingStartTime = unloadingStartTime,
            this.unloadingCompletedTime = unloadingCompletedTime,

            this.driverContact = driverContact;
            this.driverName = driverName;
    }



}
