
export enum WhReqByObjectEnum {
    KNITTING = 'KNITTING',
    SEWING = 'SEWING',
    DOCKET = 'DOCKET',
    PACKING = 'PACKING',
}
export const WhReqByObjectStep = {
    [WhReqByObjectEnum.KNITTING]: 0,
    [WhReqByObjectEnum.SEWING]: 1,
    [WhReqByObjectEnum.DOCKET]: 2,
    [WhReqByObjectEnum.PACKING]: 3,
}

export const WhReqByObjectStepToEnum = {
    0: WhReqByObjectEnum.KNITTING,
    1: WhReqByObjectEnum.SEWING,
    2: WhReqByObjectEnum.DOCKET,
    3: WhReqByObjectEnum.PACKING,
}


export enum WhReqByObjectISSEnum {
    KNITTING = 'ISS-KNIT',
    SEWING = 'ISS-SEW',
    DOCKET = 'ISS-DOC',
    PACKING = 'ISS-PACK',
}