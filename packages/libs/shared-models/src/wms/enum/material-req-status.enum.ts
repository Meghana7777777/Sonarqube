export enum MaterialReqStatusEnum {
    OPEN = 'OP',
    PREPARING_MATERIAL = 'PM',
    MATERIAL_ISSUED = 'ISS',
    MATERIAL_NOT_AVL = 'MNA'
  }
  
  export const MaterialReqStatusEnumDisplayValue =  {
    [MaterialReqStatusEnum.OPEN]: 'Open',
    [MaterialReqStatusEnum.PREPARING_MATERIAL]: 'Preparing Material',
    [MaterialReqStatusEnum.MATERIAL_ISSUED]: 'Material Issued',
    [MaterialReqStatusEnum.MATERIAL_NOT_AVL]: 'Material Not Available'
  }
  