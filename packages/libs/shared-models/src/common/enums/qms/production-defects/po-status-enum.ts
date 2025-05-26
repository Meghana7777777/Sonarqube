export enum PoStatusEnum{
    OPEN = 'OPEN',
    PO_INPROGRESS = 'PO_INPROGRESS',
    SEWING_COMPLETED = 'SEWING_COMPLETED',
    PACKING = 'PACKING',
    COMPLETED = 'COMPLETED'
}

export const PoStatusEnumDisplay =[
    {name:"OPEN",displayValue:'OPEN'},
    {name:"PO_INPROGRESS",displayValue:'PO INPROGRESS'},
    {name:"SEWING_COMPLETED",displayValue:'SEWING COMPLETED'},
    {name:"PACKING",displayValue:'PACKING'},
    {name:"COMPLETED",displayValue:'COMPLETED'},
]