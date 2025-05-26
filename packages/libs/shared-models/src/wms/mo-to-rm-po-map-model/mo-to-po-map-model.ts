export class MOToPOMappingModel {
    id: number;
    poNumber: string;
    moRefId: number;
    moNumber: string;
    plHeadRefId: number;
    packLisNo: string;
    constructor(poNumber: string, moRefId: number, moNumber: string, plHeadRefId: number, packLisNo: string,id:number) {
        this.poNumber = poNumber;
        this.moRefId = moRefId;
        this.moNumber = moNumber;
        this.plHeadRefId = plHeadRefId;
        this.packLisNo = packLisNo;
        this.id = id
    }
}