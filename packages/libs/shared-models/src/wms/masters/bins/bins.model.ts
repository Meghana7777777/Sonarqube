import { CommonRequestAttrs } from "../../../common";


export class BinsCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    spcount: number;
    level:number;
    rackId:number;
    column:number;
    // preferredstoraageMateial:string;
    barcodeId:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,names: string,code: string,spcount: number,level: number,rackId:number,column:number,barcodeId:string){
        super(username,unitCode,companyCode,userId);
        this.name=names;
        this.code=code;
        this.spcount=spcount;
        this.level=level;
        this.rackId=rackId;
        this.column=column;
        // this.preferredstoraageMateial=preferredstoraageMateial;
        this.barcodeId=barcodeId;
    }
}
