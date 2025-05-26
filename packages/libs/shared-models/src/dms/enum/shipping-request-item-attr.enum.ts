

/**
 * NOTE: 
 * When you add or remove any field in here, dont forget to update SRequestItemAttributeEntity
 * 
 */
// this enum has also the mapping to the database column for the SRequestItemAttributeEntity. So beware of modifying this
export enum DSetItemAttrEnum {
    MO = 'l1', // mo number
    PSTREF = 'lm1', // plant style REF
    CO = 'l3', // customer order no
    VPO = 'l4', // vendor purchase no
    PNM = 'lm2', // product name
    DDT = 'l8', // delivery date
    DEST = 'l5', // destination
    STY = 'l2', // style
    BUY='lm4' //buyers
}

export const DSetItemAttrEnumDisplayValues = {
    l1: { l: 'Manufacturing Order' },
    lm1: { l: 'Plant Style Ref' },
    l3: { l: 'Co No' },
    l4: { l: 'Vpo' },
    lm2: { l: 'Product name' },
    l8: { l: 'Delivery Date' },
    l5: { l: 'Destination' },
    l2:{l:'style'},
    lm4:{l:'buyers'}
} 