
export class PKMSCartonAttrsModel {
    col: string;
    sz: string;
    pName: string;
    qty: number;
    moLine: number;
    constructor(
        col: string,
        sz: string,
        pName: string,
        qty: number,
        moLine: number,
    ) {
        this.col = col;
        this.sz = sz;
        this.pName = pName;
        this.qty = qty;
        this.moLine = moLine;
    }
}