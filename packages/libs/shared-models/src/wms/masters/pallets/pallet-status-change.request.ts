import { CommonRequestAttrs } from "../../../common";
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, PalletBehaviourEnum } from "../../enum";


export class PalletstatusChangeRequest extends CommonRequestAttrs {
    palletId: number;
    currentPalletState: CurrentPalletStateEnum;
    currentPalletLocation: CurrentPalletLocationEnum;   
    palletBehavior: PalletBehaviourEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, palletId: number,currentPalletState: CurrentPalletStateEnum,currentPalletLocation: CurrentPalletLocationEnum, palletBehavior: PalletBehaviourEnum){
 
        super(username,unitCode,companyCode,userId);
        this.palletId=palletId;
        this.currentPalletState=currentPalletState;
        this.currentPalletLocation=currentPalletLocation;
        this.palletBehavior=palletBehavior;
        
    }
}