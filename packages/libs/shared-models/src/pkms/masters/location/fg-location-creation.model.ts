import { CommonRequestAttrs } from "../../../common";


export class FgLocationCreationModel extends CommonRequestAttrs {
    name: string;
    code: string;
    spcount: number;
    level:number;
    rackId:number;
    column:number;
    // preferredstoraageMateial:string;
    barcodeId:string;
    length:number;
    width:number;
    height:number;
    latitude:string;
    longitude:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,names: string,code: string,spcount: number,level: number,rackId:number,column:number,barcodeId:string,length:number,width:number,height:number,latitude:string,longitude:string){
        super(username,unitCode,companyCode,userId);
        this.name=names;
        this.code=code;
        this.spcount=spcount;
        this.level=level;
        this.rackId=rackId;
        this.column=column;
        // this.preferredstoraageMateial=preferredstoraageMateial;
        this.barcodeId=barcodeId;
        this.length=length;
        this.width=width;
        this.height=height;
        this.latitude=latitude;
        this.longitude=longitude;
    }
}
