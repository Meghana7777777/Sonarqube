export class QualityTypeDto {
    id: number;
    qualityType: string;
    versionFlag: number;
    isActive: boolean;
    constructor(
        id: number,
        qualityType: string,
        versionFlag: number,
        isActive: boolean,
    ) {
        this.id = id
        this.qualityType = qualityType;
        this.versionFlag = versionFlag;
        this.isActive = isActive;
    }
}


export class QualityTypeActivateDeactivateDto {
    id: number
    isActive?: boolean
    versionFlag?: number


    constructor(id: number, isActive?: boolean, versionFlag?: number) {
        this.id = id;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }

}