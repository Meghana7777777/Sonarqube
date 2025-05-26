import { InsShrinkageTypeEnum } from "@xpparel/shared-models";


export class ShrinkageTypeDetailsQryResp {
    shrinkage_type: InsShrinkageTypeEnum;
    a_sk_length: number;
    a_sk_width: number;
    sk_group: string;
    // ph_item_line_sample_id: number;
    uom: string;
    length_after_sk: number;
    width_after_sk: number;
    remarks: string;
}