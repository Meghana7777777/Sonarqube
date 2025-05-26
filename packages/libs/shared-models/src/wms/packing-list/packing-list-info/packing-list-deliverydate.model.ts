import { CommonRequestAttrs } from "../../../common";



export class PackingListDeliveryDateModel extends CommonRequestAttrs {
    deliveryDate: Date;
    vehicleNumber: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, deliveryDate: Date, vehicleNumber: string) {
        super(username, unitCode, companyCode, userId)

        this.deliveryDate = deliveryDate;
        this.vehicleNumber = vehicleNumber;

    }
}