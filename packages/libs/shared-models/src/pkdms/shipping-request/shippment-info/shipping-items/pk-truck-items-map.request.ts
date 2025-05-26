import { CommonRequestAttrs } from "packages/libs/shared-models/src/common";

export class PkTruckItemsMapRequest extends CommonRequestAttrs {
    truckNo: string;
    truckId: number; //pk o fthe truck 
    srId: number;
    cartoonIds: string[];
    cartonsBarcodes: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        truckNo: string,
        truckId: number,
        srId: number,
        cartoonIds: string[], // ✅ Now expects an array
        cartonsBarcodes: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.truckNo = truckNo;
        this.truckId = truckId;
        this.srId = srId;
        this.cartoonIds = cartoonIds; // ✅ Assign array
        this.cartonsBarcodes = cartonsBarcodes;
    }
}
