import { CommonRequestAttrs } from "../../common";

export class sizesModel {
    id:number;
    sizeCode: string; 
    sizeDesc: string; 
    sizeIndex:number;

    constructor(
        id:number,
        sizeCode: string,
        sizeDesc: string,
        sizeIndex:number
    ) {
        this.id=id;
        this.sizeCode = sizeCode;
        this.sizeDesc = sizeDesc;
        this.sizeIndex = sizeIndex;
        
    }
}