export class InsCartonDataModel {
    id:number;
    requiredQty: number;
    grossWeight:number;
    barcode:string;
    netWeight:number;
    packJobId:number;
    constructor(requiredQty: number,id:number,grossWeight:number,barcode:string,netWeight:number,packJobId:number) {
        this.requiredQty = requiredQty;
        this.id=id;
        this.grossWeight=grossWeight;
        this.barcode=barcode;
        this.netWeight=netWeight;
        this.packJobId=packJobId;
    }
}