export enum PackListLoadingStatus {
    //match with vehicle unloading status in gatex
    IN = 0,
    UN_LOADING_START = 2,
    UN_LOADING_PAUSED = 3,
    UN_LOADING_COMPLETED = 5,
    OUT = 6
}


export const PackListLoadingStatusDisplayValue =  {
    0: 'Vehicle In',
    2: 'Unloading Started',
    3: 'Unloading Paused',
    5: 'Unloading Completed',
    6: 'Vehicle Out',
}

