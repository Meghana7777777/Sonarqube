export class QMS_LocVsQualitytypeDefectsModel{
    location : string
    qualityType : string
    defectQty : number
    constructor(location : string,qualityType : string,defectQty : number){
        this.location = location;
        this.qualityType = qualityType;
        this.defectQty = defectQty;
    }
}