export enum InsMasterdataCategoryEnum {
    WAREHOUSE = 'WAREHOUSE',
    INSPECTION = 'INSPECTION',
    CUTTING = 'CUTTING',
    RETURN = 'RETURN'
}

export enum InsTypesForMasterEnum {
    FABRICINS = "FABRICINS",
    FGINS = "FGINS",
    THREADINS = "THREADINS",
    TRIMINS = 'TRIMINS',
    YARNINS = 'YARNINS'
} 

export const InsTypesForMasterEnumDisplayValues = {
    [InsTypesForMasterEnum.FABRICINS]: 'Fabric Inspection',
    [InsTypesForMasterEnum.FGINS]: 'Finished Goods Inspection',
    [InsTypesForMasterEnum.THREADINS]: 'Thread Inspection',
    [InsTypesForMasterEnum.TRIMINS]: 'Trim Inspection',
    [InsTypesForMasterEnum.YARNINS]: 'Yarn Inspection'
}
