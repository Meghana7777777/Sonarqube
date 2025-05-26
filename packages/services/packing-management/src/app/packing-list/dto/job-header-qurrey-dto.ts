import { PackMatReqStatusEnum } from "@xpparel/shared-models";

export class JobHeaderQurrrey{
    po:number;
    pk_config_id:number;
    pk_mat_req_id:number;
    id:number;
    job_number:string;
    job_qty:number;
    priority:number;
    request_no:number;
    mat_request_on:string;
    planned_date_time:string;
    mat_status:PackMatReqStatusEnum;


}