
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


export const ProcessTypeEnumDisplayValues = {
    LAY : 'Laying',
    CUT: 'Cutting',
    EMB: 'Embellishment',
    SEW: 'Sewing',
    WASH: 'Washing',
    FIN: 'Finishing',
    INS: 'Inspection',
    IRON: 'Ironing',
    DYE: 'Dyeing',
    FOLD: 'Folding',
    PACK: 'Packing',
    KNIT: 'Knitting',
    LINK: 'Linking',
    EMBR: 'Embroidery'
}

export const SingleProcessTypes = [ProcessTypeEnum.CUT,ProcessTypeEnum.KNIT,ProcessTypeEnum.PACK]
