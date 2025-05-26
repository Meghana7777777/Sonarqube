
export enum WhMatReqLineStatusEnum {
    OPEN = 'OP',
    PREPARING_MATERIAL = 'PM',
    MATERIAL_NOT_AVL = 'MNA',
    MATERIAL_READY = 'MR',
    MATERIAL_ON_TROLLEY = 'MOT',
    MATERIAL_IN_TRANSIT = 'MIT',
    REACHED_DESITNATION = 'RD',
    MATERIAL_ISSUED = 'ISS'
}

export const WhMatReqLineStatusChangeOrder = {
    0: 'OP',
    1: 'PM',
    2: 'MNA',
    3: 'MR',
    4: 'MOT',
    5: 'MIT',
    6: 'ISS',
    7: 'RD'
}

export const WhMatReqLineStatusDisplayValue = {
    [WhMatReqLineStatusEnum.OPEN]: 'Open',
    [WhMatReqLineStatusEnum.PREPARING_MATERIAL]: 'Preparing Material',
    [WhMatReqLineStatusEnum.MATERIAL_NOT_AVL]: 'Material Not Available',
    [WhMatReqLineStatusEnum.MATERIAL_READY]: 'Material Ready',
    [WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY]: 'Material On Trolley',
    [WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT]: 'Material In Transit',
    [WhMatReqLineStatusEnum.REACHED_DESITNATION]: 'Reached Destination',
    [WhMatReqLineStatusEnum.MATERIAL_ISSUED]: 'Material Issued',
}