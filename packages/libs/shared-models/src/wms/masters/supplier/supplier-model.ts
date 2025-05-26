import { CommonRequestAttrs } from "../../../common";


export class SupplierCreationModel extends CommonRequestAttrs {
    id:number;
    supplierName: string;
    supplierCode: string;
    phoneNumber: string;
    supplierAddress :string

    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, supplierName: string,supplierCode: string, phoneNumber: string,supplierAddress: string){
 
        super(username,unitCode,companyCode,userId);
        this.id = id;
        this.supplierName=supplierName;
        this.supplierCode=supplierCode;
        this.phoneNumber= phoneNumber;
        this.supplierAddress=supplierAddress;
       
        
      
        
    }
}
