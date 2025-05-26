import { PackMatReqStatusEnum } from "@xpparel/shared-models";

export class PackMaterialQueryRes {
    req_id:number
    request_no: number;
    request_status: PackMatReqStatusEnum;
    mat_request_on: string;
    mat_request_by: string;
    mat_fulfill_date_time: string
}