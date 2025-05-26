

export enum CutStatusEnum {
    OPEN = 0,
    REP_INPROGRESS = 1,
    REV_INPROGRESS = 2,
    COMPLETED = 3,
    HOLD = 99
}

export const cutStatusEnumDisplayValues = {
    0: 'Open',
    1: 'Rep In progress',
    2: 'Rev In progress',
    3: 'Completed',
    99: 'Hold'
}