export enum PackFgUOMEnum {
    KGS = 'KGS',
    PCS = 'PCS',
    MTS = 'MTS',
    CM = 'CM',
}


export const ROUNDED_UOM_VALUES: { [key in PackFgUOMEnum]: number } = {
    [PackFgUOMEnum.KGS]: 2,
    [PackFgUOMEnum.PCS]: 0,
    [PackFgUOMEnum.MTS]: 2,
    [PackFgUOMEnum.CM]: 2,
};

export function roundValueBasedOnUOM(value: number, uom: PackFgUOMEnum): number {
    const precision = ROUNDED_UOM_VALUES[uom];
    if (value)
        return Number(value.toFixed(precision));
    else
        return 0
}