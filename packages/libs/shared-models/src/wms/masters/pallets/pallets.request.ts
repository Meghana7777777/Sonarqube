import { CommonRequestAttrs } from "../../../common";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum, PreferredStorageMaterialEnum } from "../../enum";


export class PalletsCreateRequest extends CommonRequestAttrs {
    id:number;
    name: string;
    code: string;
    fabricCapacity: number;
    fabricUom:string;
    weightCapacity:string;
    weightUom:string;
    currentBinId:string;
    currentPalletState:CurrentPalletStateEnum;
    currentPalletLocation:CurrentPalletLocationEnum;
    palletBeahvior:PalletBehaviourEnum;
    freezeStatus:string;
    isActive:boolean;
    maxItems:number;
    barcodeId:string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id:number,names: string,code: string,fabricCapacity: number,fabricUom: string,weightCapacity:string,weightUom:string,currentBinId:string,currentPalletState:CurrentPalletStateEnum,currentPalletLocation:CurrentPalletLocationEnum,palletBeahvior:PalletBehaviourEnum,freezeStatus:string,isActive:boolean,maxItems:number,barcodeId:string){
 
        super(username,unitCode,companyCode,userId);
        this.id=id;
        this.name=names;
        this.code=code;
        this.fabricCapacity=fabricCapacity;
        this.fabricUom=fabricUom;
        this.weightCapacity=weightCapacity;
        this.weightUom=weightUom;
        this.currentBinId=currentBinId;
        this.currentPalletState=currentPalletState;
        this.currentPalletLocation=currentPalletLocation;
        this.palletBeahvior=palletBeahvior;
        this.freezeStatus=freezeStatus;
        this.isActive=isActive;
        this.maxItems=maxItems;
        this.barcodeId=barcodeId;
        
    }
}
