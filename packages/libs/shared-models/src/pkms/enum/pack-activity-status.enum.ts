export enum PackActivityStatusEnum {
    OPEN = "OPEN",
    MATERIAL = "MATERIAL",
    RECEIVED = "RECEIVED",
    INPROGRESS = "INPROGRESS",
    COMPLETED = "COMPLETED"
}

export enum PackInspectionStatusEnum {
    OPEN='OPEN',
    INPROGRESS ='INPROGRESS',
    COMPLETED ='COMPLETED'
}

export const PackInspectionStatusEnumDisplayValue =  {
    OPEN: 'Inspection Pending',
    INPROGRESS : 'Inspection Inprogress',
    COMPLETED : 'Inspection Completed'
}