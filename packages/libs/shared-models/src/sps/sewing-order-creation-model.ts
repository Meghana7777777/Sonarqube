import { CommonRequestAttrs } from "../common";
import { MoLineInfo } from "./mo-line-info";

export class SewingCreationOptionsModel extends CommonRequestAttrs{
    orderid: number ;
    orderNumber: string ; // order
    quantity: number;
    style: string;
    externalSystemRefNo : string;
    customerStyle : string; 
    customerStyleRef : string;
    customerNo : string; // order
    customerName : string; // order
    deliveryDate: string ;
    destination: string ;
    PlannedCutDate: string ;
    coLine: string ;
    buyerPo: string ;
    packMethod : string; //??
    productType: string ;//order
    productName: string ;//order
    productCategory: string ;//order
    garmentVendorPo: string ;
    description:string;
    moLineInfo: MoLineInfo[] ;
    mOrderId : number;
    sewSerial: number;
    planProductionDate:string;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        orderid: number ,
        orderNumber: string ,
        quantity: number,
        style: string,
        externalSystemRefNo : string,
        customerStyle : string,
        customerStyleRef : string,
        customerNo : string,
        customerName : string,
        deliveryDate: string ,
        destination: string ,
        PlannedCutDate: string ,
        coLine: string ,
        buyerPo: string ,
        packMethod:string,
        productType: string ,
        productName: string ,
        productCategory: string ,
        garmentVendorPo: string ,
        description:string,
        moLineInfo: MoLineInfo[],
        mOrderId : number,
        sewSerial: number,
        planProductionDate : string
    ){
        super(username, unitCode, companyCode, userId);
        this.orderid= orderid ;
        this.orderNumber= orderNumber ;
        this.quantity =quantity;
        this.style= style;
        this.externalSystemRefNo = externalSystemRefNo;
        this.customerStyle = customerStyle;
        this.customerStyleRef = customerStyleRef;
        this.customerNo = customerNo;
        this.customerName = customerName;
        this.deliveryDate= deliveryDate ;
        this.destination= destination ;
        this.PlannedCutDate= PlannedCutDate ;
        this.coLine= coLine ;
        this.buyerPo= buyerPo ;
        this.productType= productType ;
        this.productName= productName ;
        this.productCategory= productCategory ;
        this.garmentVendorPo= garmentVendorPo ;
        this.description=description;
        this.moLineInfo= moLineInfo ;
        this.description = description;
        this.mOrderId= mOrderId ;
        this.sewSerial = sewSerial;
        this.packMethod=packMethod;
        this.planProductionDate = planProductionDate;

    }

    
}