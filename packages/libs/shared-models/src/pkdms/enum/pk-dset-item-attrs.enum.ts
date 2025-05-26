

/**
 * NOTE: 
 * When you add or remove any field in here, dont forget to update DSetItemAttrEntity
 * 
 */
// this enum has also the mapping to the database column for the DSetItemAttrEntity. So beware of modifying this
export enum PkDSetItemAttrEnum {
    MO = 'l1', // mo number
    PSTREF = 'lm1', // plant style REF
    CO = 'l3', // customer order no
    VPO = 'l4', // vendor purchase no
    DEST = 'lm2', // destination
    DDT = 'l8', // delivery date
    PNM = 'lt1', // product name
    STY = 'l2', // style
    BUY='lm4' //buyers
}

export const PkDSetItemAttrEnumDisplayValues = {
    l1: { l: 'Manufacturing Order' },
    lm1: { l: 'Plant Style Ref' },
    l3: { l: 'Co No' },
    l4: { l: 'Vpo' },
    lt1: { l: 'Product name' },
    l8: { l: 'Delivery Date' },
    lm2: { l: 'Destination' },
    l2:{l:'style'},
    lm4:{l:'buyers'}
} 



