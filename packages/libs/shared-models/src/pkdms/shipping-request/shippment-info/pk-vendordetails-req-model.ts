
export class VendorDetailsReq{
    sReqId: number;
    unitCode: string;
    companyCode: string;
    constructor( sReqId: number, unitCode: string, companyCode: string,){
        this.sReqId = sReqId
        this.companyCode = companyCode
        this.unitCode = unitCode
    }

}