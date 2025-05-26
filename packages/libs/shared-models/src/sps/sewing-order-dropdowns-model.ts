export class MoListDropdownsModel {
    orderNo: string; // The manufacturing order number
    orderId: number; // The primary key of the order
    style: string; // The style of the order
    buyer: string; // The buyer of the order
    plantStyle: string; // The plant style reference that is entered during order creation in OMS
    moLineInformation: MoLineInformation[]; // Array to hold the lines of the order (MO lines)

    constructor(orderNo: string, orderId: number, style: string, buyer: string, plantStyle: string, moLineInformation: MoLineInformation[]) {
        this.orderNo = orderNo;
        this.orderId = orderId;
        this.style = style;
        this.buyer = buyer;
        this.plantStyle = plantStyle;
        this.moLineInformation = moLineInformation; // Initialize the MO line info
    }
}

export class MoLineInformation {
    moLine: string; // MO line identifier
    cutSerial: string; // Cut serial for the line
    // Additional properties can be added as necessary for the MO line

    constructor(moLine: string, cutSerial: string) {
        this.moLine = moLine;
        this.cutSerial = cutSerial;
    }
}
