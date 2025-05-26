export class OrderInfoByPoSerailModel{
    productType:string;
    productName:string;
    productCategory : string;
    plantStyle : string;
    plannedDelievryDate : string;
    destiantion :string;
    plannedProductionDate : string;
    plannedCutDate:string;
    coLine:string;
    buyerPo:string;
    garmentVendorPo : string;
    oslId : number

    constructor(productType:string,productName:string,productCategory : string,plantStyle : string,plannedDelievryDate : string,destiantion :string,plannedProductionDate : string,plannedCutDate:string,coLine:string,buyerPo:string,garmentVendorPo : string,oslId : number){
    this.productType = productType
    this.productName = productName
    this.productCategory  = productCategory 
    this.plantStyle  = plantStyle 
    this.plannedDelievryDate  = plannedDelievryDate 
    this.destiantion  = destiantion 
    this.plannedProductionDate  = plannedProductionDate 
    this.plannedCutDate = plannedCutDate
    this.coLine = coLine
    this.buyerPo = buyerPo
    this.garmentVendorPo  = garmentVendorPo 
    this.oslId = oslId
    }

}