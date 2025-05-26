import { PackListMrnStatusEnum, PackMatReqStatusEnum } from "@xpparel/shared-models";

export class PackJobsQueryRes {
    pack_job_id: number;
    po_id: number;
    job_number: string;
    cartons: number;
    priority: number;
    request_no: string;
    request_id: number;
    work_station_id: number;
    work_station_desc: string;
    mat_request_on: string;
    planned_date_time: string;
    request_status: PackMatReqStatusEnum;
    mat_status: PackMatReqStatusEnum;
    pk_config_id:number;
    mat_id:number;
}