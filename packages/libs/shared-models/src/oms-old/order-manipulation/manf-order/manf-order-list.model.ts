
export class MoListModel {
    orderNo: string; // the manufacturing order no
    orderId: number; // the PK of the order
    style: string; 
    buyer: string;
    plantStyle: string; // The plant style ref that is entered during order creation in OMS (during sizes save)

    constructor(orderNo: string, orderId: number, style: string, buyer: string, plantStyle: string) {
        this.orderNo = orderNo;
        this.orderId = orderId;
        this.style = style;
        this.buyer = buyer;
        this.plantStyle = plantStyle;
    }
}