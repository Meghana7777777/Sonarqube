/**
 * NOTE: 
 * When you add or remove any field in here, dont forget to update DSetSubItemAttrEntity
 * 
 */

// this enum has also the mapping to the database column for the DSetSubItemAttrEntity. So beware of modifying this
export enum PkDSetSubItemAttrEnum {
    SZ = 'l1', // size
    SHD = 'l2', //  shade of bundle
    BNO = 'l3', // bundle no
    COL = 'lm1', // fg color
}

export const PkDSetSubItemAttrEnumDisplayValues = {
    l1: { l: 'Size' },
    l2: { l: 'Shade' },
    l3: { l: 'Bundle No' },
    lm1: { l: 'Color' }
}


