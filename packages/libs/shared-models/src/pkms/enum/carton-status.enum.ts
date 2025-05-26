
export enum CartonStatusEnum {
    OPEN = "OPEN",
    INPROGRESS = "INPROGRESS",
    COMPLETED = "COMPLETED",
    NA = "N/A",

}


export const cartonBarcodeRegExp = 'F:[\\da-fA-F]+-\\d+-\\d+'
export const cartonBarcodePatternRegExp =  /^F:[\da-fA-F]+-\d+-\d+$/;