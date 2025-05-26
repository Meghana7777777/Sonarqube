import { CommonRequestAttrs } from "../../../common";


export class TrayCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    capacity: string;
    trollyId:string;
    length:string;
    width:string;
    height:string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,
        name: string,code: string,capacity: string,trollyId:string,length:string,width:string,height:string)
    {
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=name;
        this.code=code;
        this.capacity=capacity;
        this.trollyId=trollyId;
        this.length=length;
        this.width=width;
        this.height=height;
    }
}
