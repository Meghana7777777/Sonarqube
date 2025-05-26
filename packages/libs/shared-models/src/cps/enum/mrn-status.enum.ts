
export enum MrnStatusEnum {
    OPEN = 'OP',
    APPROVED = 'APR',
    REJECTED = 'REJ',
    ISSUED = 'ISS'
}

export const mrnStatusOrder = {
    OP: 1,
    APR: 2,
    REJ: 2,
    ISS: 3
}

export const mrnStatusEnumDiplayValues = {
    OP: 'Open',
    APR: 'Approved',
    REJ: 'Rejected',
    ISS: 'Issued'
}

