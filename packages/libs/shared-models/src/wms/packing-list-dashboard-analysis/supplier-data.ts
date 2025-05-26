export class SupplierData {
    
    packingListCode: string;
    itemCode: string;
    itemCategory: string;
    deliveryDate: string;
    arrived: boolean;
    id:number;
  
constructor(
    packingListCode: string,
    itemCode: string,
    itemCategory: string,
    deliveryDate: string,
    arrived: boolean,
    id:number
){
    this.packingListCode = packingListCode;
    this.itemCode = itemCode;
    this.itemCategory = itemCategory;
    this.deliveryDate = deliveryDate;
    this.arrived = arrived;
    this.id = id
    
 }
}