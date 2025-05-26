

/**
 * NOTE: 
 * When you add or remove any field in here, dont forget to update DSetItemAttrEntity
 * 
 */
// this enum has also the mapping to the database column for the DSetItemAttrEntity. So beware of modifying this
export enum DSetItemAttrEnum {
    MO = 'l1', // mo number
    PSTREF = 'lm1', // plant style REF
    CO = 'l3', // customer order no
    VPO = 'l4', // vendor purchase no
    PNM = 'lm2', // product name
    CNO = 'l6', // cut no
    CSNO = 'l7', // cut sub number
    DDT = 'l8', // delivery date
    DEST = 'l5', // destination
    STY = 'l2', // style
    COMPS = 'lt1', // csv of components
    MOL = 'lt2', // csv of mo lines
    COL = 'l9', // color defined by the user
    LIDS = 'l10' // csv of lay ids of main docket
}

export const DSetItemAttrEnumDisplayValues = {
    l1: { l: 'Manufacturing Order' },
    l2: { l: 'Plant Style Ref' },
    l3: { l: 'Co No' },
    l4: { l: 'Vpo' },
    l5: { l: 'Destination' },
    l6: { l: 'Cut No' },
    l7: { l: 'Cut Sub Number' },
    l8: { l: 'Delivery Date' },
    l9: { l: 'Color' },
    lm1: { l: 'Style' },
    lm2: { l: 'Product name' },
    lt1: { l: 'Components' },
    lt2: { l: 'Mo Lines' },
    l10: { l: 'Lay Ids of main docket'}
}