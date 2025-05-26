import { MaterialTypeEnum } from "@xpparel/shared-models"

export class PackMtSummaryRes {
    mrno: string
    pack_jobs: []
    item_id: number
    item_code: string
    qty: number
    item_category: MaterialTypeEnum
    map_id: number;
    issued_qty: number;
}


export class PackJobsGroup {
    pack_job_number: number
    pack_number: string
}

