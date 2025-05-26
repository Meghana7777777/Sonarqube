import { OrderTypeEnum } from "../../enum/oq-type.enum";

export class PoSubLineModel {
    id: number;
    size: string;
    color: string;
    schedule: string;
    quantity: number;
    vpo: string;
    co: string;
    oqType: OrderTypeEnum;

    constructor(
        id: number,
        size: string,
        color: string,
        schedule: string,
        quantity: number,
        vpo: string,
        co: string,
        oqType: OrderTypeEnum
    ) {
        this.id = id;
        this.size = size;
        this.color = color;
        this.schedule = schedule;
        this.quantity = quantity;
        this.vpo = vpo;
        this.co = co;
        this.oqType = oqType;
    }
}