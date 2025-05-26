import { PoStatusEnum } from "../../common/enums";

export class PoCreationModel{
    poId:number;
    poNumber:string;
    buyer:string;
    color:string;
    style:string;
    quantity:number;
    estimatedClosedDate:any;
    isActive?: boolean;
    versionFlag?: number;
    buyerId?:number;
    colorId?:number;
    styleId?:number
    status?:PoStatusEnum

    constructor(poId:number,poNumber:string,buyer:string,color:string,style:string,quantity:number,estimatedClosedDate:any, isActive?: boolean,versionFlag?: number,buyerId?:number, colorId?:number, styleId?:number,status?:PoStatusEnum){
        this.poId = poId
        this.poNumber =poNumber
        this.buyer =buyer
        this.color =color
        this.style =style
        this.quantity =quantity
        this.estimatedClosedDate =estimatedClosedDate
        this.isActive=isActive
        this.versionFlag=versionFlag
        this.buyerId = buyerId
        this.colorId = colorId
        this.styleId = styleId
        this.status = status

    }
}