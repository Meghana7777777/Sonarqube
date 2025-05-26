
export enum PackMatReqStatusEnum {
    OPEN = 'OP',
    PREPARING_MATERIAL = 'PM',
    MATERIAL_NOT_AVL = 'MNA',
    MATERIAL_READY = 'MR',
    MATERIAL_ON_TROLLEY = 'MOT',
    MATERIAL_IN_TRANSIT = 'MIT',
    REACHED_DESITNATION = 'RD',
    MATERIAL_ISSUED = 'ISS'
}

export const PackMatReqStatusChangeOrder = {
    0: 'OP',
    1: 'PM',
    2: 'MNA',
    3: 'MR',
    4: 'MOT',
    5: 'MIT',
    6: 'ISS',
    7: 'RD'
}

export const PackMatReqStatusDisplayValue = {
    [PackMatReqStatusEnum.OPEN]: 'Open',
    [PackMatReqStatusEnum.PREPARING_MATERIAL]: 'Preparing Material',
    [PackMatReqStatusEnum.MATERIAL_NOT_AVL]: 'Material Not Available',
    [PackMatReqStatusEnum.MATERIAL_READY]: 'Material Ready',
    [PackMatReqStatusEnum.MATERIAL_ON_TROLLEY]: 'Material On Trolley',
    [PackMatReqStatusEnum.MATERIAL_IN_TRANSIT]: 'Material In Transit',
    [PackMatReqStatusEnum.REACHED_DESITNATION]: 'Reached Destination',
    [PackMatReqStatusEnum.MATERIAL_ISSUED]: 'Material Issued',
}