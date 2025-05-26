// NOTE: This enum must not exceed 2 CHARACTERS
// NOTE: HAVE TO BE OPTIMIZED
export enum ProcessTypeEnum {
    LAY='LAY',
    CUT='CUT',
    EMB='EMB',
    SEW='SEW',
    WASH='WASH',
    FIN='FIN',
    INS='INS',
    IRON='IRON',
    DYE='DYE',
    FOLD='FOLD',
    PACK='PACK',
    KNIT='KNIT',
    LINK='LINK',
    EMBR='EMBR'
}

export const processTypeEnumDisplayValues = {
    KNIT: 'Knitting',
    LINK: 'Linking',
    SEW: 'Sewing',
    LAY: 'Laying',
    CUT: 'Cutting',
    EMB: 'Embellishment',   
    WASH: 'Washing',
    FIN: 'Finishing',
    INS: 'Inspection',
    IRON: 'Ironing',
    DYE: 'Dyeing',
    FOLD: 'Folding',
    PACK: 'Packing',
    EMBR: 'Embroidery'
}

export const processTypeEnumKeys = {
    Knitting: 'KNIT',
    Linking: 'LINK',
    Sewing: 'SEW',
    Laying: 'LAY',
    Cutting: 'CUT',
    Embellishment: 'EMB',
    Washing: 'WASH',
    Finishing: 'FIN',
    Inspection: 'INS',
    Ironing: 'IRON',
    Dyeing: 'DYE',
    Folding: 'FOLD',
    Packing: 'PACK',
    Embroidery: 'EMBR'
};

export const SingleProcessTypes = [ProcessTypeEnum.CUT,ProcessTypeEnum.KNIT,ProcessTypeEnum.PACK]

export const sewPlanProcessTypeOptions = [ProcessTypeEnum.DYE,ProcessTypeEnum.EMB,ProcessTypeEnum.FIN,ProcessTypeEnum.FOLD,ProcessTypeEnum.INS,ProcessTypeEnum.IRON,ProcessTypeEnum.LINK,ProcessTypeEnum.SEW]