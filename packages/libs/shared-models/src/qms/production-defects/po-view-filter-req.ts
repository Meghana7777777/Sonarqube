export class PoViewFilterReq{
    poId?:number;
    buyerId?:number;

    constructor(poId?:number,buyerId?:number){
        this.poId = poId
        this.buyerId = buyerId
    }
}