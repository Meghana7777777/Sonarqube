import { MeasuredRefEnum } from "@xpparel/shared-models"

export class RelaxationPointValuesQryResp {
    width: number
    measured_ref: MeasuredRefEnum;
    measured_at: number;
    measured_order: number;
}

export class RelaxationValuesQryResp {
    rollId: number    
    relaxedDateTime: string
    relaxedDate: string
}