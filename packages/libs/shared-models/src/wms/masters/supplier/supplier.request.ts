import { CommonRequestAttrs } from "../../../common";


export class SupplierCreateRequest extends CommonRequestAttrs {
    id:number;
    supplierName: string;
    supplierCode: string;
    phoneNumber: string;
   supplierAddress :string
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,supplierName: string,supplierCode: string, phoneNumber: string,supplierAddress :string,isActive:boolean){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.supplierName=supplierName;
        this.supplierCode= supplierCode;
        this.phoneNumber=phoneNumber;
        this.supplierAddress=supplierAddress;
        this.isActive=isActive;
        
        
    }
}

