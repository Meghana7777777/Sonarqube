

/**
 * NOTE: 
 * When you add or remove any field in here, dont forget to update SRequestItemAttributeEntity
 * 
 */
// this enum has also the mapping to the database column for the SRequestItemAttributeEntity. So beware of modifying this
export enum PkShippingRequestItemAttrEnum {
    TOT_CTN = 'li1', //total cartons for the DSet
    TOT_QTY = 'li2', // total FGs of the DSet
    DEL_DATE = 'lm1', // del dates
    DEST = 'lm2', // destinations
    BUYER = 'lm3', // buyers
    STYLES = 'lt1', // styles
    MO = 'l1',
    VPO = 'l2',
    CO = 'l3'
}

export const PkDSetItemAttrEnumDisplayValues = {
    li1: { l: 'total cartons' },
    li2: { l: ' total FGs' },
    lm1: { l: 'delete dates' },
    lm2: { l: 'destinations' },
    lm3: { l: 'buyers' },
    lt1: { l: 'styles' },
    l1: { l: 'Mo Number' },
    l2: { l: 'VPO' },
    l3: { l: 'CO' },
}
