export class SupplierWiseInfoResponse {
    
        supplier_code: string;
        supplier_name: string;
        cnt: number;
        arrived: boolean;
        Id: string
      
    constructor(
        supplier_code: string,
        supplier_name: string,
        cnt: number,
        arrived: boolean,
        Id: string
    ){
        this.supplier_code = supplier_code;
        this.supplier_name = supplier_name;
        this.cnt = cnt;
        this.arrived = arrived;
        this.Id = Id;
        
     }
}