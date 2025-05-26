export class GetAllBinsByRackIdDto{
    lRackId: number;
    code: string;
    constructor(lRackId: number, code: string){
        this.lRackId = lRackId
        this.code = code
    }
}