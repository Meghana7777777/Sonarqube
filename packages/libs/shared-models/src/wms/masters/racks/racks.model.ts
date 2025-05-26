import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class RacksCreationModel extends CommonRequestAttrs {
    id: number | any;
    name: string;
    code: string;
    levels: number;
    wcode:string;
    columns:number;
    preferredstoraageMateial:PreferredStorageMaterialEnum;
    priority:number;
    barcodeId:string;
    capacityInMts:number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,name: string,code: string,levels: number,wcode:string,columns:number,preferredstoraageMateial:PreferredStorageMaterialEnum,priority:number,barcodeId:string,capacityInMts:number ){
 
        super(username,unitCode,companyCode,userId);
        this.id = id;
        this.name=name;
        this.code=code;
        this.levels=levels;
        this.wcode=wcode;
        this.columns=columns;
        this.preferredstoraageMateial=preferredstoraageMateial;
        this.priority=priority;
        this.barcodeId=barcodeId;
        this.capacityInMts = capacityInMts;
    }
}
