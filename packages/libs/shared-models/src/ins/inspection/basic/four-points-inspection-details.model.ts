import { InsFourPointPositionEnum, InsTrimDefectTypesEnum } from "../../enum";



export class InsFourPointsInspectionRollDetails {
    id?: number;
    atMeter: number;
    reason: string;
    reasonId:  number;
    points: number;
    remarks: string;
    pointPosition: InsFourPointPositionEnum;
}; 


export class YarnInsInspectionConeDetails {
    id?: number;
    slubs: number;
    neps: number;
    yarnBreaks: number;
    contamination: string;
    remarks: string;
};


export class ThreadInsInspectionConeDetails {
    id?: number;
    slubs: number;
    neps: number;
    yarnBreaks: number;
    contamination: string;
    remarks: string;
};


export class TrimInsInspectionConeDetails {
    id?: number;
    defectDescription:string;
    defectQuantity:number;
    defectType:InsTrimDefectTypesEnum

};