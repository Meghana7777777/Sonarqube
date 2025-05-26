import { PackingMethodsEnum } from "@xpparel/shared-models";

export class PacklistQurreyDto{
    configId:number;
    pl_config_no:string;
    pl_config_desc:string;
    unit_code:string;
    company_code:string;
    quantity:number;
    pk_type_id:number;
    no_of_cartons:number;
    pack_job_qty:number;
    created_user:string;
    PoId:number;
    processing_serial:number;
    delivery_date:string;
    SpecId:number
    pack_method:PackingMethodsEnum;

}