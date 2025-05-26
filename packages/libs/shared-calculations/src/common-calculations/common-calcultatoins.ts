
export function docketRequirementWithoutBinding(plies: number, mkLength: number, wastagePerc?: number): number {
    if (wastagePerc) {
        return Number((Number(mkLength) * Number(plies) * (1 + Number(wastagePerc) / 100)).toFixed(2));
    }
    return Number((Number(mkLength) * Number(plies)).toFixed(2));
}

export function docketBindingRequirement(docketQty: number, bindingCons: number, wastagePerc?: number): number {
    if (wastagePerc) {
        return Number((Number(docketQty) * Number(bindingCons) * (1 + Number(wastagePerc) / 100)).toFixed(2));
    }
    return Number((Number(docketQty) * Number(bindingCons)).toFixed(2));
}

export const docketRequirement = (qty: number, consumption: number, wastagePerc?: number) => {
    if (wastagePerc) {
        return Number((Number(qty) * Number(consumption) * (1 + Number(wastagePerc) / 100)).toFixed(2));
    }
    return Number((Number(qty) * Number(consumption)).toFixed(2));
}