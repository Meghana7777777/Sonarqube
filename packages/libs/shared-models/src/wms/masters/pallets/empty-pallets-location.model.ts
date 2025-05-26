import { CommonRequestAttrs } from "../../../common";
import { CurrentPalletLocationEnum} from "../../enum";


export class EmptyPalletsLocationModel extends CommonRequestAttrs {
    currentPalletLocation:CurrentPalletLocationEnum;
    name: string;
    level:number;
    pallet_name:string;
    pallet_code:string;
    max_items:number;


    constructor(username: string, unitCode: string, companyCode: string, userId: number,currentPalletLocation:CurrentPalletLocationEnum, name: string,level:number, pallet_name:string,
        pallet_code:string,
        max_items:number ){
 
        super(username,unitCode,companyCode,userId);
        this.currentPalletLocation=currentPalletLocation;
        this.name=name;
        this.level=level;
        this.pallet_name=pallet_name;
        this.pallet_code=pallet_code;
        this.max_items=max_items

        
    }
}
