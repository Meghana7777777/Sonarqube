import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class TrollyCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    capacity: string;
    binId?: string;
    
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id:number,names: string,code: string,capacity: string, binId?: string){
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.capacity=capacity;
        this.binId=binId;
    }
}
