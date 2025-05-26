
export enum OrderTypeEnum {
    ORIGINAL = 'OR',
    EXTRA_SHIPMENT = 'ES',
    SAMPLE = 'SA',
    EXCESS = 'EX',
    CUT_WASTAGE = 'CW'
}

export const OrderTypeDisplayValues = {
    OR: 'Original',
    ES: 'Extra Shipment',
    SA: 'Sample',
    EX: 'Excess',
    CW: 'Cut Wastage'
} 

export const OrderTypeKeys: OrderTypeEnum[] = [
    OrderTypeEnum.ORIGINAL, OrderTypeEnum.CUT_WASTAGE, OrderTypeEnum.EXTRA_SHIPMENT, OrderTypeEnum.SAMPLE
];