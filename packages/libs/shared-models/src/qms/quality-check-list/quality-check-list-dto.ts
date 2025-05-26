
export class QualityCheckListDto {
    qualityCheckListId?: number
    qualityTypeId?: number
    parameter?: string
    constructor(
        qualityCheckListId?: number,
        qualityTypeId?: number,
        parameter?: string,
    ) {
        this.qualityCheckListId = qualityCheckListId
        this.qualityTypeId = qualityTypeId
        this.parameter = parameter
    }
}