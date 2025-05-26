import { CommonRequestAttrs } from "../../common";

export class LayItemAddRequest extends CommonRequestAttrs {
    layId: number; // the pk of the po_docket_lay
    itemId: number;
    itemBarcode: string;
    layedPlies: number;
    layedQuantity: number; // The amount of material that was spread in yards
    endBits: number;
    damages: number;
    remarks: string;
    layStartTime: string;// TO IGNORE
    layEndTime: string;  // TO IGNORE
    breakTime: string;   // TO IGNORE
    shortage: number;
    sequence: number ;
    jointsOverlapping :number;
    noOfJoints :number;
    remnantsOfOtherLay:number;
    halfPlieOfPreRoll:number;
    fabricDefects:number;
    usableRemains:number;
    unUsableRemains:number;
    shadePlies: ShadePliesModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        layId: number,
        itemId: number,
        itemBarcode: string,
        layedPlies: number,
        layedQuantity: number,
        endBits: number,
        damages: number,
        remarks: string,
        layStartTime: string,
        layEndTime: string,
        breakTime: string,
        shortage: number,
        sequence: number ,
        jointsOverlapping :number,
        noOfJoints :number,
        remnantsOfOtherLay:number,
        halfPlieOfPreRoll:number,
        fabricDefects:number,
        usableRemains:number,
        unUsableRemains:number,
        shadePlies: ShadePliesModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.layId = layId;
        this.itemId = itemId;
        this.itemBarcode = itemBarcode;
        this.layedPlies = layedPlies;
        this.layedQuantity = layedQuantity;
        this.endBits = endBits;
        this.damages = damages;
        this.remarks = remarks;
        this.layStartTime = layStartTime;
        this.layEndTime = layEndTime;
        this.breakTime = breakTime;
        this.shortage = shortage;
        this.sequence=sequence ;
        this.jointsOverlapping=jointsOverlapping;
        this.noOfJoints =noOfJoints;
        this.remnantsOfOtherLay=remnantsOfOtherLay;
        this.halfPlieOfPreRoll=halfPlieOfPreRoll;
        this.fabricDefects=fabricDefects;
        this. usableRemains=usableRemains;
        this.unUsableRemains=unUsableRemains;
        this.shadePlies = shadePlies;
    }
}


export class ShadePliesModel {
    shadeTitle: string;
    plies: number;

    constructor(shadeTitle: string, plies: number){
       this.shadeTitle = shadeTitle
       this.plies = plies
    }
}