export class CartonHeadInfoModel {
    mo: string; // manufacturingOrder (MO) number
    moLine: string; // manufacturingOrder Line
    buyerPo: string; // Buyer's Purchase Order
    customerName: string; // Customer Name
    style: string; // Style of the product
    cartonQty: number; // Quantity of cartons
    plannedDeliveryDate: string; // Planned delivery date
    status: boolean; // Status of the carton
    destination: string; // Destination of the shipment
    pendingCartonsForFgIn: number;
    pendingCartonsForFgOut: number;
    barcode: string;

    constructor(
        mo: string,
        moLine: string,
        buyerPo: string,
        customerName: string,
        style: string,
        cartonQty: number,
        plannedDeliveryDate: string,
        status: boolean,
        destination: string,
        pendingCartonsForFgIn: number,
        pendingCartonsForFgOut: number,
        barcode: string
    ) {
        this.mo = mo;
        this.moLine = moLine;
        this.buyerPo = buyerPo;
        this.customerName = customerName;
        this.style = style;
        this.cartonQty = cartonQty;
        this.plannedDeliveryDate = plannedDeliveryDate;
        this.status = status;
        this.destination = destination;
        this.pendingCartonsForFgIn = pendingCartonsForFgIn;
        this.pendingCartonsForFgOut = pendingCartonsForFgOut;
        this.barcode = barcode;
    }
}
