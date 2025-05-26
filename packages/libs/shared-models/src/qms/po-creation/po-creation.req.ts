import { PoStatusEnum } from "../../common";

export class PoCreationRequest {
    poNumber: string;
    buyer: string;
    color: string;
    style: string;
    quantity: number;
    estimatedClosedDate: any;
    createdUser: string;
    poId?: number
    isActive?: boolean;
    versionFlag?: number;
    buyerId?: number;
    colorId?: number;
    styleId?: number;
    status?: PoStatusEnum

    constructor(poNumber: string, buyer: string, color: string, style: string, quantity: number, estimatedClosedDate: any, createdUser: string, poId?: number, isActive?: boolean, versionFlag?: number, buyerId?: number, colorId?: number, styleId?: number, status?: PoStatusEnum) {
        this.poNumber = poNumber
        this.buyer = buyer
        this.color = color
        this.style = style
        this.quantity = quantity
        this.estimatedClosedDate = estimatedClosedDate
        this.createdUser = createdUser
        this.poId = poId
        this.isActive = isActive
        this.versionFlag = versionFlag
        this.buyerId = buyerId
        this.colorId = colorId
        this.styleId = styleId
        this.status = status

    }
}