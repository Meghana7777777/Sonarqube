import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class RacksCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    levels: number;
    wcode:string;
    columns:number;
    preferredstoraageMateial:PreferredStorageMaterialEnum;
    priority:number;
    isActive:boolean;
    barcodeId:string;
    capacityInMts: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,levels: number,wcode:string,columns:number,preferredstoraageMateial:PreferredStorageMaterialEnum,priority:number,isActive:boolean,barcodeId:string,capacityInMts: number){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.levels=levels;
        this.wcode=wcode;
        this.columns=columns;
        this.preferredstoraageMateial=preferredstoraageMateial;
        this.priority=priority;
        this.isActive=isActive;
        this.barcodeId=barcodeId;
        this.capacityInMts = capacityInMts;
    }
}
