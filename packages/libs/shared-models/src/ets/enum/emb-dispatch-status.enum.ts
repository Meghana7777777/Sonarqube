
export enum EmbDispatchStatusEnum {
    OPEN = 'OP',
    SENT = 'SE',
    RECEIVED = 'RE'
}

export const embDispatchStatusOrder = {
    OP: 1,
    SE: 2,
    RE: 3
}

export const embDispatchStatusEnumDisplayValues = {
    OP: 'Open',
    SE: 'Sent to Vendor',
    RE: 'Received to Unit'
}