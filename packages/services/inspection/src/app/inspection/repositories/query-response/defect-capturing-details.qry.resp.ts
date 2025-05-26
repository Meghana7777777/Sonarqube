import { InsFourPointPositionEnum } from "@xpparel/shared-models";

export class DefectCapturingDetailsResp {
    id: number;
    point_length: number;
    point_value: number;
    reason: string;
    reason_id: number;
    remarks: string;
    point_position: InsFourPointPositionEnum;
}

export class YarnDefectCapturingDetailsResp
{
    id?: number;
    slubs: number;
    neps: number;
    yarnBreaks: number;
    contamination: string;
    remarks: string;
}