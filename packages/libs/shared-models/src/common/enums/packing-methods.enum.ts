export enum PackingMethodsEnum {
    SCSS = "SCSS",
    SCMS = "SCMS",
    MCSS = "MCSS",
    MCMS = "MCMS"
}

export const packingMethodsEnumEnumDisplayValues = {
    [PackingMethodsEnum.SCSS]: "Single Color Single Size",
    [PackingMethodsEnum.SCMS]: "Single Color Multiple Size",
    [PackingMethodsEnum.MCSS]: "Multiple Color Single Size",
    [PackingMethodsEnum.MCMS]: "Multiple Color Multiple Size"
}